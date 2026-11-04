import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { sqliteAdapter } from "../src/server/local-estimate-store";
import { recoverEstimate, recoverPendingEstimates } from "../src/server/estimate-recovery";
import { SubmissionSession } from "../src/lib/pricing-calculator/submission-session";
import { partialContext } from "../src/lib/pricing-calculator/presentation";
import {
  calculateEstimate,
  feeCents,
  range,
} from "../src/lib/pricing-calculator/calculate-estimate";
import {
  submissionSchema,
  type Basics,
  type Submission,
} from "../src/lib/pricing-calculator/validation";
import {
  pricingItems,
  disclaimer,
  exclusions,
  pricingVersion,
} from "../src/config/pricing-calculator";
import { schema, type EstimateDB, type Snapshot } from "../src/server/estimate-store";
import { handleEstimate } from "../src/server/pricing-estimates";
import { estimateEmail } from "../src/server/estimate-email";
import { estimatePdf } from "../src/server/estimate-pdf";
import {
  dueFollowups,
  type FollowupReadiness,
  type FollowupLead,
} from "../src/server/estimate-followup";
import { verifiedScheduler } from "../src/config/consultation";
const basics: Basics = {
  audience: "client",
  service: "planning",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  guestCount: 50,
  ownFeePercent: 0,
};
const selection = (
  id: string,
  tier: "economic" | "average" | "lux" = "economic",
  quantity = 1,
) => ({ id, tier, quantity });
const calc = (b = basics, s = [selection("chairs")]) =>
  calculateEstimate(b, s, { allowReferencePrices: true });
const payload = (): Submission => ({
  reference: crypto.randomUUID(),
  catalogVersion: pricingVersion,
  basics: { ...basics },
  selections: [selection("chairs")],
  contact: {
    firstName: "Test",
    email: "review@example.invalid",
    phone: "",
    businessName: "",
    instagram: "",
    clientPurpose: "current",
    marketingConsent: false,
  },
  attribution: {},
});
function database() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(schema);
  const db = sqliteAdapter(sqlite);
  return { sqlite, db };
}
const request = (p: Submission) =>
  new Request("https://test.invalid/api/pricing-estimates", {
    method: "POST",
    headers: { origin: "https://test.invalid", "content-type": "application/json" },
    body: JSON.stringify(p),
  });
const env = (db: EstimateDB) => ({
  ESTIMATES_DB: db,
  SITE_ORIGIN: "https://test.invalid",
  ESTIMATE_DELIVERY_ENABLED: "true",
  RESEND_API_KEY: "test-only",
  ESTIMATE_FROM_EMAIL: "test@example.invalid",
  ESTIMATE_TEAM_EMAIL: "team@example.invalid",
});
async function approvedSnapshot(db: EstimateDB, p: Submission) {
  const normalized = submissionSchema.parse(p);
  const hash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(normalized))),
    ),
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const snapshot: Snapshot = {
    schemaVersion: 2,
    catalogVersion: pricingVersion,
    data: normalized,
    estimate: calculateEstimate(p.basics, p.selections, {
      catalog: pricingItems.map((i) => ({
        ...i,
        status: i.status === "reference" ? "approved" : i.status,
      })),
    }),
    disclaimer,
    exclusions,
    createdAt: 1000,
    preview: false,
  };
  await db
    .prepare("INSERT INTO calculator_estimates_v2 VALUES(?,?,?,?)")
    .bind(p.reference, hash, JSON.stringify(snapshot), 1000)
    .run();
  await db.batch(
    ["visitor", "team"].map((channel) =>
      db
        .prepare(
          "INSERT INTO calculator_outbox_v2(id,reference,channel,envelope,status,created_at,lease_until) VALUES(?,?,?,'','pending',?,0)",
        )
        .bind(`${p.reference}-${channel}`, p.reference, channel, 1000),
    ),
  );
  return snapshot;
}
test("piecewise fee endpoints, crossings and cent boundaries", () => {
  for (const [subtotal, fee] of [
    [0, 0],
    [2499999, 500000],
    [2500000, 500000],
    [2500001, 500000],
    [4999999, 500000],
    [5000000, 500000],
    [5000001, 500000],
    [5000010, 500001],
  ])
    assert.equal(feeCents(subtotal), fee);
  for (const [a, b, fa, fb, ta, tb] of [
    [20250, 40000, 4050, 5000, 24300, 45000],
    [24000, 26000, 4800, 5000, 28800, 31000],
    [49000, 51000, 5000, 5100, 54000, 56100],
  ]) {
    assert.equal(feeCents(a * 100) / 100, fa);
    assert.equal(feeCents(b * 100) / 100, fb);
    assert.equal(a + fa, ta);
    assert.equal(b + fb, tb);
  }
});
test("mixed tiers, guest/table/quantity/flat bases and fee exceptions", () => {
  const s = [
    selection("chairs", "lux"),
    selection("centerpieces", "average"),
    selection("hmu", "economic", 3),
    selection("venue"),
  ];
  const a = calc(basics, s),
    b = calc({ ...basics, guestCount: 100 }, s);
  assert.equal(a.tables, 7);
  assert.equal(b.tables, 13);
  assert.equal(b.rows[0].min!, a.rows[0].min! * 2);
  assert.equal(a.rows[2].min, 300);
  assert.equal(a.rows[3].min, b.rows[3].min);
  assert.equal(calc({ ...basics, service: "alacarte" }, s).minimumServiceFee, 0);
  const planner = calc({ ...basics, audience: "planner", ownFeePercent: 12.5 }, s);
  assert.equal(planner.minimumServiceFee, 0);
  assert.equal(planner.minimumOwnFee, Math.round(planner.minimumSubtotal * 12.5) / 100);
  assert.ok(calc({ ...basics, audience: "planner", service: "design" }, s).minimumServiceFee > 0);
  assert.ok(
    calc({ ...basics, eventType: "Corporate event", guestCount: 250 }, s).maximumServiceFee > 0,
  );
});
test("service switching excludes vendors and restores original selections", () => {
  const s = [selection("venue"), selection("chairs", "lux")];
  const design = calc({ ...basics, service: "design" }, s);
  assert.deepEqual(design.excluded, [s[0]]);
  assert.equal(design.rows.length, 1);
  assert.equal(calc(basics, s).rows.length, 2);
  assert.equal(design.rows[0].tier, "lux");
});
test("missing and unapproved prices remain unknown; validation rejects malformed inputs", () => {
  assert.equal(calc(basics, [selection("balloon")]).rows[0].min, null);
  assert.equal(calculateEstimate(basics, [selection("chairs")]).rows[0].min, null);
  for (const guestCount of [0, 9, 1001, NaN]) assert.throws(() => calc({ ...basics, guestCount }));
  assert.throws(() => calc(basics, [selection("chairs"), selection("chairs")]));
  assert.throws(() => calc(basics, [selection("hmu", "economic", -1)]));
  assert.throws(() => calc(basics, [selection("unknown")]));
});
test("local save is durable, idempotent, conflict-aware, permits new estimate by same email", async () => {
  const { db, sqlite } = database(),
    p = payload();
  assert.equal((await handleEstimate(request(p), env(db), { preview: true })).status, 200);
  assert.equal((await handleEstimate(request(p), env(db), { preview: true })).status, 200);
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_estimates_v2").get()!.n, 1);
  assert.equal(
    (
      await handleEstimate(request({ ...p, basics: { ...basics, guestCount: 100 } }), env(db), {
        preview: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await handleEstimate(request({ ...p, reference: crypto.randomUUID() }), env(db), {
        preview: true,
      })
    ).status,
    200,
  );
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_estimates_v2").get()!.n, 2);
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_outbox_v2").get()!.n, 4);
  sqlite.close();
});
test("production holds unapproved prices and validates origin and input", async () => {
  const { db } = database();
  assert.equal((await handleEstimate(request(payload()), env(db))).status, 200);
  assert.equal(
    (await handleEstimate(new Request("https://test.invalid", { method: "POST" }), env(db))).status,
    403,
  );
  const p = payload();
  p.basics.guestCount = -1;
  assert.equal((await handleEstimate(request(p), env(db))).status, 400);
});
test("saved snapshot, email and PDF agree; failed visitor retry never duplicates team email", async () => {
  const { db, sqlite } = database(),
    p = payload(),
    snapshot = await approvedSnapshot(db, p);
  let visitor = 0,
    team = 0;
  const bodies: string[] = [];
  const transport: typeof fetch = async (_url, init) => {
    const body = String(init?.body);
    bodies.push(body);
    if (JSON.parse(body).to[0] === "review@example.invalid") {
      visitor++;
      if (visitor === 1) return Response.json({ error: "test" }, { status: 500 });
    } else team++;
    return Response.json({ id: "test-provider-id" });
  };
  assert.equal(
    (await (await handleEstimate(request(p), env(db), { transport })).json()).emailStatus,
    "failed",
  );
  assert.equal((await handleEstimate(request(p), env(db), { transport })).status, 200);
  assert.equal((await handleEstimate(request(p), env(db), { transport })).status, 200);
  assert.equal(visitor, 2);
  assert.equal(team, 1);
  assert.equal(bodies[0], bodies[2]);
  assert.ok(
    estimateEmail(snapshot).includes(
      range(snapshot.estimate.minimumTotal, snapshot.estimate.maximumTotal),
    ),
  );
  assert.ok(Buffer.from(estimatePdf(snapshot), "base64").toString().startsWith("%PDF-1.4"));
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_outbox_v2").get()!.n, 2);
  sqlite.close();
});
test("old ambiguous attempts require review; missing delivery config stays saved", async () => {
  const { db } = database(),
    p = payload();
  await approvedSnapshot(db, p);
  assert.equal(
    (await handleEstimate(request(p), { ...env(db), RESEND_API_KEY: undefined })).status,
    200,
  );
  const failed: typeof fetch = async () => Response.json({}, { status: 500 });
  await handleEstimate(request(p), env(db), { transport: failed, now: () => 100000 });
  let calls = 0;
  const result = await handleEstimate(request(p), env(db), {
    transport: async () => {
      calls++;
      return Response.json({ id: "never" });
    },
    now: () => 100000 + 24 * 3600000,
  });
  assert.equal(calls, 0);
  assert.equal((await result.json()).emailStatus, "needs_review");
});
test("scheduler validation and followup consent, booking, readiness, duplicate suppression", () => {
  assert.equal(verifiedScheduler("https://www.honeybook.com/widget/example", true), "");
  assert.equal(verifiedScheduler("https://calendly.com/test", true), "");
  const readiness: FollowupReadiness = {
    enabled: true,
    providerConfigured: true,
    copyApproved: true,
    bookingSignalReliable: true,
    suppressionReady: true,
    videoApproved: true,
  };
  const lead: FollowupLead = {
    audience: "planner",
    acceptedAt: 1000,
    marketingConsent: true,
    unsubscribed: false,
    bookingStatus: "not_booked",
    sentDays: [2],
  };
  assert.deepEqual(
    dueFollowups(lead, readiness, 1000 + 7 * 86400000).map((x) => x.day),
    [7],
  );
  for (const change of [
    { bookingStatus: "booked" as const },
    { bookingStatus: "unknown" as const },
    { unsubscribed: true },
    { marketingConsent: false },
  ])
    assert.deepEqual(dueFollowups({ ...lead, ...change }, readiness, 1e10), []);
  assert.deepEqual(dueFollowups(lead, { ...readiness, enabled: false }, 1e10), []);
});

test("concurrent retries lease each notification once", async () => {
  const { db, sqlite } = database();
  const p = payload();
  await approvedSnapshot(db, p);
  let unblock!: () => void, entered!: () => void;
  const started = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const gate = new Promise<void>((resolve) => {
    unblock = resolve;
  });
  let visitor = 0,
    team = 0;
  const transport: typeof fetch = async (_url, init) => {
    if (JSON.parse(String(init?.body)).to[0] === p.contact.email) {
      visitor++;
      entered();
      await gate;
    } else team++;
    return Response.json({ id: "test-accepted" });
  };
  const first = handleEstimate(request(p), env(db), { transport });
  await started;
  assert.equal(
    (await (await handleEstimate(request(p), env(db), { transport })).json()).emailStatus,
    "queued",
  );
  unblock();
  assert.equal((await first).status, 200);
  assert.equal(visitor, 1);
  assert.equal(team, 1);
  sqlite.close();
});

test("planner percentage precision and server body limits", async () => {
  assert.throws(() => calc({ ...basics, audience: "planner", ownFeePercent: 12.345 }));
  assert.doesNotThrow(() => calc({ ...basics, ownFeePercent: 12.34 }));
  const { db } = database();
  const oversized = new Request("https://test.invalid/api/pricing-estimates", {
    method: "POST",
    headers: { origin: "https://test.invalid", "content-type": "application/json" },
    body: "x".repeat(32769),
  });
  assert.equal((await handleEstimate(oversized, env(db))).status, 413);
});

test("partial estimates qualify UI, email and PDF and preserve exact fee-crossing scenario", () => {
  const p = payload();
  p.basics.guestCount = 100;
  p.selections = [selection("chairs"), selection("balloon")];
  const estimate = calc(p.basics, p.selections);
  assert.equal(estimate.minimumTotal, 720);
  assert.equal(estimate.maximumTotal, 1440);
  assert.equal(estimate.customCount, 1);
  assert.match(partialContext(estimate), /Priced items only.*1 additional item/);
  const snapshot: Snapshot = {
    schemaVersion: 2,
    catalogVersion: pricingVersion,
    data: p,
    estimate,
    disclaimer,
    exclusions,
    createdAt: 1,
    preview: true,
  };
  assert.match(estimateEmail(snapshot), /Priced items only.*1 additional item/);
  const pdf = Buffer.from(estimatePdf(snapshot), "base64").toString();
  assert.ok(pdf.includes("Priced items only: $720-$1,440"));
  assert.ok(pdf.includes("additional item requires a quote"));
  assert.ok(pdf.includes("Chairs / Economic / 100 x per guest: $600-$1,200"));
  assert.ok(pdf.includes("Catalog: " + pricingVersion));
  const complete = calc({ ...basics, guestCount: 250 }, [
    selection("catering", "lux"),
    selection("backdrop", "average"),
  ]);
  assert.deepEqual(
    [
      complete.minimumSubtotal,
      complete.maximumSubtotal,
      complete.minimumServiceFee,
      complete.maximumServiceFee,
      complete.minimumTotal,
      complete.maximumTotal,
    ],
    [20250, 40000, 4050, 5000, 24300, 45000],
  );
});

test("new stale catalog requires review and explicit resubmission; browser totals ignored", async () => {
  const { db, sqlite } = database(),
    p = payload();
  p.catalogVersion = "old-browser";
  const catalog = pricingItems.map((i) => ({
    ...i,
    tiers: i.id === "chairs" ? { ...i.tiers, economic: { minimum: 20, maximum: 30 } } : i.tiers,
  }));
  const changed = await handleEstimate(request({ ...p, minimumTotal: 1 } as Submission), env(db), {
    preview: true,
    catalog,
    version: "new-server",
  });
  const body = await changed.json();
  assert.equal(changed.status, 409);
  assert.equal(body.state, "pricing_changed");
  assert.equal(body.proposal.estimate.minimumTotal, 1200);
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_estimates_v2").get()!.n, 0);
  const reviewed = {
    ...p,
    reference: crypto.randomUUID(),
    catalogVersion: body.proposal.catalogVersion,
  };
  const saved = await (
    await handleEstimate(request(reviewed), env(db), {
      preview: true,
      catalog,
      version: "new-server",
    })
  ).json();
  assert.equal(saved.snapshot.estimate.minimumTotal, 1200);
  assert.equal(saved.snapshot.catalogVersion, "new-server");
  sqlite.close();
});

test("exact retries preserve snapshots after rates change and selected item retirement", async () => {
  const { db, sqlite } = database(),
    p = payload();
  const original = await (await handleEstimate(request(p), env(db), { preview: true })).json();
  const repriced = pricingItems.map((i) => ({
    ...i,
    tiers: i.id === "chairs" ? { economic: { minimum: 999, maximum: 1000 } } : i.tiers,
  }));
  const retried = await (
    await handleEstimate(request(p), env(db), {
      preview: true,
      catalog: repriced,
      version: "changed",
    })
  ).json();
  assert.deepEqual(retried.snapshot, original.snapshot);
  const retired = pricingItems.filter((i) => i.id !== "chairs");
  const afterRetirement = await (
    await handleEstimate(request(p), env(db), {
      preview: true,
      catalog: retired,
      version: "retired",
    })
  ).json();
  assert.deepEqual(afterRetirement.snapshot, original.snapshot);
  assert.equal(
    (
      await handleEstimate(
        request({ ...p, contact: { ...p.contact, firstName: "Conflict" } }),
        env(db),
        { preview: true, catalog: retired, version: "retired" },
      )
    ).status,
    409,
  );
  const next = {
    ...p,
    reference: crypto.randomUUID(),
    catalogVersion: "retired",
    selections: [selection("backdrop")],
  };
  assert.equal(
    (
      await handleEstimate(request(next), env(db), {
        preview: true,
        catalog: retired,
        version: "retired",
      })
    ).status,
    200,
  );
  sqlite.close();
});

test("inactive invalid planner and vendor quantity cannot block Design or client services", async () => {
  const bad = { ...basics, audience: "planner" as const, ownFeePercent: 123.456 };
  const items = [selection("hmu", "average", 0), selection("chairs")];
  assert.throws(() => calc(bad, items));
  assert.doesNotThrow(() => calc({ ...bad, service: "design" }, items));
  assert.doesNotThrow(() => calc({ ...bad, audience: "client" }, [selection("chairs")]));
  assert.throws(() => calc({ ...bad, ownFeePercent: 0 }, items));
  const { db } = database(),
    p = payload();
  p.basics = { ...bad, service: "design" };
  p.selections = items;
  const saved = await (await handleEstimate(request(p), env(db), { preview: true })).json();
  assert.equal(saved.snapshot.estimate.excluded[0].id, "hmu");
  assert.equal(saved.snapshot.data.selections[0].quantity, 0);
});

test("late response for email A cannot confirm edited email B or disable its new request", async () => {
  const session = new SubmissionSession();
  let confirmation: string | null = null;
  let finish!: (email: string) => void;
  const response = new Promise<string>((resolve) => {
    finish = resolve;
  });
  const a = session.start();
  const pending = response.then((email) => {
    if (session.accepts(a)) confirmation = email;
  });
  session.invalidate(); // Same invalidation used by contact edits and selection changes in the form.
  const b = session.start();
  finish("a@example.invalid");
  await pending;
  assert.equal(confirmation, null);
  assert.ok(session.accepts(b));
  assert.ok(!session.accepts(a));
});

test("atomic estimate and notification intents roll back together and recover without resubmission", async () => {
  const { db, sqlite } = database(),
    p = payload();
  sqlite.exec(
    "CREATE TRIGGER fail_team BEFORE INSERT ON calculator_outbox_v2 WHEN NEW.channel='team' BEGIN SELECT RAISE(ABORT,'test failure'); END",
  );
  assert.equal((await handleEstimate(request(p), env(db), { preview: true })).status, 503);
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_estimates_v2").get()!.n, 0);
  assert.equal(sqlite.prepare("SELECT count(*) n FROM calculator_outbox_v2").get()!.n, 0);
  sqlite.exec("DROP TRIGGER fail_team");
  const catalog = pricingItems.map((i) => ({
    ...i,
    status: i.status === "reference" ? ("approved" as const) : i.status,
  }));
  assert.equal(
    (await handleEstimate(request(p), env(db), { catalog, deferDelivery: true })).status,
    202,
  );
  let visitor = 0,
    team = 0;
  const transport: typeof fetch = async (_url, init) => {
    const recipient = JSON.parse(String(init?.body)).to[0];
    if (recipient === p.contact.email) {
      visitor++;
      if (visitor === 1) return Response.json({}, { status: 500 });
    } else team++;
    return Response.json({ id: "mock" });
  };
  let recovery = await recoverPendingEstimates(db, env(db), { transport });
  assert.equal(recovery[0].emailStatus, "failed");
  assert.equal(recovery[0].teamStatus, "accepted");
  recovery = await recoverPendingEstimates(db, env(db), { transport });
  assert.equal(recovery[0].emailStatus, "accepted");
  assert.equal(visitor, 2);
  assert.equal(team, 1);
  assert.deepEqual(await recoverPendingEstimates(db, env(db), { transport }), []);
  sqlite.close();
});

test("file-backed snapshot and both held intents survive database close and reopen", async () => {
  const dir = mkdtempSync(join(tmpdir(), "coco-persistence-")),
    path = join(dir, "review.sqlite"),
    p = payload();
  let sqlite = new DatabaseSync(path);
  sqlite.exec(schema);
  try {
    const saved = await (
      await handleEstimate(request(p), env(sqliteAdapter(sqlite)), { preview: true })
    ).json();
    sqlite.close();
    sqlite = new DatabaseSync(path);
    const row = sqlite
      .prepare("SELECT snapshot FROM calculator_estimates_v2 WHERE reference=?")
      .get(p.reference)!;
    assert.deepEqual(JSON.parse(String(row.snapshot)), saved.snapshot);
    assert.equal(
      sqlite
        .prepare("SELECT count(*) n FROM calculator_outbox_v2 WHERE status='held_preview'")
        .get()!.n,
      2,
    );
    const retry = await (
      await handleEstimate(request(p), env(sqliteAdapter(sqlite)), { preview: true })
    ).json();
    assert.deepEqual(retry.snapshot, saved.snapshot);
  } finally {
    sqlite.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

// This checks the new hosted-review safety boundary even with live-looking configuration.
test("review build holds recovery without calling any live transport", async () => {
  const { db, sqlite } = database();
  const p = payload();
  await approvedSnapshot(db, p);
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error("Unexpected outbound request");
  };
  try {
    const statuses = await recoverEstimate(db, p.reference, env(db));
    assert.equal(calls, 0);
    assert.equal(statuses.emailStatus, "held_preview");
    assert.equal(statuses.teamStatus, "held_preview");
  } finally {
    globalThis.fetch = originalFetch;
    sqlite.close();
  }
});

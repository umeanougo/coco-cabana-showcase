import { submissionSchema, scopeIssues } from "../lib/pricing-calculator/validation";
import { calculateEstimate } from "../lib/pricing-calculator/calculate-estimate";
import {
  disclaimer,
  exclusions,
  pricingVersion,
  pricingItems,
  type PricingItem,
} from "../config/pricing-calculator";
import { recoverEstimate } from "./estimate-recovery";
import type { Snapshot, EstimateDB } from "./estimate-store";
export interface EstimateEnvironment {
  ESTIMATES_DB?: EstimateDB;
  RESEND_API_KEY?: string;
  ESTIMATE_FROM_EMAIL?: string;
  ESTIMATE_TEAM_EMAIL?: string;
  SITE_ORIGIN?: string;
  ESTIMATE_DELIVERY_ENABLED?: string;
  HONEYBOOK_SCHEDULER_URL?: string;
  HONEYBOOK_SCHEDULER_VERIFIED?: string;
}
type Options = {
  preview?: boolean;
  now?: () => number;
  transport?: typeof fetch;
  catalog?: PricingItem[];
  version?: string;
  deferDelivery?: boolean;
};
const reply = (status: number, message: string, extra: Record<string, unknown> = {}) =>
  Response.json({ message, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
const digest = async (text: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
export async function handleEstimate(
  request: Request,
  env: EstimateEnvironment,
  options: Options = {},
) {
  if (!env.SITE_ORIGIN || request.headers.get("origin") !== env.SITE_ORIGIN)
    return reply(403, "This request must come from the Coco Cabana website.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply(415, "Use a JSON submission.");
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "Missing estimate.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 32768) {
      await reader.cancel();
      return reply(413, "Estimate is too large.");
    }
    chunks.push(value);
  }
  let parsed;
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c, offset);
      offset += c.length;
    }
    parsed = submissionSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return reply(400, "Invalid estimate.");
  }
  if (!parsed.success)
    return reply(
      400,
      "Check your event details, quantities, first name and email. Your selections have not been cleared.",
    );
  const data = parsed.data,
    db = env.ESTIMATES_DB,
    now = (options.now ?? Date.now)();
  if (!db)
    return reply(
      503,
      "Saving and email are not configured. Your selections remain in this tab; print a copy.",
    );
  try {
    const rateKey = await digest(
      `${request.headers.get("cf-connecting-ip") || "local"}:${Math.floor(now / 3600000)}`,
    );
    await db
      .prepare(
        "INSERT INTO estimate_rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      )
      .bind(rateKey, now + 7200000)
      .run();
    const rate = await db
      .prepare("SELECT count FROM estimate_rate_limits WHERE key=?")
      .bind(rateKey)
      .first<{ count: number }>();
    if ((rate?.count ?? 0) > 30)
      return reply(429, "Too many attempts. Your estimate is intact; try later.");
    await db.prepare("DELETE FROM estimate_rate_limits WHERE expires_at < ?").bind(now).run();
    const hash = await digest(JSON.stringify(data));
    let saved = await db
      .prepare("SELECT request_hash,snapshot FROM calculator_estimates_v2 WHERE reference=?")
      .bind(data.reference)
      .first<{ request_hash: string; snapshot: string }>();
    if (!saved) {
      const catalog = options.catalog ?? pricingItems,
        version = options.version ?? pricingVersion;
      // Check version before current catalog membership: a retired item is a reviewable change.
      const currentSelections = data.selections.filter((s) => catalog.some((i) => i.id === s.id));
      const issues = scopeIssues(data.basics, currentSelections, catalog);
      if (issues.length) return reply(400, "Correct the highlighted event inputs.", { issues });
      const estimate = calculateEstimate(data.basics, currentSelections, {
        allowReferencePrices: options.preview === true,
        catalog,
        version,
      });
      if (data.catalogVersion !== version) {
        return reply(409, "Pricing has changed. Review this updated breakdown before saving it.", {
          state: "pricing_changed",
          proposal: {
            schemaVersion: 2,
            catalogVersion: version,
            data: { ...data, catalogVersion: version, selections: currentSelections },
            estimate,
            disclaimer,
            exclusions,
            createdAt: now,
            preview: options.preview === true,
          },
          retiredItems: data.selections
            .filter((s) => !catalog.some((i) => i.id === s.id))
            .map((s) => s.id),
        });
      }
      if (currentSelections.length !== data.selections.length)
        return reply(400, "A selected item is no longer available. Refresh pricing.");
      if (!estimate.rows.length)
        return reply(400, "Choose at least one item applicable to this service.");
      const snapshot: Snapshot = {
        schemaVersion: 2,
        catalogVersion: version,
        data,
        estimate,
        disclaimer,
        exclusions,
        createdAt: now,
        preview: options.preview === true,
      };
      const status = snapshot.preview
        ? "held_preview"
        : estimate.reference || estimate.customCount
          ? "held_pricing"
          : "pending";
      // D1 batch and the local SQLite adapter commit all three rows or none.
      // The hash predicate prevents a concurrent conflicting request from creating intents.
      await db.batch([
        db
          .prepare(
            "INSERT OR IGNORE INTO calculator_estimates_v2(reference,request_hash,snapshot,created_at) VALUES(?,?,?,?)",
          )
          .bind(data.reference, hash, JSON.stringify(snapshot), now),
        ...(["visitor", "team"] as const).map((channel) =>
          db
            .prepare(
              "INSERT OR IGNORE INTO calculator_outbox_v2(id,reference,channel,envelope,status,created_at,lease_until) SELECT ?,?,?,?, ?,?,0 FROM calculator_estimates_v2 WHERE reference=? AND request_hash=?",
            )
            .bind(
              `${data.reference}-${channel}`,
              data.reference,
              channel,
              "",
              status,
              now,
              data.reference,
              hash,
            ),
        ),
      ]);
      saved = await db
        .prepare("SELECT request_hash,snapshot FROM calculator_estimates_v2 WHERE reference=?")
        .bind(data.reference)
        .first<{ request_hash: string; snapshot: string }>();
    }
    if (!saved || saved.request_hash !== hash)
      return reply(
        409,
        "This reference belongs to different details. Edit the form to create a new request.",
        { state: "conflict" },
      );
    const snapshot = JSON.parse(saved.snapshot) as Snapshot;
    const common = {
      reference: data.reference,
      state: "saved",
      catalogVersion: snapshot.catalogVersion,
      snapshot,
    };
    if (options.preview)
      return reply(
        200,
        "Saved locally. No email was sent. Marketing, SMS and external CRM actions are disabled.",
        { ...common, emailStatus: "held_preview", teamStatus: "held_preview" },
      );
    if (options.deferDelivery)
      return reply(202, "Estimate saved; notification work is queued.", {
        ...common,
        emailStatus: "pending",
        teamStatus: "pending",
      });
    const statuses = await recoverEstimate(db, data.reference, env, {
      now: () => now,
      transport: options.transport,
    });
    return reply(
      200,
      statuses.emailStatus === "accepted" && statuses.teamStatus === "accepted"
        ? "Estimate saved. The provider accepted both email requests; inbox delivery is not confirmed."
        : "Estimate saved. Email work is held, queued or failed; it has not been confirmed delivered.",
      { ...common, ...statuses },
    );
  } catch {
    return reply(
      503,
      "We could not confirm saving or delivery. Your selections remain intact. Retry safely or print a copy.",
    );
  }
}

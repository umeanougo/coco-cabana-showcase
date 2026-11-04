import test from "node:test";
import assert from "node:assert/strict";
import { calculateEstimate } from "../src/lib/pricing-calculator/calculate-estimate";
import {
  basicsSchema,
  type Basics,
  type Submission,
} from "../src/lib/pricing-calculator/validation";
import { pricingItems, serviceFee, type PricingItem } from "../src/config/pricing-calculator";
import { handleEstimate, type EstimateEnvironment } from "../src/server/pricing-estimates";
const basics: Basics = {
  eventType: "Wedding",
  eventDate: "June 2027",
  location: "Houston",
  guestCount: 50,
  venueStatus: "Not sure yet",
  planningStage: "Just exploring",
};
for (const [tier, guests, min, max] of [
  ["essential", 50, 200, 500],
  ["signature", 100, 1000, 1400],
  ["luxury", 250, 3500, 7000],
] as const)
  test(`approved chairs: ${tier}`, () => {
    const e = calculateEstimate({ ...basics, guestCount: guests }, [
      { id: "chairs", tier, quantity: 1 },
    ]);
    assert.equal(e.minimumTotal, min);
    assert.equal(e.maximumTotal, max);
  });
test("custom quotes and removal do not inflate totals", () => {
  assert.equal(
    calculateEstimate(basics, [{ id: "venue", tier: "luxury", quantity: 1 }]).maximumTotal,
    0,
  );
  assert.equal(calculateEstimate(basics, []).maximumTotal, 0);
});
test("guest and tier changes recalculate", () => {
  assert.equal(
    calculateEstimate({ ...basics, guestCount: 100 }, [
      { id: "chairs", tier: "essential", quantity: 1 },
    ]).minimumTotal,
    400,
  );
  assert.equal(
    calculateEstimate(basics, [{ id: "chairs", tier: "signature", quantity: 1 }]).minimumTotal,
    500,
  );
});
const item = (id: string, type: PricingItem["calculationType"], eligible = false): PricingItem => ({
  id,
  name: id,
  description: "test fixture only",
  active: true,
  categoryId: "test",
  calculationType: type,
  serviceFeeEligible: eligible,
  tiers: { essential: { minimum: 10, maximum: 20, description: "fixture" } },
});
test("flat, per item, hours, tables, and documented percentage bases", () => {
  const catalog = [
    item("flat", "flat"),
    item("unit", "per_item", true),
    item("hours", "per_hour"),
    item("tables", "per_table"),
    { ...item("percent", "percentage"), percentageBaseIds: ["flat"] },
  ];
  const e = calculateEstimate(
    basics,
    catalog.map((i) => ({ id: i.id, tier: "essential", quantity: 3 })),
    catalog,
  );
  assert.deepEqual(
    e.rows.map((r) => r.min),
    [10, 30, 30, 70, 1],
  );
  assert.equal(e.minimumServiceFee, 6);
  assert.equal(e.maximumServiceFee, 12);
  assert.equal(e.minimumTotal, e.minimumSubtotal + e.minimumServiceFee);
  assert.equal(e.maximumTotal, e.maximumSubtotal + e.maximumServiceFee);
  assert.equal(
    calculateEstimate(
      { ...basics, tableCount: 2 },
      [{ id: "tables", tier: "essential", quantity: 1 }],
      catalog,
    ).minimumTotal,
    20,
  );
});
test("fee eligibility, exclusions and minimum", () => {
  const catalog = [item("one", "flat", true), item("two", "flat")];
  const selections = catalog.map((i) => ({ id: i.id, tier: "essential" as const, quantity: 1 }));
  assert.equal(calculateEstimate(basics, selections, catalog).minimumServiceFee, 2);
  assert.equal(
    calculateEstimate(basics, selections, catalog, { ...serviceFee, excludedItemIds: ["one"] })
      .minimumServiceFee,
    0,
  );
  assert.equal(
    calculateEstimate(basics, selections, catalog, { ...serviceFee, minimum: 15 })
      .minimumServiceFee,
    15,
  );
});
for (const guestCount of [-1, 0, 1.2, 10001, NaN])
  test(`reject invalid guests ${guestCount}`, () =>
    assert.equal(basicsSchema.safeParse({ ...basics, guestCount }).success, false));
const submission: Submission = {
  reference: "f5f630c7-9633-4fc9-94ac-560a7d2a477b",
  basics,
  selections: [{ id: "chairs", tier: "essential", quantity: 1 }],
  contact: {
    firstName: "Test",
    lastName: "Visitor",
    email: "test@example.com",
    phone: "",
    contactPermission: false,
    marketingConsent: false,
  },
  attribution: {},
};
const request = () =>
  new Request("https://coco.example/api/pricing-estimates", {
    method: "POST",
    headers: { origin: "https://coco.example", "content-type": "application/json" },
    body: JSON.stringify(submission),
  });
test("unconfigured delivery is never success", async () =>
  assert.equal(
    (await handleEstimate(request(), { SITE_ORIGIN: "https://coco.example" })).status,
    503,
  ));
test("cross-origin requests are rejected", async () =>
  assert.equal(
    (await handleEstimate(request(), { SITE_ORIGIN: "https://other.example" })).status,
    403,
  ));
test("provider failures retain record and duplicate retries reuse one reference", async () => {
  const records = new Map<
    string,
    { payload_hash: string; email_delivery_status: string; created_at: number }
  >();
  const db = {
    prepare(sql: string) {
      let values: unknown[] = [];
      return {
        bind(...v: unknown[]) {
          values = v;
          return this;
        },
        async run() {
          if (sql.startsWith("INSERT OR IGNORE") && !records.has(String(values[0])))
            records.set(String(values[0]), {
              payload_hash: String(values[1]),
              email_delivery_status: "pending",
              created_at: Number(values[3]),
            });
          if (sql.includes("SET email_delivery_status=")) {
            const record = records.get(String(values[1]));
            if (record)
              record.email_delivery_status = sql.includes("'accepted'") ? "accepted" : "failed";
          }
        },
        async first<T>() {
          return (
            sql.includes("SELECT count") ? { count: 1 } : records.get(String(values[0]))
          ) as T;
        },
      };
    },
  };
  const env: EstimateEnvironment = {
    ESTIMATES_DB: db,
    SITE_ORIGIN: "https://coco.example",
    RESEND_API_KEY: "test-only",
    ESTIMATE_FROM_EMAIL: "test@example.com",
  };
  const original = globalThis.fetch;
  let calls = 0;
  let accepts = false;
  globalThis.fetch = async () => {
    calls++;
    return Response.json(accepts ? { id: "test-provider-id" } : { error: "fail" }, {
      status: accepts ? 200 : 500,
    });
  };
  try {
    assert.equal((await handleEstimate(request(), env)).status, 502);
    assert.equal(records.size, 1);
    accepts = true;
    assert.equal((await handleEstimate(request(), env)).status, 200);
    assert.equal((await handleEstimate(request(), env)).status, 200);
    assert.equal(records.size, 1);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = original;
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { websitePricing } from "../src/config/pricing-calculator";
import {
  configurationSchema,
  readPricingImport,
  savePricingDraft,
  pricingDraftKey,
  type PricingDraft,
} from "../src/lib/pricing-calculator/configuration";
import { calculateEstimate, feeCents } from "../src/lib/pricing-calculator/calculate-estimate";
import type { Basics } from "../src/lib/pricing-calculator/validation";
const fresh = (): PricingDraft => ({
  schemaVersion: 1,
  baseCatalogVersion: websitePricing.catalogVersion,
  lastSavedAt: null,
  configuration: structuredClone(websitePricing),
});
const basics: Basics = {
  audience: "client",
  service: "planning",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  guestCount: 50,
  ownFeePercent: 0,
};
const selected = [{ id: "chairs", tier: "economic" as const, quantity: 1 }];
test("local pricing envelope round-trips complete settings and preserves base version", () => {
  const draft = fresh();
  draft.configuration.tierLabels.economic = "Essentials";
  draft.configuration.assumptions.guestsPerTable = 10;
  draft.baseCatalogVersion = "older-website-version";
  let raw = "";
  const stored = savePricingDraft(
    {
      setItem: (key, value) => {
        assert.equal(key, pricingDraftKey);
        raw = value;
      },
    },
    draft,
    "2026-11-04T12:00:00.000Z",
  );
  assert.deepEqual(readPricingImport(raw), stored);
  assert.equal(stored.baseCatalogVersion, "older-website-version");
  const exported = { ...stored, exportedAt: "2026-11-04T12:01:00.000Z" };
  assert.deepEqual(readPricingImport(JSON.stringify(exported)), exported);
});
test("failed storage and rejected imports cannot mutate the existing draft", () => {
  const draft = fresh();
  const original = JSON.stringify(draft);
  assert.throws(
    () =>
      savePricingDraft(
        {
          setItem: () => {
            throw new Error("QuotaExceededError");
          },
        },
        draft,
      ),
    /QuotaExceeded/,
  );
  for (const raw of [
    "{broken",
    JSON.stringify({ ...draft, schemaVersion: 2 }),
    JSON.stringify({
      ...draft,
      configuration: {
        ...draft.configuration,
        fees: { ...draft.configuration.fees, lowerPercent: -1 },
      },
    }),
  ])
    assert.throws(() => readPricingImport(raw));
  assert.equal(JSON.stringify(draft), original);
  assert.equal(draft.lastSavedAt, null);
});
test("configuration rejects invalid identities, ranges, mappings, blank/nonfinite values and thresholds", () => {
  const bad = (mutate: (c: typeof websitePricing) => void) => {
    const c = structuredClone(websitePricing);
    mutate(c);
    assert.equal(configurationSchema.safeParse(c).success, false);
  };
  bad((c) => {
    c.items[0].name = " ";
  });
  bad((c) => {
    c.items[1].id = c.items[0].id;
  });
  bad((c) => {
    c.items[0].tiers.economic = { minimum: 10, maximum: 5 };
  });
  bad((c) => {
    c.items[0].tiers.economic = { minimum: NaN, maximum: 20 };
  });
  bad((c) => {
    c.items[0].tiers.economic = { minimum: -1, maximum: 20 };
  });
  bad((c) => {
    c.items[0].tiers.economic = { minimum: 1.234, maximum: 20 };
  });
  bad((c) => {
    c.items[0].audiences = [];
  });
  bad((c) => {
    c.assumptions.guestsPerTable = 0;
  });
  bad((c) => {
    c.assumptions.minQuantity = 31;
  });
  bad((c) => {
    c.fees.upperThreshold = c.fees.lowerThreshold;
  });
  bad((c) => {
    c.fees.upperPercent = Infinity;
  });
  bad((c) => {
    c.fees.lowerPercent = 101;
  });
  bad((c) => {
    c.items[0].calculationType = "custom_quote";
  });
});
test("draft engine changes prices, table assumptions, fees and availability without changing public configuration", () => {
  const config = structuredClone(websitePricing);
  const before = calculateEstimate(basics, selected, { allowReferencePrices: true });
  const chairs = config.items.find((i) => i.id === "chairs")!;
  chairs.tiers.economic = { minimum: 10, maximum: 20 };
  config.fees.lowerPercent = 15;
  const changed = calculateEstimate(basics, selected, {
    configuration: config,
    allowReferencePrices: true,
  });
  assert.equal(changed.minimumSubtotal, 500);
  assert.equal(changed.maximumSubtotal, 1000);
  assert.equal(changed.minimumServiceFee, 75);
  assert.equal(changed.maximumServiceFee, 150);
  assert.deepEqual(calculateEstimate(basics, selected, { allowReferencePrices: true }), before);
  config.assumptions.guestsPerTable = 10;
  chairs.calculationType = "per_table";
  assert.equal(
    calculateEstimate(basics, selected, { configuration: config, allowReferencePrices: true })
      .minimumSubtotal,
    50,
  );
  chairs.hidden = true;
  assert.equal(
    calculateEstimate(basics, selected, { configuration: config, allowReferencePrices: true }).rows
      .length,
    0,
  );
  chairs.hidden = false;
  chairs.audiences = ["planner"];
  assert.equal(
    calculateEstimate(basics, selected, { configuration: config, allowReferencePrices: true })
      .excluded.length,
    1,
  );
});
test("missing/custom quote draft rates stay unpriced and quantity limits use draft settings", () => {
  const config = structuredClone(websitePricing);
  const chairs = config.items.find((i) => i.id === "chairs")!;
  chairs.status = "missing";
  chairs.calculationType = "custom_quote";
  const result = calculateEstimate(basics, selected, {
    configuration: config,
    allowReferencePrices: true,
  });
  assert.equal(result.rows[0].min, null);
  assert.equal(result.customCount, 1);
  assert.equal(result.pricedCount, 0);
  chairs.status = "reference";
  chairs.calculationType = "quantity";
  config.assumptions.minQuantity = 2;
  config.assumptions.maxQuantity = 4;
  assert.throws(
    () =>
      calculateEstimate(basics, selected, { configuration: config, allowReferencePrices: true }),
    /2–4/,
  );
  const quantity = calculateEstimate(basics, [{ ...selected[0], quantity: 3 }], {
    configuration: config,
    allowReferencePrices: true,
  });
  assert.equal(quantity.rows[0].quantity, 3);
});

test("rejects $3,000 flat fee reproduction without writing or altering the draft", () => {
  const draft = fresh();
  draft.configuration.fees.flatAmount = 3000;
  const original = JSON.stringify(draft);
  // Explicit calculation fixture: no catalog rates are changed to force a match.
  const fees = draft.configuration.fees;
  assert.equal(24900 + feeCents(2490000, fees) / 100, 29880);
  assert.equal(25100 + feeCents(2510000, fees) / 100, 28100);
  const parsed = configurationSchema.safeParse(draft.configuration);
  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.match(parsed.error.message, /lower threshold at \$25,000\.00/);
    assert.match(parsed.error.message, /lower percentage or middle flat fee/);
  }
  let writes = 0;
  assert.throws(
    () =>
      savePricingDraft(
        {
          setItem: () => {
            writes++;
          },
        },
        draft,
      ),
    /decreases/,
  );
  assert.equal(writes, 0);
  assert.throws(() => readPricingImport(original), /lower threshold/);
  assert.equal(JSON.stringify(draft), original);
});

test("rejects a downward total jump at the upper fee threshold", () => {
  const draft = fresh();
  draft.configuration.fees.upperPercent = 5;
  const parsed = configurationSchema.safeParse(draft.configuration);
  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.match(parsed.error.message, /upper threshold at \$50,000\.00/);
    assert.match(parsed.error.message, /upper percentage or middle flat fee/);
  }
  assert.throws(() => readPricingImport(JSON.stringify(draft)), /upper threshold/);
});

test("valid fee boundaries include cent-level plateaus and shared rounding", () => {
  for (const fees of [
    websitePricing.fees,
    { ...websitePricing.fees, flatAmount: 4999.99 }, // lower total is equal, not decreasing
    { ...websitePricing.fees, flatAmount: 5000.01 }, // upper total is equal
    {
      lowerThreshold: 1.15,
      upperThreshold: 2.3,
      lowerPercent: 50,
      upperPercent: 25,
      flatAmount: 0.57,
    },
    {
      lowerThreshold: 1.15,
      upperThreshold: 2.3,
      lowerPercent: 50,
      upperPercent: 25,
      flatAmount: 0.59,
    },
  ]) {
    const config = { ...structuredClone(websitePricing), fees };
    assert.equal(configurationSchema.safeParse(config).success, true);
    for (const threshold of [fees.lowerThreshold, fees.upperThreshold]) {
      const boundary = Math.round(threshold * 100);
      const totals = [boundary - 1, boundary, boundary + 1].map((c) => c + feeCents(c, fees));
      assert.ok(totals[0] <= totals[1] && totals[1] <= totals[2]);
    }
  }
  for (const flatAmount of [0.56, 0.6]) {
    const config = structuredClone(websitePricing);
    config.fees = {
      lowerThreshold: 1.15,
      upperThreshold: 2.3,
      lowerPercent: 50,
      upperPercent: 25,
      flatAmount,
    };
    assert.equal(configurationSchema.safeParse(config).success, false);
  }
  for (const flatAmount of [4999.98, 5000.02]) {
    const config = structuredClone(websitePricing);
    config.fees.flatAmount = flatAmount;
    assert.equal(configurationSchema.safeParse(config).success, false);
  }
});

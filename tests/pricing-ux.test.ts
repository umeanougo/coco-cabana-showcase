import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PricingContext } from "../src/components/pricing-calculator/PricingContext";
import { EstimateSummary } from "../src/components/pricing-calculator/EstimateSummary";
import { PricingCategory } from "../src/components/pricing-calculator/PricingCategory";
import { websitePricing } from "../src/config/pricing-calculator";
import { calculateEstimate } from "../src/lib/pricing-calculator/calculate-estimate";
import type { Basics } from "../src/lib/pricing-calculator/validation";
const basics: Basics = {
  audience: "client",
  service: "planning",
  eventType: "Corporate event",
  guestCount: 250,
  eventDate: "",
  location: "",
  ownFeePercent: 0,
};

test("summary exposes configured exclusions and priced/unpriced scope outside disclosures", () => {
  const configuration = structuredClone(websitePricing);
  configuration.exclusions = "Local draft exclusions: delivery must be confirmed.";
  const estimate = calculateEstimate(
    basics,
    [
      { id: "catering", tier: "lux", quantity: 1 },
      { id: "backdrop", tier: "average", quantity: 1 },
      { id: "eru", tier: "average", quantity: 1 },
    ],
    { configuration, allowReferencePrices: true },
  );
  assert.equal(estimate.customCount, 1);
  const html = renderToStaticMarkup(
    createElement(
      PricingContext.Provider,
      { value: { configuration, localPreview: true } },
      createElement(EstimateSummary, { estimate, basics }),
    ),
  );
  const visible = html.replace(/<details[\s\S]*?<\/details>/g, "");
  assert.ok(visible.includes(configuration.exclusions));
  assert.ok(visible.includes("2 priced selections only."));
  assert.ok(visible.includes("additional item requires a quote"));
  assert.ok(visible.includes("$24,300–$45,000"));
  assert.ok(visible.includes("Estimated cost of your selected items"));
});

test("tier guidance uses approved item content and current guest/table assumptions without showing draft examples", () => {
  const configuration = structuredClone(websitePricing);
  configuration.assumptions.guestsPerTable = 10;
  const backdrop = configuration.items.find((i) => i.id === "backdrop")!;
  backdrop.examples = {
    economic: { approval: "approved", description: "Approved backdrop buying guidance" },
    average: { approval: "draft", description: "Unapproved package promise" },
  };
  const html = renderToStaticMarkup(
    createElement(
      PricingContext.Provider,
      { value: { configuration, localPreview: true } },
      createElement(PricingCategory, {
        categoryId: "decor",
        basics,
        selections: [],
        onChange: () => {},
        allowReferencePrices: true,
      }),
    ),
  );
  assert.ok(html.includes("Approved backdrop buying guidance"));
  assert.ok(!html.includes("Unapproved package promise"));
  assert.ok(html.includes("25 tables (10 guests per table, rounded up)"));
  assert.ok(html.includes("250 guests"));
  assert.ok(html.includes("not a defined package"));
});

// These checks exercise the same selection state before, during and after invalid input.
import { selectionState, validGuestCount } from "../src/lib/pricing-calculator/selection-state";
import { scopeIssues, type Selection } from "../src/lib/pricing-calculator/validation";
const retainedSelections: Selection[] = [
  { id: "catering", tier: "lux", quantity: 1 },
  { id: "backdrop", tier: "average", quantity: 1 },
  { id: "eru", tier: "average", quantity: 1 },
];
test("invalid guests preserve applicable and quote-only selections without producing monetary totals", () => {
  const original = structuredClone(retainedSelections);
  for (const count of [0, -1, 2.5, 1001]) {
    const edited = { ...basics, guestCount: count };
    const state = selectionState(edited, retainedSelections, websitePricing.items, true);
    assert.deepEqual(
      state.applicable.map((r) => r.id),
      ["catering", "backdrop", "eru"],
    );
    assert.deepEqual(
      state.applicable.filter((r) => r.custom).map((r) => r.id),
      ["eru"],
    );
    assert.equal(validGuestCount(count, websitePricing.assumptions), false);
    assert.throws(() =>
      calculateEstimate(edited, retainedSelections, { allowReferencePrices: true }),
    );
    const design = selectionState(
      { ...edited, service: "design" },
      retainedSelections,
      websitePricing.items,
      true,
    );
    assert.deepEqual(
      design.excluded.map((r) => r.id),
      ["catering"],
    );
    assert.deepEqual(
      design.applicable.map((r) => r.id),
      ["backdrop", "eru"],
    );
  }
  assert.deepEqual(retainedSelections, original);
  const restored = calculateEstimate(basics, retainedSelections, { allowReferencePrices: true });
  assert.deepEqual(
    [
      restored.minimumSubtotal,
      restored.maximumSubtotal,
      restored.minimumServiceFee,
      restored.maximumServiceFee,
      restored.minimumTotal,
      restored.maximumTotal,
    ],
    [20250, 40000, 4050, 5000, 24300, 45000],
  );
});

test("inactive inputs remain retained and excluded without blocking a valid Design calculation", () => {
  const selections: Selection[] = [
    ...retainedSelections,
    { id: "hmu", tier: "average", quantity: 0 },
  ];
  const design: Basics = { ...basics, service: "design", ownFeePercent: -5 };
  assert.equal(scopeIssues(design, selections).length, 0);
  const state = selectionState(design, selections, websitePricing.items, true);
  assert.deepEqual(
    state.excluded.map((r) => r.id),
    ["catering", "hmu"],
  );
  assert.deepEqual(
    state.applicable.map((r) => r.id),
    ["backdrop", "eru"],
  );
  assert.equal(
    calculateEstimate(design, selections, { allowReferencePrices: true }).minimumTotal,
    1800,
  );
  assert.ok(
    scopeIssues({ ...design, service: "planning" }, selections).some((i) => i.field === "hmu"),
  );
});

test("invalid guest metadata never presents zero multipliers and tier descriptions reference rendered units, price and guidance", () => {
  const html = renderToStaticMarkup(
    createElement(PricingCategory, {
      categoryId: "decor",
      basics: { ...basics, guestCount: 0 },
      selections: [],
      onChange: () => {},
      allowReferencePrices: true,
    }),
  );
  assert.ok(!/×\s*(?:<!-- -->)?\s*0\s*(guests|tables)/.test(html));
  assert.ok(html.includes("Enter a valid guest count to calculate tables."));
  const buttons = [
    ...html.matchAll(/<button[^>]*aria-label="([^"]+)"[^>]*aria-describedby="([^"]+)"/g),
  ];
  assert.ok(buttons.length > 3);
  for (const [, name, descriptions] of buttons) {
    assert.match(name, /^(Economic|Average|Lux) /);
    const ids = descriptions.split(" ");
    assert.equal(ids.length, 3);
    for (const id of ids) assert.ok(html.includes(`id="${id}"`), `Missing description ${id}`);
  }
});

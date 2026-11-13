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

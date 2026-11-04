import {
  assumptions,
  pricingItems,
  serviceFee,
  type PricingItem,
} from "../../config/pricing-calculator";
import type { Basics, Selection } from "./validation";
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: assumptions.currency,
    maximumFractionDigits: 2,
  }).format(n);
export const range = (min: number, max: number) => `${money(min)}–${money(max)}`;
const cents = (v: number) => Math.round(v * 100);
export function calculateEstimate(
  basics: Basics,
  selections: Selection[],
  catalog: PricingItem[] = pricingItems,
  fee = serviceFee,
) {
  if (
    !Number.isInteger(basics.guestCount) ||
    basics.guestCount < 1 ||
    basics.guestCount > assumptions.maxGuests
  )
    throw new Error("Invalid guest count");
  const tables = basics.tableCount ?? Math.ceil(basics.guestCount / assumptions.guestsPerTable);
  const rows = selections.map((s) => {
    const item = catalog.find((i) => i.id === s.id && i.active);
    if (!item) throw new Error("Unknown item");
    if (!Number.isInteger(s.quantity) || s.quantity < 1 || s.quantity > 10000)
      throw new Error("Invalid quantity");
    const tier = item.tiers[s.tier];
    const custom = item.calculationType === "custom_quote" || !tier;
    const quantity =
      item.calculationType === "per_guest"
        ? basics.guestCount
        : item.calculationType === "per_table"
          ? tables
          : ["per_item", "per_hour"].includes(item.calculationType)
            ? s.quantity
            : 1;
    return {
      ...s,
      item,
      quantity,
      custom,
      min: custom ? 0 : cents(tier!.minimum) * quantity,
      max: custom ? 0 : cents(tier!.maximum) * quantity,
    };
  });
  for (const row of rows.filter((r) => !r.custom && r.item.calculationType === "percentage")) {
    const base = rows.filter(
      (r) =>
        !r.custom &&
        r.item.calculationType !== "percentage" &&
        row.item.percentageBaseIds?.includes(r.id),
    );
    row.min = Math.round(
      (base.reduce((n, r) => n + r.min, 0) * row.item.tiers[row.tier]!.minimum) / 100,
    );
    row.max = Math.round(
      (base.reduce((n, r) => n + r.max, 0) * row.item.tiers[row.tier]!.maximum) / 100,
    );
  }
  const min = rows.reduce((n, r) => n + r.min, 0),
    max = rows.reduce((n, r) => n + r.max, 0);
  const eligible = rows.filter(
    (r) =>
      !r.custom &&
      !fee.excludedItemIds.includes(r.id) &&
      (r.item.serviceFeeEligible || fee.eligibleCategoryIds.includes(r.item.categoryId)),
  );
  const feeFor = (key: "min" | "max") =>
    fee.active && eligible.length
      ? Math.max(
          cents(fee.minimum),
          Math.round(eligible.reduce((n, r) => n + r[key], 0) * fee.rate),
        )
      : 0;
  const feeMin = feeFor("min"),
    feeMax = feeFor("max");
  return {
    rows: rows.map((r) => ({ ...r, min: r.min / 100, max: r.max / 100 })),
    tables,
    minimumSubtotal: min / 100,
    maximumSubtotal: max / 100,
    minimumServiceFee: feeMin / 100,
    maximumServiceFee: feeMax / 100,
    minimumTotal: (min + feeMin) / 100,
    maximumTotal: (max + feeMax) / 100,
    pricedCount: rows.filter((r) => !r.custom).length,
    customCount: rows.filter((r) => r.custom).length,
  };
}
export type Estimate = ReturnType<typeof calculateEstimate>;

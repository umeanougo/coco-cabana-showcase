import {
  assumptions,
  pricingItems,
  pricingVersion,
  applicable,
  services,
  type PricingItem,
} from "../../config/pricing-calculator";
import { scopeIssues, type Basics, type Selection } from "./validation";
// Calculate in integer cents. Round percentage fees to cents, endpoints independently.
export const feeCents = (subtotal: number) =>
  subtotal <= 2500000
    ? Math.round((subtotal * 20) / 100)
    : subtotal <= 5000000
      ? 500000
      : Math.round((subtotal * 10) / 100);
export const feeBracket = (subtotal: number) =>
  subtotal <= 25000 ? "20%" : subtotal <= 50000 ? "flat $5,000" : "10%";
// Display policy from brief: whole dollars; totals over $1,000 to nearest $10.
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value > 1000 ? Math.round(value / 10) * 10 : Math.round(value));
export const range = (min: number, max: number) => `${money(min)}–${money(max)}`;
export function calculateEstimate(
  basics: Basics,
  selections: Selection[],
  options: { allowReferencePrices?: boolean; catalog?: PricingItem[]; version?: string } = {},
) {
  const catalog = options.catalog ?? pricingItems;
  const issues = scopeIssues(basics, selections, catalog);
  if (issues.length) throw new Error(issues.map((i) => i.message).join(" "));
  const tables = Math.ceil(basics.guestCount / assumptions.guestsPerTable);
  const excluded = selections.filter((s) => {
    const item = catalog.find((i) => i.id === s.id);
    return item && !applicable(item, basics.audience, basics.service);
  });
  const rows = selections.flatMap((s) => {
    const item = catalog.find((i) => i.id === s.id);
    if (!item) throw new Error("Unknown item");
    if (!applicable(item, basics.audience, basics.service)) return [];
    const tier = item.tiers[s.tier];
    const priced =
      !!tier &&
      (item.status === "approved" ||
        (options.allowReferencePrices === true && item.status === "reference"));
    if (
      tier &&
      (!Number.isFinite(tier.minimum) ||
        !Number.isFinite(tier.maximum) ||
        tier.minimum < 0 ||
        tier.maximum < tier.minimum)
    )
      throw new Error("Invalid catalog rate");
    const quantity =
      item.calculationType === "per_guest"
        ? basics.guestCount
        : item.calculationType === "per_table"
          ? tables
          : item.calculationType === "quantity"
            ? s.quantity
            : 1;
    return [
      {
        ...s,
        item,
        quantity,
        custom: !priced,
        min: priced ? Math.round(tier!.minimum * 100) * quantity : null,
        max: priced ? Math.round(tier!.maximum * 100) * quantity : null,
      },
    ];
  });
  const min = rows.reduce((n, r) => n + (r.min ?? 0), 0),
    max = rows.reduce((n, r) => n + (r.max ?? 0), 0);
  const hasCocoFee =
    basics.service === "design" || (basics.service === "planning" && basics.audience === "client");
  const own =
    basics.service === "planning" && basics.audience === "planner"
      ? Math.round(basics.ownFeePercent * 100)
      : 0;
  const feeMin = hasCocoFee ? feeCents(min) : 0,
    feeMax = hasCocoFee ? feeCents(max) : 0;
  const ownMin = Math.round((min * own) / 10000),
    ownMax = Math.round((max * own) / 10000);
  const finalMin = min + feeMin + ownMin,
    finalMax = max + feeMax + ownMax;
  return {
    version: options.version ?? pricingVersion,
    tables,
    rows: rows.map((r) => ({
      ...r,
      min: r.min === null ? null : r.min / 100,
      max: r.max === null ? null : r.max / 100,
    })),
    excluded,
    minimumSubtotal: min / 100,
    maximumSubtotal: max / 100,
    minimumServiceFee: feeMin / 100,
    maximumServiceFee: feeMax / 100,
    minimumOwnFee: ownMin / 100,
    maximumOwnFee: ownMax / 100,
    ownFeePercent: own / 100,
    minimumTotal: finalMin / 100,
    maximumTotal: finalMax / 100,
    minimumPerGuest: finalMin / 100 / basics.guestCount,
    maximumPerGuest: finalMax / 100 / basics.guestCount,
    feeLabel: hasCocoFee
      ? `${basics.service === "design" ? "Design" : "Planning"} fee (${feeBracket(min / 100)}${feeBracket(min / 100) !== feeBracket(max / 100) ? ` → ${feeBracket(max / 100)}` : ""})`
      : "Coco Cabana service fee — none",
    reference: rows.some((r) => !r.custom && r.item.status === "reference"),
    pricedCount: rows.filter((r) => !r.custom).length,
    customCount: rows.filter((r) => r.custom).length,
    referenceMinimum:
      basics.audience === "planner" && basics.service === "planning"
        ? null
        : services[basics.service].referenceMinimum,
    underReferenceMinimum:
      rows.length > 0 &&
      !(basics.audience === "planner" && basics.service === "planning") &&
      finalMax / 100 < services[basics.service].referenceMinimum,
    categoryTotals: ["planning", "decor", "specialty"].map((id) => ({
      id,
      min: rows.filter((r) => r.item.categoryId === id).reduce((n, r) => n + (r.min ?? 0), 0) / 100,
      max: rows.filter((r) => r.item.categoryId === id).reduce((n, r) => n + (r.max ?? 0), 0) / 100,
    })),
  };
}
export type Estimate = ReturnType<typeof calculateEstimate>;

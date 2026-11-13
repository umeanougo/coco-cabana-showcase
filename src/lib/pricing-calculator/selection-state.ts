import { applicable, type PricingItem } from "../../config/pricing-calculator";
import type { PricingConfiguration } from "./configuration";
import type { Basics, Selection } from "./validation";

export function validGuestCount(value: number, assumptions: PricingConfiguration["assumptions"]) {
  return (
    Number.isInteger(value) && value >= assumptions.minGuests && value <= assumptions.maxGuests
  );
}

// Selection identity survives invalid quantities/guest inputs; no money is calculated here.
export function selectionState(
  basics: Basics,
  selections: Selection[],
  catalog: PricingItem[],
  allowReferencePrices: boolean,
) {
  const rows = selections.flatMap((selection) => {
    const item = catalog.find((i) => i.id === selection.id);
    return item
      ? [
          {
            ...selection,
            item,
            custom:
              item.calculationType === "custom_quote" ||
              !item.tiers[selection.tier] ||
              !(
                item.status === "approved" ||
                (allowReferencePrices && item.status === "reference")
              ),
          },
        ]
      : [];
  });
  return {
    applicable: rows.filter((r) => applicable(r.item, basics.audience, basics.service)),
    excluded: rows.filter((r) => !applicable(r.item, basics.audience, basics.service)),
    unavailable: selections.filter((s) => !catalog.some((i) => i.id === s.id)),
  };
}
export type SelectionState = ReturnType<typeof selectionState>;
export function pausedSelectionMessage(count: number, guestInvalid: boolean) {
  return `${count} selection${count === 1 ? "" : "s"} retained. ${guestInvalid ? "Enter a valid guest count" : "Correct the highlighted inputs"} to update totals.`;
}

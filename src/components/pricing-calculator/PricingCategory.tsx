import { usePricing } from "./PricingContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { applicable, type Category, type Tier } from "@/config/pricing-calculator";
import { range } from "@/lib/pricing-calculator/calculate-estimate";
import type { Basics, Selection } from "@/lib/pricing-calculator/validation";
const units = {
  flat: "flat",
  per_guest: "per guest",
  per_table: "per table",
  quantity: "per unit",
  custom_quote: "custom scope",
};
export function PricingCategory({
  categoryId,
  basics,
  selections,
  onChange,
  allowReferencePrices,
  errors = [],
}: {
  errors?: { field: string; message: string }[];
  categoryId: Category;
  basics: Basics;
  selections: Selection[];
  onChange: (v: Selection[]) => void;
  allowReferencePrices: boolean;
}) {
  const { pricingItems, tierLabels, tierDescriptions, assumptions } = usePricing();
  const [example, setExample] = useState<string | null>(null);
  const items = pricingItems
    .filter((i) => i.categoryId === categoryId && applicable(i, basics.audience, basics.service))
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const choose = (id: string, tier: Tier) => {
    const current = selections.find((s) => s.id === id);
    onChange(
      current?.tier === tier
        ? selections.filter((s) => s.id !== id)
        : [
            ...selections.filter((s) => s.id !== id),
            { id, tier, quantity: current?.quantity ?? assumptions.minQuantity },
          ],
    );
  };
  const sample = items.find((i) => i.id === example);
  return (
    <>
      <div className="cc-item-list">
        {items.map((item) => {
          const selected = selections.find((s) => s.id === item.id);
          const numeric =
            item.status === "approved" || (allowReferencePrices && item.status === "reference");
          return (
            <div className={`cc-item ${selected ? "is-selected" : ""}`} key={item.id}>
              <div className="cc-item-heading">
                <div>
                  <h4>
                    {item.name}
                    {selected && (
                      <span className="cc-selected-mark" aria-label="Selected">
                        {" "}
                        ✓
                      </span>
                    )}
                  </h4>
                  <small>
                    {units[item.calculationType]}
                    {item.calculationType === "per_guest"
                      ? ` · × ${basics.guestCount} guests`
                      : item.calculationType === "per_table"
                        ? ` · × ${Math.ceil(basics.guestCount / assumptions.guestsPerTable)} tables (${assumptions.guestsPerTable} guests per table, rounded up)`
                        : item.calculationType === "flat"
                          ? " · counted once"
                          : ""}
                    {item.status === "reference" && allowReferencePrices
                      ? " · reference prices"
                      : ""}
                  </small>
                </div>
                {item.status !== "missing" && (
                  <button type="button" className="cc-link" onClick={() => setExample(item.id)}>
                    {Object.values(item.examples ?? {}).some((e) => e?.approval === "approved")
                      ? "See examples"
                      : "About tiers"}
                    <span className="sr-only"> of {item.name}</span>
                  </button>
                )}
              </div>
              {item.description && <p className="cc-fine">{item.description}</p>}
              {item.inclusions && <p className="cc-fine">Established scope: {item.inclusions}</p>}
              {item.pricingNotes && <p className="cc-fine">Price guidance: {item.pricingNotes}</p>}
              {!item.inclusions &&
                !item.pricingNotes &&
                item.calculationType !== "custom_quote" && (
                  <p className="cc-fine">
                    Compare budget levels for {item.name.toLowerCase()}. Specific tier inclusions
                    are not yet confirmed; the range is not a defined package.
                  </p>
                )}
              {(item.inclusions || item.exclusions || item.pricingNotes) && (
                <details className="cc-help">
                  <summary>Item details</summary>
                  {item.inclusions && <p>Includes: {item.inclusions}</p>}
                  {item.exclusions && <p>Excludes: {item.exclusions}</p>}
                  {item.pricingNotes && <p>{item.pricingNotes}</p>}
                </details>
              )}
              {item.status === "missing" || item.calculationType === "custom_quote" ? (
                <div className="cc-unpriced">
                  <p>
                    Pricing and package details need confirmation. This selection is additional to
                    the calculated range.
                  </p>
                  <button
                    type="button"
                    className="cc-link"
                    aria-pressed={!!selected}
                    onClick={() => choose(item.id, "average")}
                  >
                    {selected ? "Remove" : "Add for consultation"} {item.name}
                  </button>
                </div>
              ) : (
                <div className="cc-tiers" role="group" aria-label={`${item.name} tier`}>
                  {(Object.keys(tierLabels) as Tier[]).map((tier) => (
                    <button
                      type="button"
                      aria-pressed={selected?.tier === tier}
                      aria-label={`${tierLabels[tier]} ${item.name}`}
                      key={tier}
                      onClick={() => choose(item.id, tier)}
                    >
                      <strong>{tierLabels[tier]}</strong>
                      <span className="cc-tier-direction">
                        {item.examples?.[tier]?.approval === "approved"
                          ? item.examples[tier]!.description
                          : tier === "economic"
                            ? "Basic budget direction"
                            : tier === "average"
                              ? "Middle budget direction"
                              : "Premium budget direction"}
                      </span>
                      <span>
                        {numeric && item.tiers[tier]
                          ? range(item.tiers[tier]!.minimum, item.tiers[tier]!.maximum)
                          : "Price pending"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {selected && item.calculationType === "quantity" && (
                <label className="cc-quantity">
                  {item.id === "hmu"
                    ? "People receiving hair & makeup"
                    : `Quantity for ${item.name}`}
                  <input
                    type="number"
                    min={assumptions.minQuantity}
                    max={assumptions.maxQuantity}
                    step="1"
                    aria-invalid={errors.some((e) => e.field === item.id)}
                    value={selected.quantity || ""}
                    onChange={(e) =>
                      onChange(
                        selections.map((s) =>
                          s.id === item.id ? { ...s, quantity: Number(e.target.value) } : s,
                        ),
                      )
                    }
                  />
                  {errors
                    .filter((e) => e.field === item.id)
                    .map((e) => (
                      <span key={e.field} role="alert" className="cc-error">
                        {e.message}
                      </span>
                    ))}
                </label>
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={!!sample} onOpenChange={(open) => !open && setExample(null)}>
        <DialogContent className="cc-dialog">
          <DialogTitle>{sample?.name}: explore the tiers</DialogTitle>
          <DialogDescription>
            Compare the budget direction for {sample?.name.toLowerCase()}. Only approved item
            examples appear here; general tier guidance does not promise specific products or
            inclusions.
          </DialogDescription>
          {sample?.description && <p>{sample.description}</p>}
          <p className="cc-fine">
            {sample?.inclusions || "Item-specific inclusions need confirmation."}{" "}
            {sample?.pricingNotes || "Final scope depends on your date, venue and design."}
          </p>
          <div className="cc-example-list">
            {(Object.keys(tierLabels) as Tier[]).map((t) => (
              <div key={t}>
                <h3>{tierLabels[t]}</h3>
                <p>
                  {sample?.examples?.[t]?.approval === "approved"
                    ? sample.examples[t]!.description
                    : tierDescriptions[t]}
                </p>
                {sample?.examples?.[t]?.approval === "approved" &&
                  sample.examples[t]!.image?.approval === "approved" && (
                    <img
                      src={sample.examples[t]!.image!.src}
                      alt={sample.examples[t]!.image!.alt}
                      loading="lazy"
                    />
                  )}
                {sample?.tiers[t] &&
                  (sample.status === "approved" ||
                    (allowReferencePrices && sample.status === "reference")) && (
                    <p>
                      {sample.status === "reference" ? "Reference: " : ""}
                      {range(sample.tiers[t]!.minimum, sample.tiers[t]!.maximum)} ·{" "}
                      {units[sample.calculationType]}
                    </p>
                  )}
                <button
                  className="cc-button secondary"
                  onClick={() => {
                    if (sample) {
                      onChange([
                        ...selections.filter((s) => s.id !== sample.id),
                        {
                          id: sample.id,
                          tier: t,
                          quantity:
                            selections.find((s) => s.id === sample.id)?.quantity ??
                            assumptions.minQuantity,
                        },
                      ]);
                      setExample(null);
                    }
                  }}
                >
                  Choose {tierLabels[t]}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

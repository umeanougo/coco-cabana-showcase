import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  pricingItems,
  tierLabels,
  tierDescriptions,
  applicable,
  type Category,
  type Tier,
} from "@/config/pricing-calculator";
import { range } from "@/lib/pricing-calculator/calculate-estimate";
import type { Basics, Selection } from "@/lib/pricing-calculator/validation";
const units = {
  flat: "flat",
  per_guest: "per guest",
  per_table: "per table",
  quantity: "per person",
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
  const [example, setExample] = useState<string | null>(null);
  const items = pricingItems.filter(
    (i) => i.categoryId === categoryId && applicable(i, basics.audience, basics.service),
  );
  const choose = (id: string, tier: Tier) => {
    const current = selections.find((s) => s.id === id);
    onChange(
      current?.tier === tier
        ? selections.filter((s) => s.id !== id)
        : [
            ...selections.filter((s) => s.id !== id),
            { id, tier, quantity: current?.quantity ?? 1 },
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
                    {item.status === "reference" && allowReferencePrices
                      ? " · reference prices"
                      : ""}
                  </small>
                </div>
                {categoryId !== "planning" && item.status !== "missing" && (
                  <button type="button" className="cc-link" onClick={() => setExample(item.id)}>
                    {Object.values(item.examples ?? {}).some((e) => e?.approval === "approved")
                      ? "See examples"
                      : "About tiers"}
                    <span className="sr-only"> of {item.name}</span>
                  </button>
                )}
              </div>
              {item.status === "missing" ? (
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
                  People receiving hair & makeup
                  <input
                    type="number"
                    min="1"
                    max="30"
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
            Compare the direction for each tier. Item-specific inspiration photos are awaiting
            approval; these descriptions are not a promise of particular products.
          </DialogDescription>
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
                          quantity: selections.find((s) => s.id === sample.id)?.quantity ?? 1,
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

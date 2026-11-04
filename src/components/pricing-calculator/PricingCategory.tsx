import { pricingItems, tierLabels, tierDescriptions, type Tier } from "@/config/pricing-calculator";
import { range } from "@/lib/pricing-calculator/calculate-estimate";
import type { Selection } from "@/lib/pricing-calculator/validation";
import { track } from "@/lib/pricing-calculator/analytics";
export function PricingCategory({
  categoryId,
  selections,
  onChange,
}: {
  categoryId: string;
  selections: Selection[];
  onChange: (s: Selection[]) => void;
}) {
  return (
    <div className="service-list">
      {pricingItems
        .filter((i) => i.categoryId === categoryId && i.active)
        .map((item) => {
          const selected = selections.find((s) => s.id === item.id);
          const update = (s: Selection) =>
            onChange(selections.map((old) => (old.id === s.id ? s : old)));
          return (
            <div key={item.id} className={`service-row ${selected ? "selected" : ""}`}>
              <label className="service-choice">
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={(e) => {
                    onChange(
                      e.target.checked
                        ? [...selections, { id: item.id, tier: "essential", quantity: 1 }]
                        : selections.filter((s) => s.id !== item.id),
                    );
                    track(e.target.checked ? "item_selected" : "item_removed", {
                      category: categoryId,
                    });
                  }}
                />
                <span>{item.name}</span>
                <small>
                  {item.calculationType === "custom_quote"
                    ? "Consultation required"
                    : "From $4 / guest"}
                </small>
              </label>
              {selected && (
                <div className="service-detail">
                  <p>{item.description}</p>
                  <fieldset>
                    <legend>Preferred level for {item.name}</legend>
                    <div className="tier-options">
                      {(Object.keys(tierLabels) as Tier[]).map((tier) => (
                        <label key={tier} className={selected.tier === tier ? "chosen" : ""}>
                          <input
                            type="radio"
                            name={`tier-${item.id}`}
                            checked={selected.tier === tier}
                            onChange={() => {
                              update({ ...selected, tier });
                              track("tier_selected", { tier, category: categoryId });
                            }}
                          />
                          <strong>{tierLabels[tier]}</strong>
                          <small>
                            {item.tiers[tier]
                              ? `${range(item.tiers[tier]!.minimum, item.tiers[tier]!.maximum)} / guest`
                              : tierDescriptions[tier]}
                          </small>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {["per_item", "per_hour"].includes(item.calculationType) && (
                    <label>
                      Quantity / hours
                      <input
                        type="number"
                        min={1}
                        max={10000}
                        step={1}
                        value={selected.quantity}
                        onChange={(e) =>
                          update({
                            ...selected,
                            quantity: Math.max(
                              1,
                              Math.min(10000, Math.floor(Number(e.target.value))),
                            ),
                          })
                        }
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

import { usePricing } from "./PricingContext";
import type { SelectionState } from "@/lib/pricing-calculator/selection-state";
export function PausedEstimate({
  state,
  message,
  onRemove,
}: {
  state: SelectionState;
  message: string;
  onRemove: (id: string) => void;
}) {
  const { exclusions, tierLabels } = usePricing();
  return (
    <div className="cc-estimate">
      <h2>Selections retained</h2>
      <p role="status">{message}</p>
      <p className="cc-scope">Totals paused; no current monetary estimate is shown. {exclusions}</p>
      <ul className="cc-summary-items">
        {state.applicable.map((row) => (
          <li key={row.id}>
            <div>
              <strong>{row.item.name}</strong>
              <small>
                {row.custom
                  ? "Additional · quote required"
                  : `${tierLabels[row.tier]} · calculation paused`}
              </small>
            </div>
            <button
              className="cc-link"
              onClick={() => onRemove(row.id)}
              aria-label={`Remove ${row.item.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {state.excluded.length > 0 && (
        <p>
          {state.excluded.length} other selections retained but excluded from this service/audience.
        </p>
      )}
      {state.unavailable.map((row) => (
        <p key={row.id}>
          Unavailable selection: {row.id}.{" "}
          <button className="cc-link" onClick={() => onRemove(row.id)}>
            Remove unavailable selection
          </button>
        </p>
      ))}
    </div>
  );
}

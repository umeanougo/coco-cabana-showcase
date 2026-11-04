import type { Basics } from "@/lib/pricing-calculator/validation";
import { type Estimate, range } from "@/lib/pricing-calculator/calculate-estimate";
import {
  assumptions,
  disclaimer,
  exclusions,
  serviceFee,
  tierLabels,
} from "@/config/pricing-calculator";
export function EstimateSummary({
  estimate,
  basics,
  reference,
  onEdit,
  onRemove,
}: {
  estimate: Estimate;
  basics: Basics;
  reference: string;
  onEdit: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="estimate-card">
      <p className="eyebrow">Your celebration, taking shape</p>
      <h2>Your starting range</h2>
      <p className="estimate-amount" aria-live="polite" aria-atomic="true">
        {estimate.pricedCount
          ? range(estimate.minimumTotal, estimate.maximumTotal)
          : "Let’s build your estimate"}
      </p>
      <p className="estimate-caption">USD · priced selections only · not a quote</p>
      <p className="estimate-notice">
        Only chair pricing is currently available. Other selected services and unconfirmed fees are
        additional; this is not a complete event budget.
      </p>
      <div className="event-recap">
        <strong>{basics.eventType}</strong>
        <p>
          {basics.guestCount || "—"} guests · {estimate.tables} tables
          {!basics.tableCount ? ` (assumed ${assumptions.guestsPerTable} per table)` : ""}
        </p>
        <p>{basics.eventDate || "Date to be decided"}</p>
        <p>{basics.location || "Location to be decided"}</p>
        <p>
          {basics.venueStatus} · {basics.planningStage}
        </p>
        {basics.desiredBudget !== undefined && (
          <p>Target budget: {range(basics.desiredBudget, basics.desiredBudget)}</p>
        )}
        <button type="button" className="text-link no-print" onClick={onEdit}>
          Edit event details
        </button>
      </div>
      {estimate.rows.length === 0 ? (
        <p className="empty-estimate">
          Choose the details that matter to you. Your estimate updates as you go.
        </p>
      ) : (
        <ul className="estimate-items">
          {estimate.rows.map((r) => (
            <li key={r.id}>
              <div>
                <strong>{r.item.name}</strong>
                <small>
                  {tierLabels[r.tier]} ·{" "}
                  {r.custom
                    ? "Consultation required"
                    : `${r.quantity} × ${r.item.calculationType.replace("per_", "per ")}`}
                </small>
              </div>
              <div>
                {!r.custom && <span>{range(r.min, r.max)}</span>}
                <button
                  type="button"
                  className="text-link no-print"
                  aria-label={`Remove ${r.item.name}`}
                  onClick={() => onRemove(r.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <dl className="estimate-totals">
        <div>
          <dt>Selected event elements</dt>
          <dd>
            {estimate.pricedCount
              ? range(estimate.minimumSubtotal, estimate.maximumSubtotal)
              : "Not yet priced"}
          </dd>
        </div>
        <div>
          <dt>Estimated service fee ({serviceFee.rate * 100}%)</dt>
          <dd>
            {serviceFee.eligibilityConfirmed
              ? range(estimate.minimumServiceFee, estimate.maximumServiceFee)
              : "To be confirmed"}
          </dd>
        </div>
        <div>
          <dt>Priced estimate total</dt>
          <dd>
            {estimate.pricedCount
              ? range(estimate.minimumTotal, estimate.maximumTotal)
              : "Consultation required"}
          </dd>
        </div>
      </dl>
      <p className="estimate-caption">
        {estimate.customCount} selected{" "}
        {estimate.customCount === 1 ? "element requires" : "elements require"} consultation. Taxes
        and logistics are excluded.
      </p>
      <details className="assumptions">
        <summary>Assumptions, fees & exclusions</summary>
        <p>{serviceFee.explanation}</p>
        <p>{exclusions}</p>
        <p>
          Guest count drives chair costs. Tier descriptions express a preferred level; exact
          products and inclusions are confirmed in consultation.
        </p>
      </details>
      <p className="disclaimer">{disclaimer}</p>
      <p className="estimate-reference">Estimate reference: {reference || "Preparing…"}</p>
    </section>
  );
}

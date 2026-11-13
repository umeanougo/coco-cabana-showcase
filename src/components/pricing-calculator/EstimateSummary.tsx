import { usePricing } from "./PricingContext";
import { partialContext } from "@/lib/pricing-calculator/presentation";
import { type Estimate, range, money } from "@/lib/pricing-calculator/calculate-estimate";
import { type Basics } from "@/lib/pricing-calculator/validation";
export function EstimateSummary({
  estimate,
  basics,
  onRemove,
}: {
  estimate: Estimate;
  basics: Basics;
  onRemove?: (id: string) => void;
}) {
  const { disclaimer, exclusions, feeExplanation, tierLabels, serviceName, assumptions } =
    usePricing();
  return (
    <div className="cc-estimate">
      <p className="cc-eyebrow">
        {serviceName(basics.audience, basics.service)} · {basics.guestCount} guests
      </p>
      <h2>Estimated cost of your selected items</h2>
      <p className="cc-total">
        {estimate.pricedCount
          ? range(estimate.minimumTotal, estimate.maximumTotal)
          : estimate.rows.length
            ? "Pricing to confirm"
            : "Choose your first detail"}
      </p>
      <p className="cc-scope">
        <strong>{estimate.pricedCount} priced selections only.</strong> Other event elements are not
        included. {exclusions}
      </p>
      <p className="cc-partial">{partialContext(estimate)}</p>
      <p className="cc-estimate-caption">
        {estimate.reference
          ? "Reference range · not approved pricing"
          : estimate.pricedCount
            ? "Estimated range"
            : "Your selections will appear here."}
        {estimate.customCount > 0
          ? ` · ${estimate.customCount} unpriced selection${estimate.customCount === 1 ? "" : "s"} additional`
          : ""}
      </p>
      {estimate.rows.length > 0 && (
        <>
          <ul className="cc-summary-items">
            {estimate.rows.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.item.name}</strong>
                  <small>
                    {r.item.calculationType === "custom_quote"
                      ? "Custom scope"
                      : tierLabels[r.tier]}{" "}
                    · {r.quantity} × {r.item.calculationType.replaceAll("_", " ")}
                  </small>
                  <span>
                    {r.min === null || r.max === null
                      ? "Additional · pricing to confirm"
                      : range(r.min, r.max)}
                  </span>
                </div>
                {onRemove && (
                  <button
                    className="cc-link"
                    onClick={() => onRemove(r.id)}
                    aria-label={`Remove ${r.item.name}`}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          <dl className="cc-totals">
            <div>
              <dt>Priced selections</dt>
              <dd>
                {estimate.pricedCount
                  ? range(estimate.minimumSubtotal, estimate.maximumSubtotal)
                  : "Not priced"}
              </dd>
            </div>
            <div>
              <dt>
                {estimate.feeLabel}
                {estimate.customCount ? " — on priced items" : ""}
              </dt>
              <dd>
                {estimate.pricedCount
                  ? range(estimate.minimumServiceFee, estimate.maximumServiceFee)
                  : "Pending priced selections"}
              </dd>
            </div>
            {estimate.ownFeePercent > 0 && (
              <div>
                <dt>Your planning fee ({estimate.ownFeePercent}%)</dt>
                <dd>
                  {estimate.pricedCount
                    ? range(estimate.minimumOwnFee, estimate.maximumOwnFee)
                    : "Pending"}
                </dd>
              </div>
            )}
            {estimate.pricedCount > 0 && (
              <div>
                <dt>About, per guest</dt>
                <dd>
                  {money(estimate.minimumPerGuest)}–{money(estimate.maximumPerGuest)}
                </dd>
              </div>
            )}
          </dl>
        </>
      )}
      <details className="cc-help">
        <summary>How this estimate works</summary>
        <p>
          {basics.service === "alacarte"
            ? "À la carte — no design or planning fee. You tell us the vision; we bring it to life."
            : basics.audience === "planner" && basics.service === "planning"
              ? "You are the planner: no Coco Cabana planning fee. Your optional percentage is added to the selected subtotal."
              : feeExplanation}
        </p>
        <p>
          {estimate.tables} tables: {basics.guestCount} guests ÷ {assumptions.guestsPerTable},
          rounded up. Displayed amounts are rounded to whole dollars, or the nearest $10 above
          $1,000; calculations retain cents.
        </p>
      </details>
      {estimate.reference && estimate.underReferenceMinimum && (
        <p className="cc-note">
          For review: this range is below the draft {money(estimate.referenceMinimum!)} service
          minimum. Minimums and their basis still need confirmation; no minimum fee has been added.
        </p>
      )}
      <p className="cc-disclaimer">{disclaimer}</p>
    </div>
  );
}

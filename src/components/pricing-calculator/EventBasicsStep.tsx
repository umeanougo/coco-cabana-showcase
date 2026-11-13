import { validGuestCount } from "@/lib/pricing-calculator/selection-state";
import { usePricing } from "./PricingContext";
import type { Basics } from "@/lib/pricing-calculator/validation";
export function EventBasicsStep({
  value,
  onChange,
  errors = [],
}: {
  value: Basics;
  errors?: { field: string; message: string }[];
  onChange: (v: Basics) => void;
}) {
  const { eventTypes, assumptions } = usePricing();
  return (
    <div className="cc-basics">
      <label>
        Event type
        <select
          value={value.eventType}
          onChange={(e) => onChange({ ...value, eventType: e.target.value })}
        >
          {eventTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <div>
        <label htmlFor="cc-guests">Guest count</label>
        <div className="cc-stepper">
          <button
            type="button"
            aria-label="Fewer guests"
            onClick={() =>
              onChange({
                ...value,
                guestCount: Math.max(assumptions.minGuests, value.guestCount - 10),
              })
            }
          >
            −
          </button>
          <input
            id="cc-guests"
            aria-invalid={errors.some((e) => e.field === "guestCount")}
            type="number"
            min={assumptions.minGuests}
            max={assumptions.maxGuests}
            step="1"
            value={value.guestCount || ""}
            onChange={(e) => onChange({ ...value, guestCount: Number(e.target.value) })}
            aria-describedby="cc-guest-help"
          />
          <button
            type="button"
            aria-label="More guests"
            onClick={() =>
              onChange({
                ...value,
                guestCount: Math.min(assumptions.maxGuests, value.guestCount + 10),
              })
            }
          >
            +
          </button>
        </div>
        <small id="cc-guest-help">
          {assumptions.minGuests}–{assumptions.maxGuests.toLocaleString("en-US")} guests ·{" "}
          {validGuestCount(value.guestCount, assumptions)
            ? `${Math.ceil(value.guestCount / assumptions.guestsPerTable)} tables, allowing ${assumptions.guestsPerTable} guests per table, rounded up.`
            : "Enter a valid guest count to calculate tables."}
        </small>
      </div>
      {errors
        .filter((e) => e.field === "guestCount")
        .map((e) => (
          <p key={e.field} role="alert" className="cc-error">
            {e.message}
          </p>
        ))}
      <label>
        Event date <small>(optional)</small>
        <input
          value={value.eventDate}
          maxLength={100}
          placeholder="Date or approximate timing"
          onChange={(e) => onChange({ ...value, eventDate: e.target.value })}
        />
      </label>
      <label>
        Venue or location <small>(optional)</small>
        <input
          value={value.location}
          maxLength={160}
          placeholder="Still deciding is fine"
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        />
      </label>
      {value.audience === "planner" && value.service === "planning" && (
        <label>
          Your planning fee (%) <small>(optional)</small>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            aria-invalid={errors.some((e) => e.field === "ownFeePercent")}
            value={value.ownFeePercent}
            onChange={(e) => onChange({ ...value, ownFeePercent: Number(e.target.value) })}
          />
          {errors
            .filter((e) => e.field === "ownFeePercent")
            .map((e) => (
              <span key={e.field} role="alert" className="cc-error">
                {e.message}
              </span>
            ))}
          <small>
            Your percentage applies to the selected subtotal. No Coco Cabana planning fee is added.
          </small>
        </label>
      )}
    </div>
  );
}

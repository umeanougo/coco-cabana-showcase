import type { Basics } from "@/lib/pricing-calculator/validation";
import { eventTypes, assumptions } from "@/config/pricing-calculator";
export function EventBasicsStep({
  value,
  onChange,
  errors = [],
}: {
  value: Basics;
  errors?: { field: string; message: string }[];
  onChange: (v: Basics) => void;
}) {
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
            onClick={() => onChange({ ...value, guestCount: Math.max(10, value.guestCount - 10) })}
          >
            −
          </button>
          <input
            id="cc-guests"
            aria-invalid={errors.some((e) => e.field === "guestCount")}
            type="number"
            min="10"
            max="1000"
            step="1"
            value={value.guestCount || ""}
            onChange={(e) => onChange({ ...value, guestCount: Number(e.target.value) })}
            aria-describedby="cc-guest-help"
          />
          <button
            type="button"
            aria-label="More guests"
            onClick={() =>
              onChange({ ...value, guestCount: Math.min(1000, value.guestCount + 10) })
            }
          >
            +
          </button>
        </div>
        <small id="cc-guest-help">
          10–1,000 guests ·{" "}
          {Number.isInteger(value.guestCount) && value.guestCount >= 10
            ? Math.ceil(value.guestCount / assumptions.guestsPerTable)
            : "—"}{" "}
          tables, allowing 8 guests per table, rounded up.
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

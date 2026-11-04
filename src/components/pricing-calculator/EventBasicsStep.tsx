import type { Basics } from "@/lib/pricing-calculator/validation";
import {
  assumptions,
  eventTypes,
  venueStatuses,
  planningStages,
} from "@/config/pricing-calculator";
export function EventBasicsStep({
  value,
  onChange,
}: {
  value: Basics;
  onChange: (v: Basics) => void;
}) {
  const set = (key: keyof Basics, v: string | number | undefined) =>
    onChange({ ...value, [key]: v });
  return (
    <div className="calc-fields">
      <label>
        What are we celebrating?
        <select value={value.eventType} onChange={(e) => set("eventType", e.target.value)}>
          {eventTypes.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        Date or approximate timing <span>(optional)</span>
        <input
          maxLength={100}
          placeholder="e.g. June 2027 or still deciding"
          value={value.eventDate}
          onChange={(e) => set("eventDate", e.target.value)}
        />
      </label>
      <label>
        City or event location
        <input
          required
          maxLength={160}
          placeholder="e.g. Houston, TX"
          value={value.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </label>
      <label>
        Number of guests
        <input
          required
          type="number"
          inputMode="numeric"
          min={1}
          max={assumptions.maxGuests}
          step={1}
          value={value.guestCount || ""}
          onChange={(e) => set("guestCount", Number(e.target.value))}
        />
        <small>Enter a whole number from 1 to {assumptions.maxGuests.toLocaleString()}.</small>
      </label>
      <label>
        Number of tables <span>(optional)</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={10000}
          step={1}
          value={value.tableCount ?? ""}
          placeholder={String(Math.ceil(value.guestCount / assumptions.guestsPerTable))}
          onChange={(e) =>
            set("tableCount", e.target.value === "" ? undefined : Number(e.target.value))
          }
        />
        <small>
          Otherwise, we allow {assumptions.guestsPerTable} guests per table, rounded up.
        </small>
      </label>
      <label>
        Target budget · USD <span>(optional)</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={100000000}
          value={value.desiredBudget ?? ""}
          onChange={(e) =>
            set("desiredBudget", e.target.value === "" ? undefined : Number(e.target.value))
          }
        />
      </label>
      <label>
        Venue status
        <select value={value.venueStatus} onChange={(e) => set("venueStatus", e.target.value)}>
          {venueStatuses.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        Where are you in planning?
        <select value={value.planningStage} onChange={(e) => set("planningStage", e.target.value)}>
          {planningStages.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

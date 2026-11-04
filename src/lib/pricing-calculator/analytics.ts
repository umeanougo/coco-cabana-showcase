export const events = [
  "viewed",
  "started",
  "event_basics_completed",
  "category_opened",
  "item_selected",
  "tier_selected",
  "item_removed",
  "estimate_generated",
  "email_requested",
  "email_succeeded",
  "email_failed",
  "consultation_clicked",
  "honeybook_clicked",
  "abandoned",
] as const;
export function track(event: (typeof events)[number], data: Record<string, string | number> = {}) {
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("coco:analytics", {
        detail: {
          event: `pricing_${event === "viewed" || event === "started" || event === "abandoned" ? "calculator_" : ""}${event}`,
          ...data,
        },
      }),
    );
}

import type { Estimate } from "./calculate-estimate";
export function partialContext(estimate: Pick<Estimate, "customCount">) {
  return estimate.customCount
    ? `Priced items only · ${estimate.customCount} additional item${estimate.customCount === 1 ? "" : "s"} require${estimate.customCount === 1 ? "s" : ""} a quote. The full selected scope will cost more.`
    : "Estimate, not a quote.";
}

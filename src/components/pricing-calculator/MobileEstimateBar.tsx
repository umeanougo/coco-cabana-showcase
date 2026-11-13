import { useEffect, useRef, type MouseEventHandler } from "react";
import { usePricing } from "./PricingContext";
import { type Estimate, range } from "@/lib/pricing-calculator/calculate-estimate";
import type { SelectionState } from "@/lib/pricing-calculator/selection-state";
export function MobileEstimateBar({
  estimate,
  state,
  pausedMessage,
  onReview,
}: {
  estimate: Estimate | null;
  state: SelectionState;
  pausedMessage: string;
  onReview: MouseEventHandler<HTMLButtonElement>;
}) {
  const { exclusions } = usePricing();
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = bar.current;
    const container = element?.closest<HTMLElement>(".cc-pricing");
    if (!element || !container) return;
    const revealFocusedControl = () => {
      if (getComputedStyle(element).display === "none") return;
      const focused = document.activeElement;
      if (
        !(focused instanceof HTMLElement) ||
        !container.contains(focused) ||
        element.contains(focused)
      )
        return;
      if (!focused.matches("input, select, textarea, button, summary")) return;
      const rect = focused.getBoundingClientRect();
      const fixed = getComputedStyle(element).position === "fixed";
      const bottom =
        (fixed
          ? element.getBoundingClientRect().top
          : (window.visualViewport?.height ?? window.innerHeight)) - 12;
      const top = 100;
      const offset =
        rect.bottom > bottom ? rect.bottom - bottom : rect.top < top ? rect.top - top : 0;
      if (offset) window.scrollBy({ top: offset, behavior: "instant" });
    };
    const measure = () => {
      const available = window.visualViewport?.height ?? window.innerHeight;
      // On short screens or with a virtual keyboard, use the in-flow summary above inputs.
      element.classList.toggle("cc-mobile-total-inline", available < 600);
      const height =
        getComputedStyle(element).position === "fixed" ? element.getBoundingClientRect().height : 0;
      container.style.setProperty("--cc-mobile-bar-height", `${height}px`);
      if (getComputedStyle(element).display !== "none") revealFocusedControl();
    };
    let focusFrame = 0;
    const onFocus = () => {
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(revealFocusedControl);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    container.addEventListener("focusin", onFocus);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(focusFrame);
      container.removeEventListener("focusin", onFocus);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      container.style.removeProperty("--cc-mobile-bar-height");
    };
  }, []);
  const custom = state.applicable.filter((r) => r.custom).length;
  return (
    <div ref={bar} className="cc-mobile-total">
      <div aria-live="polite" aria-atomic="true">
        {estimate ? (
          <>
            <small>
              {estimate.pricedCount} priced selections only
              {estimate.reference ? " · reference range" : ""}
            </small>
            <strong>
              {estimate.pricedCount
                ? range(estimate.minimumTotal, estimate.maximumTotal)
                : state.applicable.length
                  ? "Pricing to confirm"
                  : "Choose an item"}
            </strong>
          </>
        ) : (
          <>
            <strong>Totals paused</strong>
            <small>{pausedMessage}</small>
          </>
        )}
        <small>
          {custom > 0 ? `${custom} additional requiring a quote. ` : ""}Estimate, not a quote.
        </small>
        {state.excluded.length > 0 && (
          <small>{state.excluded.length} other selections retained, excluded here.</small>
        )}
      </div>
      <p className="cc-mobile-exclusions">{exclusions}</p>
      <button
        className="cc-button"
        data-review-trigger="mobile"
        disabled={!estimate}
        onClick={onReview}
      >
        Review breakdown
      </button>
    </div>
  );
}

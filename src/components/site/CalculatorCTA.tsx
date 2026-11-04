import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
export function CalculatorCTA({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`calculator-promo ${compact ? "compact" : ""}`}>
      <div>
        <p className="eyebrow">A little clarity, before the celebration</p>
        <h2>What might your event cost?</h2>
        <p>
          Explore a starting range for your guest count and selected details. See which elements
          need a personal consultation.
        </p>
      </div>
      <Link to="/pricing-calculator" className="calc-button">
        Build My Estimate <ArrowUpRight size={18} />
      </Link>
    </section>
  );
}

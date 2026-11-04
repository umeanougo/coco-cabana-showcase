import { usePricing } from "./PricingContext";
import { money } from "@/lib/pricing-calculator/calculate-estimate";
import { Link } from "@tanstack/react-router";
import type { Tier } from "@/config/pricing-calculator";
import { ConsultationCTA } from "./ConsultationCTA";
export function PricingGuide() {
  const {
    services,
    tierDescriptions,
    tierLabels,
    feeExplanation,
    assumptions,
    fees,
    disclaimer,
    exclusions,
  } = usePricing();
  const faqs = [
    [
      "How much should I budget per guest?",
      "Your estimate shows a per-guest range based on the details you select. Items marked per guest scale with your guest count; flat-price elements do not. Include every category you need before comparing budgets. Unpriced items remain additional.",
    ],
    [
      "How much does event decor cost in Houston?",
      "The pieces, quantities and tiers you choose shape your décor budget. Choose Design for a design concept and execution, or À la carte décor when you already know the vision. Final rates and inclusions are confirmed with Coco Cabana.",
    ],
    [
      "How much do backdrops, centerpieces and chair rentals cost?",
      "Each item shows its pricing basis and range. Reference figures require approval before publication; custom-quote items are additional.",
    ],
    [
      "How much does a wedding planner cost in Houston?",
      feeExplanation +
        " This is a fee on the selected event subtotal, not a fee charged again on the total including fees.",
    ],
    [
      "What percentage of my budget should go to a planner?",
      feeExplanation + " Other planners using the tool can add their own percentage instead.",
    ],
    [
      "What’s the difference between a planner, a designer and a decorator?",
      "Planning covers vendors, design, timeline and the day itself. Design creates the look, then sources and installs it. À la carte décor is for clients or planners who already have a vision and need the selected pieces executed.",
    ],
    [
      "What affects the final price of my event?",
      "Guest count, date, venue requirements, design complexity and setup or breakdown time can all affect the final amount. Your selections create a planning range; consultation confirms scope and inclusions.",
    ],
    [
      "Do you work with event planners?",
      "Yes. Choose the planner path to build a full event budget without a Coco Cabana planning fee, or choose Design or À la carte décor for support. Ask about our Planner Partner Program during your consultation.",
    ],
    ["Is this calculator’s estimate a quote?", disclaimer + " " + exclusions],
    [
      "Do I need to give my email to see prices?",
      "No. Build and view your estimate freely. Contact information is requested only when you ask to keep a copy. Optional marketing permission is separate from your requested estimate.",
    ],
  ];
  return (
    <div className="cc-guide">
      <section className="cc-guide-section">
        <p className="cc-eyebrow">Clarity before commitment</p>
        <h2>Our services, explained.</h2>
        <div className="cc-guide-columns">
          {Object.entries(services).map(([id, s]) => (
            <article key={id}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <p>{s.detail}</p>
              <a href="#event-estimator" className="cc-link">
                Explore {s.name} →
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="cc-guide-section cc-tinted">
        <div>
          <p className="cc-eyebrow">Choose where to make a statement</p>
          <h2>Three tiers. Your own combination.</h2>
          <p>
            You don’t need to choose one tier for your whole event. Give each detail the attention
            that matters to you.
          </p>
        </div>
        <div className="cc-tier-guide">
          {(Object.keys(tierLabels) as Tier[]).map((t, i) => (
            <article key={t}>
              <span>0{i + 1}</span>
              <div>
                <h3>{tierLabels[t]}</h3>
                <p>{tierDescriptions[t]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cc-guide-section cc-reading">
        <p className="cc-eyebrow">The details behind the number</p>
        <h2>What affects your event cost?</h2>
        <p>
          Each item shows whether its price is flat, per guest, per table or per quantity. This
          estimator allows {assumptions.guestsPerTable} guests per table and rounds up. Review each
          selected item's basis and inclusions.
        </p>
        <p>
          The next choice is where to focus your design. Mix {tierLabels.economic},{" "}
          {tierLabels.average} and {tierLabels.lux} selections rather than assuming every element
          needs the same finish. A few statement pieces can sit alongside simpler details. The
          calculator shows the effect of those choices immediately, so you can compare directions
          before committing to a particular scope.
        </p>
        <p>{exclusions}</p>
      </section>
      <section className="cc-guide-section cc-fee-guide">
        <div>
          <p className="cc-eyebrow">Every number, upfront</p>
          <h2>How our fees work.</h2>
          <p>
            Planning uses the selected vendors and décor subtotal. Design uses décor only. Each end
            of the range is calculated separately.
          </p>
        </div>
        <div>
          <dl>
            <div>
              <dt>Up to {money(fees.lowerThreshold)}</dt>
              <dd>{fees.lowerPercent}%</dd>
            </div>
            <div>
              <dt>
                Above {money(fees.lowerThreshold)} through {money(fees.upperThreshold)}
              </dt>
              <dd>{money(fees.flatAmount)} flat</dd>
            </div>
            <div>
              <dt>Above {money(fees.upperThreshold)}</dt>
              <dd>{fees.upperPercent}%</dd>
            </div>
          </dl>
          <p>
            À la carte décor has no planning or design fee. The planner Full event budget path has
            no Coco Cabana planning fee; the planner’s optional own percentage is separate.
          </p>
        </div>
      </section>
      <section className="cc-guide-section cc-reading">
        <p className="cc-eyebrow">From possibility to a plan</p>
        <h2>Explore our work.</h2>
        <p>
          Browse Coco Cabana’s portfolio for inspiration. Event-specific budget examples will be
          added only after the team verifies the scope, figures and permission to share them.
        </p>
        <Link to="/portfolio" className="cc-link">
          View the portfolio →
        </Link>
      </section>
      <section className="cc-guide-section cc-faq">
        <p className="cc-eyebrow">Questions, answered</p>
        <h2>Houston event pricing FAQs</h2>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="cc-guide-section cc-planner">
        <p className="cc-eyebrow">For event professionals</p>
        <h2>A design partner for your next event.</h2>
        <p>
          We love building long-term partnerships with planners. Book a call and we’ll share our
          Planner Partner Program, including a thank-you reward on every event you bring to us.
        </p>
        <ConsultationCTA planner />
      </section>
      <section className="cc-guide-section">
        <ConsultationCTA />
      </section>
    </div>
  );
}

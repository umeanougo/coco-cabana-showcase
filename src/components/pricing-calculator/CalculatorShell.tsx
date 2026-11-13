import { usePricing } from "./PricingContext";
import { referencePricingEnabled, reviewEnvironment } from "@/config/review-environment";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  basicsSchema,
  scopeIssues,
  selectionsSchema,
  type Basics,
  type Selection,
  type Submission,
} from "@/lib/pricing-calculator/validation";
import { calculateEstimate, range } from "@/lib/pricing-calculator/calculate-estimate";
import { type Audience, type Service } from "@/config/pricing-calculator";
import { EventBasicsStep } from "./EventBasicsStep";
import { PricingCategory } from "./PricingCategory";
import { EstimateSummary } from "./EstimateSummary";
import { EstimateEmailForm } from "./EstimateEmailForm";
import { PricingGuide } from "./PricingGuide";
const initial: Basics = {
  audience: "client",
  service: "planning",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  guestCount: 120,
  ownFeePercent: 0,
};
export function CalculatorShell() {
  const {
    configuration,
    localPreview,
    categories,
    services,
    serviceName,
    pricingItems,
    feeExplanation,
    assumptions,
    exclusions,
  } = usePricing();
  const key = localPreview ? "coco-budget-admin-preview-v1" : "coco-budget-v2";
  const [basics, setBasics] = useState({
      ...initial,
      eventType: configuration.eventTypes[0],
      guestCount: Math.max(assumptions.minGuests, Math.min(120, assumptions.maxGuests)),
    }),
    [selections, setSelections] = useState<Selection[]>([]),
    [stage, setStage] = useState<"audience" | "service" | "build">("audience");
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [ready, setReady] = useState(false),
    [storageNote, setStorageNote] = useState("");
  const [review, setReview] = useState(false),
    [saving, setSaving] = useState(false),
    [attribution, setAttribution] = useState<Submission["attribution"]>({});
  const allowReferencePrices = referencePricingEnabled || localPreview;
  useEffect(() => {
    try {
      const raw = localPreview ? null : sessionStorage.getItem(key);
      if (raw) {
        const d = JSON.parse(raw);
        if (
          basicsSchema.safeParse(d.basics).success &&
          selectionsSchema.safeParse(d.selections).success
        ) {
          setBasics(d.basics);
          setSelections(d.selections);
          if (["audience", "service", "build"].includes(d.stage)) setStage(d.stage);
        }
      }
    } catch {
      setStorageNote("This browser cannot restore your draft. Keep this tab open or print a copy.");
    }
    const params = new URLSearchParams(location.search);
    setAttribution(
      Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign"]
          .filter((k) => params.has(k))
          .map((k) => [k, params.get(k)!.slice(0, 200)]),
      ),
    );
    setReady(true);
  }, [key, localPreview]);
  useEffect(() => {
    if (ready && !localPreview)
      try {
        sessionStorage.setItem(key, JSON.stringify({ basics, selections, stage }));
      } catch {
        setStorageNote("Progress could not be saved in this browser. Print a copy before leaving.");
      }
  }, [basics, selections, stage, ready, key, localPreview]);
  const issues = scopeIssues(basics, selections, pricingItems, configuration);
  const valid = issues.length === 0;
  const estimate = valid
    ? calculateEstimate(basics, selections, {
        allowReferencePrices: allowReferencePrices || localPreview,
        configuration,
      })
    : null;
  const pickAudience = (audience: Audience) => {
    setBasics({ ...basics, audience });
    setStage("service");
  };
  const remove = (id: string) => setSelections(selections.filter((s) => s.id !== id));
  const openReview = () => {
    setSaving(false);
    setReview(true);
  };
  return (
    <div className="cc-pricing">
      <header className="cc-hero">
        <p className="cc-eyebrow">Coco Cabana · Houston event pricing</p>
        <h1>
          Build a starting budget
          <br className="hidden sm:block" /> for your event.
        </h1>
        <p>
          Explore ranges for the elements you choose, with fees shown separately.
          <br className="hidden sm:block" /> Add what matters to you; no email needed to see the
          total.
        </p>
        <a className="cc-button" href="#event-estimator">
          Start my estimate <span aria-hidden="true">↘</span>
        </a>
        <div className="cc-hero-note">No email needed to explore · No commitment to book</div>
      </header>
      {allowReferencePrices && (
        <div className="cc-preview-note">
          <strong>Review preview</strong>
          <small> · {reviewEnvironment.revision} · Email, marketing and bookings disabled.</small>
          <span>
            Reference prices from Christine’s brief. Rates, minimums and inclusions need approval
            before publication.
          </span>
        </div>
      )}
      <section id="event-estimator" className="cc-builder" aria-label="Event budget estimator">
        <nav className="cc-stage-nav" aria-label="Estimator steps">
          <button
            aria-current={stage === "audience" ? "step" : undefined}
            onClick={() => setStage("audience")}
          >
            01 · Who’s planning
          </button>
          <button
            disabled={stage === "audience"}
            aria-current={stage === "service" ? "step" : undefined}
            onClick={() => setStage("service")}
          >
            02 · Your service
          </button>
          <span aria-current={stage === "build" ? "step" : undefined}>
            03 · Build your estimate
          </span>
        </nav>
        {storageNote && <p role="status">{storageNote}</p>}
        {stage === "audience" && (
          <div className="cc-choice">
            <p className="cc-eyebrow">Made for the way you plan</p>
            <h2>Who’s planning this event?</h2>
            <p>We’ll tailor your options and pricing to how you work. It’s free for everyone.</p>
            <div className="cc-choice-list">
              <button onClick={() => pickAudience("client")}>
                <span>
                  <strong>I’m planning an event for myself or my organisation.</strong>
                  <small>Personal celebrations and corporate events.</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
              <button onClick={() => pickAudience("planner")}>
                <span>
                  <strong>I’m a professional planner working with clients.</strong>
                  <small>Budget your clients’ events for free.</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}
        {stage === "service" && (
          <div className="cc-choice">
            <p className="cc-eyebrow">
              {basics.audience === "planner"
                ? "Free for planners, always"
                : "Your event, your kind of support"}
            </p>
            <h2>
              {basics.audience === "planner"
                ? "Budget your clients’ events in minutes."
                : "How would you like to work with us?"}
            </h2>
            <p>Choose your service below. Open the details if you need more guidance.</p>
            <div className="cc-service-list">
              {(Object.keys(services) as Service[]).map((id) => (
                <article key={id} className="cc-service-card">
                  <h3>
                    {services[id].name}
                    {basics.audience === "planner" && id === "planning"
                      ? " · Full event budget"
                      : ""}
                  </h3>
                  <p>
                    {basics.audience === "planner" && id === "planning"
                      ? "Budget vendors and décor for your client. You remain the planner."
                      : services[id].description}
                  </p>
                  <p className="cc-fee-copy">
                    {id === "alacarte"
                      ? "No planning or design fee; selected décor only."
                      : basics.audience === "planner" && id === "planning"
                        ? "No Coco Cabana planning fee. Add your own optional percentage."
                        : "Selected items plus the tiered service fee."}
                  </p>
                  <button
                    className="cc-button"
                    onClick={() => {
                      setBasics({ ...basics, service: id });
                      setStage("build");
                    }}
                  >
                    Continue with {serviceName(basics.audience, id)}
                  </button>
                  <details className="cc-help">
                    <summary>Scope and fee details · {services[id].name}</summary>
                    <p>
                      {basics.audience === "planner" && id === "planning"
                        ? "This is a free budgeting tool for your own planning. Your optional fee applies only to Full event budget."
                        : services[id].detail}
                    </p>
                    {!(
                      id === "alacarte" ||
                      (basics.audience === "planner" && id === "planning")
                    ) && <p>{feeExplanation}</p>}
                    <p>
                      The estimate covers selected items, not every event cost. Service scope and
                      final inclusions are agreed separately.
                    </p>
                  </details>
                </article>
              ))}
            </div>
          </div>
        )}
        {stage === "build" && (
          <div className="cc-build-grid">
            <div className="cc-selection">
              <div className="cc-build-heading">
                <div>
                  <p className="cc-eyebrow">Your service</p>
                  <h2>{serviceName(basics.audience, basics.service)}</h2>
                </div>
                <button className="cc-link" onClick={() => setStage("service")}>
                  Change service
                </button>
              </div>
              <EventBasicsStep value={basics} onChange={setBasics} errors={issues} />
              {!valid && (
                <p role="alert" className="cc-error">
                  {issues.map((i) => i.message).join(" ")} Totals pause until applicable inputs are
                  valid.
                </p>
              )}
              {estimate && estimate.excluded.length > 0 && (
                <p role="status" className="cc-note">
                  {estimate.excluded.length} selection(s) are retained but excluded from this
                  service’s total. Switch back to Planning / Full event budget to restore them.
                </p>
              )}
              <p className="cc-instruction">
                Tap a tier to add an item, again to remove it. Mix tiers to suit your priorities.
              </p>
              <div className="cc-category-actions" aria-label="Category controls">
                <button
                  className="cc-link"
                  onClick={() => setOpenCategories(categories.map((c) => c.id))}
                >
                  Expand all categories
                </button>
                <button className="cc-link" onClick={() => setOpenCategories([])}>
                  Collapse all categories
                </button>
              </div>
              {categories
                .filter((c) =>
                  pricingItems.some(
                    (i) =>
                      i.categoryId === c.id &&
                      !i.hidden &&
                      i.audiences.includes(basics.audience) &&
                      i.services.includes(basics.service),
                  ),
                )
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((c) => {
                  const total = estimate?.categoryTotals.find((t) => t.id === c.id);
                  return (
                    <details
                      className="cc-category"
                      open={openCategories.includes(c.id)}
                      key={c.id}
                    >
                      <summary
                        onClick={(event) => {
                          event.preventDefault();
                          setOpenCategories((current) =>
                            current.includes(c.id)
                              ? current.filter((id) => id !== c.id)
                              : [...current, c.id],
                          );
                        }}
                      >
                        <h3>
                          {c.name}
                          <small className="cc-category-count">
                            {estimate?.rows.filter((r) => r.item.categoryId === c.id).length ?? 0}{" "}
                            selected
                          </small>
                        </h3>
                        <span>
                          {total &&
                          estimate?.rows.some((r) => r.item.categoryId === c.id && !r.custom)
                            ? range(total.min, total.max)
                            : estimate?.rows.some((r) => r.item.categoryId === c.id)
                              ? "Pricing to confirm"
                              : "Explore"}{" "}
                          {estimate &&
                            estimate.rows.some((r) => r.item.categoryId === c.id && r.custom) && (
                              <small className="cc-partial">
                                Priced items only ·{" "}
                                {
                                  estimate.rows.filter(
                                    (r) => r.item.categoryId === c.id && r.custom,
                                  ).length
                                }{" "}
                                additional requiring a quote
                              </small>
                            )}
                          <span aria-hidden="true">⌄</span>
                        </span>
                      </summary>
                      <PricingCategory
                        categoryId={c.id}
                        basics={basics}
                        selections={selections}
                        onChange={setSelections}
                        allowReferencePrices={allowReferencePrices}
                        errors={issues}
                      />
                    </details>
                  );
                })}
              <p className="cc-fine">
                Your draft stays in this browser tab. Contact details are only requested when you
                ask to keep a copy.
              </p>
            </div>
            <aside className="cc-side-summary">
              {estimate ? (
                <>
                  <EstimateSummary estimate={estimate} basics={basics} onRemove={remove} />
                  <button className="cc-button cc-wide" onClick={openReview}>
                    Review breakdown
                  </button>
                </>
              ) : (
                <p>Enter valid event details to see your estimate.</p>
              )}
            </aside>
          </div>
        )}
      </section>
      <PricingGuide />
      {stage === "build" && (
        <div className="cc-mobile-total">
          <div aria-live="polite" aria-atomic="true">
            <small>
              {estimate?.pricedCount ?? 0} priced selections only
              {estimate?.reference ? " · reference range" : ""}
            </small>
            <strong>
              {estimate?.pricedCount
                ? range(estimate.minimumTotal, estimate.maximumTotal)
                : valid
                  ? "Pricing to confirm"
                  : "Check inputs"}
            </strong>
            <small>
              {estimate?.customCount
                ? `Priced items only · ${estimate.customCount} additional requiring a quote. Estimate, not a quote.`
                : "Estimate, not a quote."}
            </small>
          </div>
          <p className="cc-mobile-exclusions">{exclusions}</p>
          <button className="cc-button" disabled={!valid} onClick={openReview}>
            Review breakdown
          </button>
        </div>
      )}
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent className="cc-dialog cc-review">
          <DialogTitle>Review your estimate</DialogTitle>
          <DialogDescription>
            Your selected details, their pricing basis, and the next steps.
          </DialogDescription>
          {estimate && (
            <>
              {!saving ? (
                <>
                  <EstimateSummary estimate={estimate} basics={basics} onRemove={remove} />
                  <div className="cc-actions">
                    <button
                      className="cc-button"
                      disabled={!estimate.rows.length || localPreview}
                      onClick={() => setSaving(true)}
                    >
                      {localPreview ? "Copies disabled in local draft preview" : "Keep a copy"}
                    </button>
                  </div>
                </>
              ) : (
                <EstimateEmailForm
                  basics={basics}
                  selections={selections}
                  attribution={attribution}
                  onBack={() => setSaving(false)}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { useEffect, useRef, useState } from "react";
import { Printer, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";
import {
  basicsSchema,
  selectionsSchema,
  type Basics,
  type Selection,
} from "@/lib/pricing-calculator/validation";
import { calculateEstimate } from "@/lib/pricing-calculator/calculate-estimate";
import { track } from "@/lib/pricing-calculator/analytics";
import { site } from "@/config/site";
import { EventBasicsStep } from "./EventBasicsStep";
import { PricingCategory } from "./PricingCategory";
import { EstimateSummary } from "./EstimateSummary";
import { EstimateEmailForm } from "./EstimateEmailForm";
const steps = [
  "Event basics",
  "Planning & vendors",
  "Décor & design",
  "Rentals & extras",
  "Your estimate",
  "Email & consultation",
];
const initial: Basics = {
  eventType: "Wedding",
  eventDate: "",
  location: "",
  guestCount: 50,
  venueStatus: "Not sure yet",
  planningStage: "Just exploring",
};
const storageKey = "coco-budget-v1";
const draftSchema = z.object({
  basics: basicsSchema.extend({
    location: z.string().max(160),
    guestCount: z.number().int().min(0).max(10000),
  }),
  selections: selectionsSchema,
  step: z.number().int().min(0).max(5),
  reference: z.string().uuid(),
  attribution: z.record(z.string().max(200)).default({}),
});
export function CalculatorShell() {
  const [basics, setBasics] = useState(initial);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState("");
  const [ready, setReady] = useState(false);
  const [storageNote, setStorageNote] = useState("");
  const [error, setError] = useState("");
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const title = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    let restored = false;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = draftSchema.safeParse(JSON.parse(raw));
        if (parsed.success) {
          const d = parsed.data;
          setBasics(d.basics);
          setSelections(d.selections);
          setStep(d.step);
          setReference(d.reference);
          setAttribution(d.attribution);
          restored = true;
        }
      }
    } catch {
      setStorageNote(
        "This browser cannot save your progress. Keep this tab open or print your estimate.",
      );
    }
    if (!restored) {
      setReference(crypto.randomUUID());
      const params = new URLSearchParams(location.search);
      setAttribution(
        Object.fromEntries(
          ["utm_source", "utm_medium", "utm_campaign"]
            .filter((k) => params.has(k))
            .map((k) => [k, params.get(k)!.slice(0, 200)]),
        ),
      );
    }
    setReady(true);
    track("viewed");
    if (import.meta.env.DEV && !site.calendly)
      console.info(
        "Calculator: configure VITE_COCO_CABANA_CALENDLY_URL to enable consultation booking.",
      );
    return () => {
      if (started.current && stepRef.current < 4) track("abandoned", { step: stepRef.current + 1 });
    };
  }, []);
  useEffect(() => {
    if (ready)
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ basics, selections, step, reference, attribution }),
        );
      } catch {
        setStorageNote("Progress could not be saved in this browser. Print a copy before leaving.");
      }
  }, [basics, selections, step, reference, ready, attribution]);
  const change = () => {
    if (!started.current) {
      started.current = true;
      track("started");
    }
    setReference(crypto.randomUUID());
  };
  const [summaryOpen, setSummaryOpen] = useState(false);
  const go = (n: number) => {
    setSummaryOpen(false);
    if (n > 0 && !basicsSchema.safeParse(basics).success) {
      setError("Enter a location and valid whole-number guest/table counts before continuing.");
      setStep(0);
      return;
    }
    setError("");
    setStep(n);
    if (n >= 1 && n <= 3)
      track("category_opened", { category: ["planning", "decor", "rentals"][n - 1] });
    if (n === 4)
      track("estimate_generated", {
        guest_count_band:
          basics.guestCount <= 50 ? "1–50" : basics.guestCount <= 150 ? "51–150" : "151+",
      });
    requestAnimationFrame(() => {
      title.current?.focus();
      title.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  const estimate = calculateEstimate(
    {
      ...basics,
      guestCount:
        Number.isInteger(basics.guestCount) && basics.guestCount > 0 && basics.guestCount <= 10000
          ? basics.guestCount
          : 1,
    },
    selections,
  );
  const summary = (
    <EstimateSummary
      estimate={estimate}
      basics={basics}
      reference={reference}
      onEdit={() => go(0)}
      onRemove={(id) => {
        change();
        setSelections(selections.filter((s) => s.id !== id));
        track("item_removed");
      }}
    />
  );
  return (
    <div className="calculator-page">
      <header className="calculator-heading">
        <p className="eyebrow">Event Budget Calculator · Coco Cabana</p>
        <h1>
          Every celebration starts
          <br />
          with <em>a little possibility.</em>
        </h1>
        <p>
          Build a preliminary event budget around the details you love.
          <br className="hidden sm:block" />
          No email needed to explore. No commitment to book.
        </p>
      </header>
      <div className="calculator-layout">
        <div className="calculator-main">
          <nav aria-label="Calculator progress" className="calc-progress no-print">
            <ol>
              {steps.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    aria-current={step === i ? "step" : undefined}
                    onClick={() => go(i)}
                  >
                    <span>{i + 1}</span>
                    <span>{s}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <section className="calc-panel no-print">
            <p className="eyebrow">
              Step {step + 1} of {steps.length}
            </p>
            <h2 ref={title} tabIndex={-1}>
              {steps[step]}
            </h2>
            <p className="step-description">
              {
                [
                  "Tell us a little about the occasion. You can change these details at any time.",
                  "Choose the support you need. Skip anything you’re still deciding.",
                  "Set the scene, from the first impression to the last dance.",
                  "Add the finishing touches that make the day feel like you.",
                  "Review your selections. Unpriced services will be discussed in consultation.",
                  "Save a copy, then take the next step when you’re ready.",
                ][step]
              }
            </p>
            {storageNote && <p role="status">{storageNote}</p>}
            {error && (
              <p id="basics-error" role="alert">
                {error}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 0) track("event_basics_completed", { event_type: basics.eventType });
                go(step + 1);
              }}
              aria-describedby={error ? "basics-error" : undefined}
            >
              {step === 0 && (
                <EventBasicsStep
                  value={basics}
                  onChange={(v) => {
                    change();
                    setBasics(v);
                  }}
                />
              )}
              {step >= 1 && step <= 3 && (
                <PricingCategory
                  categoryId={["planning", "decor", "rentals"][step - 1]}
                  selections={selections}
                  onChange={(s) => {
                    change();
                    setSelections(s);
                  }}
                />
              )}
              {step === 4 && (
                <div className="review-actions">
                  <p>
                    {selections.length
                      ? `${selections.length} ${selections.length === 1 ? "element" : "elements"} selected. Review the itemized estimate below or alongside this panel.`
                      : "No services selected yet. Choose at least one element to email your estimate."}
                  </p>
                  <button
                    type="button"
                    className="calc-button secondary"
                    onClick={() => window.print()}
                  >
                    <Printer size={16} /> Print / Save PDF
                  </button>
                  <button type="button" className="text-link" onClick={() => go(2)}>
                    Edit selected details
                  </button>
                </div>
              )}
              {step < 5 && (
                <div className="calc-step-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="calc-button secondary"
                      onClick={() => go(step - 1)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  )}
                  <button type="submit" className="calc-button">
                    {step === 3 ? "Review estimate" : step === 4 ? "Save & next steps" : "Continue"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </form>
            {step === 5 && (
              <EstimateEmailForm
                key={reference}
                basics={basics}
                selections={selections}
                reference={reference}
                attribution={attribution}
              />
            )}
          </section>
          <p className="session-note no-print">
            Your selections stay in this browser tab when you refresh. Closing the tab ends the
            session.
          </p>
        </div>
        <aside className="calculator-summary">{summary}</aside>
      </div>
      <div className="mobile-estimate no-print">
        <Drawer open={summaryOpen} onOpenChange={setSummaryOpen}>
          <DrawerTrigger asChild>
            <button className="calc-button">
              Review estimate ·{" "}
              {estimate.pricedCount
                ? `$${estimate.minimumTotal.toLocaleString()}–$${estimate.maximumTotal.toLocaleString()}`
                : `${selections.length} selected`}
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85dvh]">
            <div className="overflow-y-auto p-4">
              <DrawerTitle className="sr-only">Your event estimate</DrawerTitle>
              <DrawerDescription className="sr-only">
                Review your selected items, assumptions and priced range.
              </DrawerDescription>
              <DrawerClose className="text-link mb-3">Close estimate</DrawerClose>
              {summary}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="print-brand">
        Coco Cabana · Event Budget Calculator · {site.email}
        {site.calendly && <p>Consultation: {site.calendly}</p>}
      </div>
    </div>
  );
}

import { hostedSavingUnavailable, hostedSavingMessage } from "@/config/review-environment";
import { useEffect, useRef, useState } from "react";
import {
  contactSchema,
  type Basics,
  type Selection,
  type Submission,
} from "@/lib/pricing-calculator/validation";
import { pricingVersion } from "@/config/pricing-calculator";
import { SubmissionSession } from "@/lib/pricing-calculator/submission-session";
import type { Snapshot } from "@/server/estimate-store";
import { estimatePdf } from "@/lib/pricing-calculator/estimate-pdf";
import { EstimateSummary } from "./EstimateSummary";
import { ConsultationCTA } from "./ConsultationCTA";
type Result = {
  state?: string;
  message: string;
  snapshot?: Snapshot;
  proposal?: Snapshot;
  reference?: string;
  emailStatus?: string;
  teamStatus?: string;
  retiredItems?: string[];
};
const deliveryLabel = (status?: string) =>
  ({
    held_preview: "not sent — local preview",
    held_pricing: "on hold — pricing needs approval",
    held_config: "on hold — delivery is not configured",
    pending: "waiting to send",
    queued: "send in progress",
    accepted: "accepted by email provider; delivery unconfirmed",
    failed: "send failed; awaiting recovery",
    needs_review: "manual review required",
    missing_intent: "notification setup requires review",
  })[status || ""] || "status unavailable";

export function EstimateEmailForm({
  basics,
  selections,
  attribution,
  onBack,
}: {
  basics: Basics;
  selections: Selection[];
  attribution: Submission["attribution"];
  onBack: () => void;
}) {
  const [contact, setContact] = useState({
    firstName: "",
    email: "",
    phone: "",
    businessName: "",
    instagram: "",
    clientPurpose: "current" as "current" | "exploring",
    marketingConsent: false,
  });
  const [result, setResult] = useState<Result | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (result) {
      resultHeading.current?.focus();
      resultHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [result]);
  const session = useRef(new SubmissionSession());
  const attempt = useRef<{ fingerprint: string; reference: string } | null>(null);
  useEffect(() => {
    session.current.invalidate();
    setResult(null);
    setError("");
    setBusy(false);
  }, [basics, selections]);
  useEffect(() => () => session.current.invalidate(), []);
  const update = (key: keyof typeof contact, value: string | boolean) => {
    session.current.invalidate();
    setContact((c) => ({ ...c, [key]: value }));
    setResult(null);
    setError("");
    setBusy(false);
  };
  const send = async (reviewed?: Snapshot) => {
    if (hostedSavingUnavailable) {
      setError(hostedSavingMessage);
      return;
    }
    const valid = contactSchema.safeParse(contact);
    if (!valid.success) {
      setError(valid.error.issues[0].message);
      return;
    }
    const token = session.current.start();
    setBusy(true);
    setError("");
    const payload = {
      basics: reviewed?.data.basics ?? basics,
      selections: reviewed?.data.selections ?? selections,
      catalogVersion: reviewed?.catalogVersion ?? pricingVersion,
      contact: valid.data,
      attribution,
    };
    try {
      const fingerprint = Array.from(
        new Uint8Array(
          await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload))),
        ),
      )
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (!session.current.accepts(token)) return;
      if (attempt.current?.fingerprint !== fingerprint) {
        let old: typeof attempt.current = null;
        try {
          old = JSON.parse(sessionStorage.getItem("coco-estimate-request-v3") || "null");
        } catch {
          /* optional browser storage */
        }
        attempt.current =
          old?.fingerprint === fingerprint && /^[0-9a-f-]{36}$/i.test(old.reference)
            ? old
            : { fingerprint, reference: crypto.randomUUID() };
        try {
          sessionStorage.setItem("coco-estimate-request-v3", JSON.stringify(attempt.current));
        } catch {
          /* in-memory retry fallback */
        }
      }
      const res = await fetch("/api/pricing-estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, reference: attempt.current.reference }),
      });
      const data = (await res.json()) as Result;
      if (!session.current.accepts(token)) return;
      if (data.state === "pricing_changed" && data.proposal) {
        setResult(data);
        return;
      }
      if (!res.ok || !data.snapshot) {
        setError(data.message || "Saving could not be confirmed. Your inputs are intact.");
        return;
      }
      setResult(data);
    } catch {
      if (session.current.accepts(token))
        setError("Saving could not be confirmed. Your inputs are intact. Retry safely.");
    } finally {
      if (session.current.accepts(token)) setBusy(false);
    }
  };
  const download = (snapshot: Snapshot) => {
    const bytes = Uint8Array.from(atob(estimatePdf(snapshot)), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `coco-cabana-estimate-${snapshot.data.reference}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  if (result?.proposal)
    return (
      <div className="cc-save">
        <h3 ref={resultHeading} tabIndex={-1}>
          Review updated pricing
        </h3>
        <p role="status">{result.message} Nothing has been saved for this new request.</p>
        {!!result.retiredItems?.length && (
          <p>
            {result.retiredItems.length} retired selection(s) have been removed from this proposed
            estimate.
          </p>
        )}
        <p>Catalog: {result.proposal.catalogVersion}</p>
        <EstimateSummary estimate={result.proposal.estimate} basics={result.proposal.data.basics} />
        {error && (
          <p role="alert" className="cc-error">
            {error}
          </p>
        )}
        <button
          className="cc-button"
          disabled={busy || !result.proposal.estimate.rows.length}
          onClick={() => send(result.proposal)}
        >
          {busy ? "Saving…" : "Save this reviewed estimate"}
        </button>
        <button
          className="cc-link"
          disabled={busy}
          onClick={() => {
            setResult(null);
            onBack();
          }}
        >
          Back to editing
        </button>
      </div>
    );
  if (result?.snapshot) {
    const saved = result.snapshot;
    return (
      <div className="cc-save">
        <h3 ref={resultHeading} tabIndex={-1}>
          Estimate saved
        </h3>
        <p role="status">{result.message}</p>
        <p>
          Saved for {saved.data.contact.firstName} · {saved.data.contact.email}
        </p>
        <p className="cc-fine">
          Reference: {saved.data.reference}
          <br />
          Saved pricing version: {saved.catalogVersion}
        </p>
        <EstimateSummary estimate={saved.estimate} basics={saved.data.basics} />
        <p>
          Email request: {deliveryLabel(result.emailStatus)}. Team notification:{" "}
          {deliveryLabel(result.teamStatus)}.
        </p>
        <button className="cc-button" onClick={() => download(saved)}>
          Download saved estimate PDF
        </button>
        <ConsultationCTA planner={saved.data.basics.audience === "planner"} />
        <div className="cc-actions">
          <button
            className="cc-button secondary"
            onClick={() => {
              session.current.invalidate();
              setResult(null);
            }}
          >
            Edit contact details
          </button>
          <button className="cc-link" onClick={onBack}>
            Back to estimate
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="cc-save">
      <h3>Where should we keep your copy?</h3>
      <p>Your on-screen estimate is free. Phone and marketing permission are optional.</p>
      {hostedSavingUnavailable && (
        <p role="status" className="cc-note">
          {hostedSavingMessage} Contact fields are shown for layout review only; use synthetic
          details.
        </p>
      )}
      {import.meta.env.DEV && (
        <p className="cc-note">
          Local review: use synthetic details only. Saving stores a local test record. No email will
          be sent.
        </p>
      )}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy) void send();
        }}
      >
        <fieldset disabled={busy}>
          <div className="cc-basics">
            <label>
              First name
              <input
                required
                autoComplete="given-name"
                maxLength={80}
                value={contact.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                autoComplete="email"
                maxLength={254}
                value={contact.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>
            <label>
              Mobile number <small>(optional)</small>
              <input
                type="tel"
                maxLength={40}
                value={contact.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </label>
            {basics.audience === "planner" && (
              <>
                <label>
                  Business name <small>(optional)</small>
                  <input
                    maxLength={160}
                    value={contact.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                  />
                </label>
                <label>
                  Instagram handle <small>(optional)</small>
                  <input
                    maxLength={100}
                    value={contact.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                  />
                </label>
                <label>
                  Is this for a current client event?
                  <select
                    value={contact.clientPurpose}
                    onChange={(e) => update("clientPurpose", e.target.value)}
                  >
                    <option value="current">Yes, a current client event</option>
                    <option value="exploring">Just exploring or building a proposal</option>
                  </select>
                </label>
              </>
            )}
          </div>
          <label className="cc-consent">
            <input
              type="checkbox"
              checked={contact.marketingConsent}
              onChange={(e) => update("marketingConsent", e.target.checked)}
            />
            <span>
              Email me planning tips and offers <small>(optional; enrollment inactive).</small>
            </span>
          </label>
          <p className="cc-fine">
            Requesting this estimate does not subscribe you to promotional email or SMS.
          </p>
          <p className="cc-note">
            A verified privacy policy is not available in this preview. Use synthetic details only;
            policy approval is required before live contact capture.
          </p>
          {error && (
            <p role="alert" className="cc-error">
              {error}
            </p>
          )}
          <button className="cc-button" disabled={hostedSavingUnavailable}>
            {hostedSavingUnavailable
              ? "Saving unavailable in this review"
              : busy
                ? "Saving…"
                : error
                  ? "Retry save"
                  : "Save my estimate"}
          </button>
          <button type="button" className="cc-link" onClick={onBack}>
            Back to estimate
          </button>
        </fieldset>
      </form>
    </div>
  );
}

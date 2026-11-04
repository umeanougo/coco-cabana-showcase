import { useState } from "react";
import type { Basics, Selection } from "@/lib/pricing-calculator/validation";
import { track } from "@/lib/pricing-calculator/analytics";
import { site } from "@/config/site";
export function EstimateEmailForm({
  basics,
  selections,
  reference,
  attribution,
}: {
  basics: Basics;
  selections: Selection[];
  reference: string;
  attribution: Record<string, string>;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <form
        className="email-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          const data = new FormData(e.currentTarget);
          setBusy(true);
          setStatus("");
          track("email_requested");
          try {
            const response = await fetch("/api/pricing-estimates", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference,
                basics,
                selections,
                attribution,
                contact: {
                  firstName: data.get("firstName"),
                  lastName: data.get("lastName"),
                  email: data.get("email"),
                  phone: data.get("phone"),
                  contactPermission: data.get("contactPermission") === "on",
                  marketingConsent: data.get("marketingConsent") === "on",
                },
              }),
            });
            const result = await response.json();
            if (!response.ok || result.emailStatus !== "accepted")
              throw new Error(
                result.message ||
                  "Email could not be sent. Your estimate is still here; print it or try again.",
              );
            setStatus(
              "Your estimate has been accepted for email delivery. Check your inbox shortly.",
            );
            track("email_succeeded");
          } catch (error) {
            setStatus(
              error instanceof Error ? error.message : "Email could not be sent. Please try again.",
            );
            track("email_failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <h3>Email your estimate</h3>
        <p>
          Keep a copy of your selections and starting range. Your details are used to deliver this
          estimate; marketing is optional.
        </p>
        <div className="calc-fields">
          {[
            ["firstName", "First name", "text"],
            ["lastName", "Last name", "text"],
            ["email", "Email address", "email"],
            ["phone", "Phone (optional)", "tel"],
          ].map(([name, label, type]) => (
            <label key={name}>
              {label}
              <input
                name={name}
                type={type}
                required={name !== "phone"}
                maxLength={name === "email" ? 254 : name === "phone" ? 40 : 80}
                autoComplete={
                  name === "firstName" ? "given-name" : name === "lastName" ? "family-name" : type
                }
              />
            </label>
          ))}
        </div>
        <label className="consent">
          <input type="checkbox" name="contactPermission" />
          Coco Cabana may contact me about this estimate.
        </label>
        <label className="consent">
          <input type="checkbox" name="marketingConsent" />
          Send me occasional inspiration and offers (optional).
        </label>
        <button className="calc-button" disabled={busy || !selections.length}>
          {busy ? "Sending…" : "Email My Estimate"}
        </button>
        <p role="status" className="submission-status">
          {status}
        </p>
      </form>
      <div className="consultation">
        <h3>Ready to turn your estimate into a real plan?</h3>
        <p>
          Bring your preferred date, venue details and inspiration. We’ll review your priorities,
          refine the scope and confirm pricing and availability.
        </p>
        {site.calendly && (
          <a
            className="calc-button"
            href={site.calendly}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("consultation_clicked")}
          >
            Book a Free Consultation
          </a>
        )}
        <a
          href={site.honeybook}
          target="_blank"
          rel="noreferrer"
          className="text-link"
          onClick={() => track("honeybook_clicked")}
        >
          Continue to Full Inquiry ↗
        </a>
        <p className="estimate-caption">
          Include your estimate reference in your inquiry. Your selections stay in this tab.
        </p>
      </div>
    </>
  );
}

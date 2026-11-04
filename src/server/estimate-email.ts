import { partialContext } from "../lib/pricing-calculator/presentation";
import type { Snapshot } from "./estimate-store";
import { range, money } from "../lib/pricing-calculator/calculate-estimate";
import { tierLabels, serviceName } from "../config/pricing-calculator";
export const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
export function estimateEmail(snapshot: Snapshot, scheduler = "", team = false) {
  const { data, estimate: e } = snapshot;
  const intro = team
    ? `New ${data.basics.audience} estimate from ${escape(data.contact.firstName)}`
    : data.basics.audience === "planner"
      ? "Your client’s event, taking shape"
      : "Your celebration, taking shape";
  const lines = e.rows
    .map(
      (r) =>
        `<tr><td style="padding:12px 0;border-bottom:1px solid #ddd">${escape(r.item.name)} · ${r.item.calculationType === "custom_quote" ? "Custom scope" : tierLabels[r.tier]}<br>${r.quantity} × ${r.item.calculationType.replaceAll("_", " ")}</td><td>${r.min === null || r.max === null ? "Additional — pricing to confirm" : range(r.min, r.max)}</td></tr>`,
    )
    .join("");
  return `<html><body style="background:#f5efe5;color:#49372c;font-family:Arial,sans-serif"><main style="max-width:640px;margin:auto;padding:32px"><p>COCO CABANA</p><h1>${intro}</h1><p>${escape(serviceName(data.basics.audience, data.basics.service))} · ${escape(data.basics.eventType)} · ${data.basics.guestCount} guests · ${e.tables} tables</p><p>${escape(data.basics.eventDate || "Date to be decided")} · ${escape(data.basics.location || "Venue to be decided")}</p>${e.reference ? "<p>REFERENCE PRICES — not approved production pricing</p>" : ""}<table width="100%">${lines}</table><p>Priced selections: ${range(e.minimumSubtotal, e.maximumSubtotal)}</p><p>${escape(e.feeLabel)}: ${range(e.minimumServiceFee, e.maximumServiceFee)}</p>${e.ownFeePercent ? `<p>Your planning fee (${e.ownFeePercent}%): ${range(e.minimumOwnFee, e.maximumOwnFee)}</p>` : ""}<h2>${e.pricedCount ? range(e.minimumTotal, e.maximumTotal) : "Pricing to confirm"}</h2><p><strong>${partialContext(e)}</strong></p><p>About ${money(e.minimumPerGuest)}–${money(e.maximumPerGuest)} per guest. ${e.customCount} unpriced selections additional.</p><p>${escape(snapshot.disclaimer)}</p><p>${escape(snapshot.exclusions)}</p>${team ? `<p>Contact: ${escape(data.contact.email)} · ${escape(data.contact.phone || "No phone provided")}</p><p>Business: ${escape(data.contact.businessName)} · Instagram: ${escape(data.contact.instagram)} · ${escape(data.contact.clientPurpose)}</p><p>Marketing permission: ${data.contact.marketingConsent ? "requested; enrollment inactive" : "not given"}. Below draft minimum: ${e.underReferenceMinimum ? "yes (minimum unapproved)" : "no"}.</p>` : scheduler ? `<p><a href="${escape(scheduler)}">Book your free consultation</a></p>` : "<p>Consultation scheduling is not connected yet. No appointment has been booked.</p>"}<p>Reference: ${escape(data.reference)} · Catalog: ${escape(snapshot.catalogVersion)}</p></main></body></html>`;
}

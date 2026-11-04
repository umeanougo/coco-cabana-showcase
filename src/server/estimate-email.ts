import { calculateEstimate, range } from "../lib/pricing-calculator/calculate-estimate";
import { disclaimer, exclusions, tierLabels, serviceFee } from "../config/pricing-calculator";
import { site } from "../config/site";
import type { Submission } from "../lib/pricing-calculator/validation";
const escape = (v: unknown) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
export function estimateEmail(data: Submission, origin: string, calendly: string) {
  const e = calculateEstimate(data.basics, data.selections);
  return `<html><body style="margin:0;background:#f5efe5;color:#49372c;font-family:Arial,sans-serif"><main style="max-width:640px;margin:auto;padding:40px 24px"><img src="${escape(origin)}/coco-cabana-logo.png" alt="Coco Cabana" width="80"><h1 style="font-family:Georgia,serif">Your celebration, taking shape</h1><p>Hello ${escape(data.contact.firstName)},</p><p>Your preliminary planning range is ready.</p><h2>${e.pricedCount ? range(e.minimumTotal, e.maximumTotal) : "Consultation required"}</h2><p>USD · priced selections only. Only chair pricing is available. This is not a complete event budget.</p><p>${escape(data.basics.eventType)} · ${data.basics.guestCount} guests · ${e.tables} tables</p><p>${escape(data.basics.eventDate || "Date to be decided")} · ${escape(data.basics.location)}</p><table style="width:100%;border-collapse:collapse">${e.rows.map((r) => `<tr><td style="padding:12px 0;border-bottom:1px solid #ccc">${escape(r.item.name)} · ${tierLabels[r.tier]}<br>${r.custom ? "Consultation required" : `${r.quantity} × ${escape(r.item.calculationType)}`}</td><td>${r.custom ? "Additional" : range(r.min, r.max)}</td></tr>`).join("")}</table><p>Selected event elements: ${range(e.minimumSubtotal, e.maximumSubtotal)}</p><p>Estimated service fee (${serviceFee.rate * 100}%): ${serviceFee.eligibilityConfirmed ? range(e.minimumServiceFee, e.maximumServiceFee) : "To be confirmed; not included"}</p><p>Priced total: ${e.pricedCount ? range(e.minimumTotal, e.maximumTotal) : "Consultation required"}</p><p>Tables: ${data.basics.tableCount ? "provided by you" : "assumed eight guests per table, rounded up"}.</p><p>${escape(exclusions)}</p><p>${escape(disclaimer)}</p>${calendly ? `<p><a href="${escape(calendly)}">Book a Free Consultation</a></p>` : ""}<p><a href="${site.honeybook}">Continue to Full Inquiry</a></p><p>Reference: ${escape(data.reference)}</p><p>${site.email} · <a href="${site.instagram}">@cococabana.htx</a></p></main></body></html>`;
}

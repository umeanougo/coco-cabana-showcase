import { partialContext } from "./presentation";
import type { Snapshot } from "../../server/estimate-store";
import { range } from "./calculate-estimate";
import { tierLabels, serviceName } from "../../config/pricing-calculator";
// Small text-only PDF attachment: the same immutable snapshot and display formatter as email/UI.
export function estimatePdf(snapshot: Snapshot) {
  const { data, estimate: e } = snapshot;
  const text = [
    "COCO CABANA - Event estimate",
    snapshot.preview ? "LOCAL REVIEW COPY - REFERENCE PRICING" : "Planning estimate - not a quote",
    `${serviceName(data.basics.audience, data.basics.service)} / ${data.basics.eventType}`,
    `${data.basics.guestCount} guests / ${e.tables} tables of 8`,
    ...e.rows.map(
      (r) =>
        `${r.item.name} / ${r.item.calculationType === "custom_quote" ? "Custom scope" : tierLabels[r.tier]} / ${r.quantity} x ${r.item.calculationType.replaceAll("_", " ")}: ${r.min === null || r.max === null ? "Additional - pricing to confirm" : range(r.min, r.max)}`,
    ),
    `Priced selections: ${range(e.minimumSubtotal, e.maximumSubtotal)}`,
    `${e.feeLabel}: ${range(e.minimumServiceFee, e.maximumServiceFee)}`,
    ...(e.ownFeePercent
      ? [`Your planning fee (${e.ownFeePercent}%): ${range(e.minimumOwnFee, e.maximumOwnFee)}`]
      : []),
    `${e.customCount ? "Priced items only" : "Total"}: ${e.pricedCount ? range(e.minimumTotal, e.maximumTotal) : "Pricing to confirm"}`,
    partialContext(e),
    `Per guest${e.customCount ? " (priced items only)" : ""}: ${e.pricedCount ? range(e.minimumPerGuest, e.maximumPerGuest) : "Pricing to confirm"}`,
    snapshot.disclaimer,
    snapshot.exclusions,
    `Reference: ${data.reference}`,
    `Catalog: ${snapshot.catalogVersion}`,
  ];
  const ascii = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[–—]/g, "-")
      .replace(/[’‘]/g, "'")
      .replace(/[^\x20-\x7e]/g, "");
  const lines = text.flatMap((t) => ascii(t).match(/.{1,90}(?:\s|$)|.{1,90}/g) || []);
  const pages = [];
  for (let i = 0; i < lines.length; i += 46) pages.push(lines.slice(i, i + 46));
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const kids = [];
  for (const page of pages) {
    const id = objects.length + 1;
    kids.push(`${id} 0 R`);
    const stream = `BT /F1 10 Tf 45 790 Td 15 TL ${page.map((l, i) => `${i ? "T* " : ""}(${l.replace(/[\\()]/g, "\\$&")}) Tj`).join("\n")} ET`;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${id + 1} 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    );
  }
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf +=
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets
      .slice(1)
      .map((n) => `${String(n).padStart(10, "0")} 00000 n \n`)
      .join("") +
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return btoa(pdf);
}

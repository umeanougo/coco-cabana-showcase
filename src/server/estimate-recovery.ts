import { reviewEnvironment } from "../config/review-environment";
import type { EstimateDB, Snapshot } from "./estimate-store";
import type { EstimateEnvironment } from "./pricing-estimates";
import { verifiedScheduler } from "../config/consultation";
import { estimateEmail } from "./estimate-email";
import { estimatePdf } from "./estimate-pdf";
type Options = { now?: () => number; transport?: typeof fetch };
// Invoked by an authorized worker/job, never by a public recovery endpoint.
export async function recoverEstimate(
  db: EstimateDB,
  reference: string,
  env: EstimateEnvironment,
  options: Options = {},
) {
  const row = await db
    .prepare("SELECT snapshot FROM calculator_estimates_v2 WHERE reference=?")
    .bind(reference)
    .first<{ snapshot: string }>();
  if (!row) throw new Error("Missing snapshot");
  const snapshot = JSON.parse(row.snapshot) as Snapshot,
    now = (options.now ?? Date.now)();
  const send = async (channel: "visitor" | "team") => {
    const id = `${reference}-${channel}`;
    let job = await db
      .prepare("SELECT status,created_at,envelope FROM calculator_outbox_v2 WHERE id=?")
      .bind(id)
      .first<{ status: string; created_at: number; envelope: string }>();
    if (!job) return "missing_intent"; // Legacy snapshots need an explicit backfill, not silent sends.
    if (job.status === "accepted" || job.status === "needs_review") return job.status;
    // A mocked transport may exercise delivery contracts; the review build cannot call a live provider.
    const hold =
      snapshot.preview || (reviewEnvironment.enabled && !options.transport)
        ? "held_preview"
        : snapshot.estimate.reference || snapshot.estimate.customCount
          ? "held_pricing"
          : env.ESTIMATE_DELIVERY_ENABLED !== "true" ||
              !env.RESEND_API_KEY ||
              !env.ESTIMATE_FROM_EMAIL ||
              !env.ESTIMATE_TEAM_EMAIL
            ? "held_config"
            : null;
    if (hold) {
      await db
        .prepare("UPDATE calculator_outbox_v2 SET status=? WHERE id=? AND status!='accepted'")
        .bind(hold, id)
        .run();
      return hold;
    }
    if (!job.envelope) {
      const scheduler = verifiedScheduler(
        env.HONEYBOOK_SCHEDULER_URL,
        env.HONEYBOOK_SCHEDULER_VERIFIED === "true",
      );
      const envelope = JSON.stringify({
        from: env.ESTIMATE_FROM_EMAIL,
        to: [channel === "visitor" ? snapshot.data.contact.email : env.ESTIMATE_TEAM_EMAIL],
        subject:
          channel === "visitor"
            ? "Your Coco Cabana event estimate"
            : `New ${snapshot.data.basics.audience} estimate`,
        html: estimateEmail(snapshot, scheduler, channel === "team"),
        attachments: [{ filename: "coco-cabana-estimate.pdf", content: estimatePdf(snapshot) }],
      });
      await db
        .prepare(
          "UPDATE calculator_outbox_v2 SET envelope=?,created_at=?,status='pending' WHERE id=? AND envelope='' AND status!='accepted'",
        )
        .bind(envelope, now, id)
        .run();
      job = await db
        .prepare("SELECT status,created_at,envelope FROM calculator_outbox_v2 WHERE id=?")
        .bind(id)
        .first<typeof job>();
    }
    if (!job || now - job.created_at >= 23 * 3600000) {
      await db
        .prepare(
          "UPDATE calculator_outbox_v2 SET status='needs_review' WHERE id=? AND status!='accepted'",
        )
        .bind(id)
        .run();
      return "needs_review";
    }
    const claimed = await db
      .prepare(
        "UPDATE calculator_outbox_v2 SET lease_until=?,status='queued' WHERE id=? AND status NOT IN ('accepted','needs_review') AND lease_until<=? RETURNING envelope",
      )
      .bind(now + 30000, id, now)
      .first<{ envelope: string }>();
    if (!claimed) return "queued";
    try {
      const response = await (options.transport ?? fetch)("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `coco-v2-${id}`,
        },
        body: claimed.envelope,
        signal: AbortSignal.timeout(12000),
      });
      const result = (await response.json()) as { id?: string };
      if (!response.ok || !result.id) throw new Error("Provider rejected");
      await db
        .prepare(
          "UPDATE calculator_outbox_v2 SET status='accepted',provider_id=?,lease_until=0 WHERE id=?",
        )
        .bind(result.id, id)
        .run();
      return "accepted";
    } catch {
      await db
        .prepare(
          "UPDATE calculator_outbox_v2 SET status='failed',lease_until=0 WHERE id=? AND status!='accepted'",
        )
        .bind(id)
        .run();
      return "failed";
    }
  };
  return { emailStatus: await send("visitor"), teamStatus: await send("team") };
}
export async function recoverPendingEstimates(
  db: EstimateDB,
  env: EstimateEnvironment,
  options: Options = {},
) {
  const pending = await db
    .prepare(
      "SELECT DISTINCT reference FROM calculator_outbox_v2 WHERE status IN ('pending','queued','failed','held_config') ORDER BY created_at LIMIT 50",
    )
    .all<{ reference: string }>();
  const results = [];
  for (const row of pending.results)
    results.push({
      reference: row.reference,
      ...(await recoverEstimate(db, row.reference, env, options)),
    });
  return results;
}

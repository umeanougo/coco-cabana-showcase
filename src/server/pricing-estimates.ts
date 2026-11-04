import { submissionSchema } from "../lib/pricing-calculator/validation";
import { calculateEstimate } from "../lib/pricing-calculator/calculate-estimate";
import { disclaimer, exclusions, assumptions } from "../config/pricing-calculator";
import { estimateEmail } from "./estimate-email";
interface Statement {
  bind(...values: unknown[]): Statement;
  run(): Promise<unknown>;
  first<T>(): Promise<T | null>;
}
export interface EstimateEnvironment {
  ESTIMATES_DB?: { prepare(sql: string): Statement };
  RESEND_API_KEY?: string;
  ESTIMATE_FROM_EMAIL?: string;
  SITE_ORIGIN?: string;
  COCO_CABANA_CALENDLY_URL?: string;
  EASEOPS_ESTIMATE_WEBHOOK_URL?: string;
  EASEOPS_ESTIMATE_WEBHOOK_SECRET?: string;
}
const reply = (status: number, message: string, extra: Record<string, unknown> = {}) =>
  Response.json({ message, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
const digest = async (text: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
export async function handleEstimate(
  request: Request,
  env: EstimateEnvironment,
): Promise<Response> {
  if (!env.SITE_ORIGIN)
    return reply(
      503,
      "Email delivery is not configured yet. Print your estimate or continue to our inquiry form.",
    );
  if (request.headers.get("origin") !== env.SITE_ORIGIN)
    return reply(403, "This request must come from the Coco Cabana website.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply(415, "Use a JSON submission.");
  // Read a bounded stream, including requests without a Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "Missing estimate.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 32768) {
      await reader.cancel();
      return reply(413, "Estimate is too large.");
    }
    chunks.push(value);
  }
  let parsed;
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    parsed = submissionSchema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return reply(400, "Invalid estimate.");
  }
  if (!parsed.success) return reply(400, "Check your event and contact details, then try again.");
  const data = parsed.data,
    db = env.ESTIMATES_DB;
  if (!db)
    return reply(
      503,
      "Email delivery is not configured yet. Your estimate remains in this tab; print it or continue to our inquiry form.",
    );
  try {
    const now = Date.now(),
      bucket = Math.floor(now / 3600000),
      ip = request.headers.get("cf-connecting-ip") || "local";
    const rateKey = await digest(`${ip}:${bucket}`);
    await db
      .prepare(
        "INSERT INTO estimate_rate_limits (key, count, expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      )
      .bind(rateKey, now + 7200000)
      .run();
    const rate = await db
      .prepare("SELECT count FROM estimate_rate_limits WHERE key=?")
      .bind(rateKey)
      .first<{ count: number }>();
    if ((rate?.count || 0) > 10)
      return reply(429, "Too many attempts. Please try again in an hour or use the inquiry form.");
    await db.prepare("DELETE FROM estimate_rate_limits WHERE expires_at < ?").bind(now).run();
    const hash = await digest(JSON.stringify(data));
    const estimate = calculateEstimate(data.basics, data.selections);
    const record = {
      ...data,
      estimate,
      assumptions,
      disclaimer,
      exclusions,
      source: "/pricing-calculator",
      submittedAt: new Date(now).toISOString(),
    };
    await db
      .prepare(
        "INSERT OR IGNORE INTO pricing_estimates (public_reference,payload_hash,payload,email_delivery_status,created_at,updated_at) VALUES (?,?,?,'pending',?,?)",
      )
      .bind(data.reference, hash, JSON.stringify(record), now, now)
      .run();
    const saved = await db
      .prepare(
        "SELECT payload_hash,email_delivery_status,created_at FROM pricing_estimates WHERE public_reference=?",
      )
      .bind(data.reference)
      .first<{ payload_hash: string; email_delivery_status: string; created_at: number }>();
    if (!saved || saved.payload_hash !== hash)
      return reply(
        409,
        "This reference already belongs to different details. Edit a selection to create a new reference, then submit again.",
      );
    if (saved.email_delivery_status === "accepted")
      return reply(200, "Email accepted.", { reference: data.reference, emailStatus: "accepted" });
    if (now - saved.created_at > 3600000)
      return reply(
        409,
        "This email request has expired. Edit a selection to create a new reference before retrying.",
      );
    if (!env.RESEND_API_KEY || !env.ESTIMATE_FROM_EMAIL)
      return reply(
        503,
        "Your estimate was saved, but email delivery is not configured. You can print it or continue to our inquiry form.",
        { reference: data.reference, emailStatus: "unconfigured" },
      );
    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `estimate-${data.reference}`,
        },
        body: JSON.stringify({
          from: env.ESTIMATE_FROM_EMAIL,
          to: [data.contact.email],
          subject: "Your Coco Cabana event estimate",
          html: estimateEmail(data, env.SITE_ORIGIN, env.COCO_CABANA_CALENDLY_URL || ""),
        }),
        signal: AbortSignal.timeout(12000),
      });
    } catch {
      return reply(
        502,
        "Delivery could not be confirmed. Your estimate is saved; retry safely or print a copy.",
      );
    }
    const result = (await response.json()) as { id?: string };
    if (!response.ok || !result.id) {
      await db
        .prepare(
          "UPDATE pricing_estimates SET email_delivery_status='failed',updated_at=? WHERE public_reference=?",
        )
        .bind(now, data.reference)
        .run();
      return reply(502, "Email delivery failed. Your estimate is saved; retry or print a copy.");
    }
    await db
      .prepare(
        "UPDATE pricing_estimates SET email_delivery_status='accepted',updated_at=? WHERE public_reference=?",
      )
      .bind(now, data.reference)
      .run();
    // Optional integration is isolated: it cannot invalidate accepted delivery.
    if (env.EASEOPS_ESTIMATE_WEBHOOK_URL && env.EASEOPS_ESTIMATE_WEBHOOK_SECRET) {
      try {
        const body = JSON.stringify(record),
          timestamp = String(now);
        const key = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(env.EASEOPS_ESTIMATE_WEBHOOK_SECRET),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"],
        );
        const signature = Array.from(
          new Uint8Array(
            await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`)),
          ),
        )
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        const webhook = await fetch(env.EASEOPS_ESTIMATE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Coco-Timestamp": timestamp,
            "X-Coco-Signature": signature,
            "Idempotency-Key": data.reference,
          },
          body,
          signal: AbortSignal.timeout(4000),
        });
        await db
          .prepare("UPDATE pricing_estimates SET webhook_status=? WHERE public_reference=?")
          .bind(webhook.ok ? "delivered" : "failed", data.reference)
          .run();
      } catch {
        await db
          .prepare("UPDATE pricing_estimates SET webhook_status='failed' WHERE public_reference=?")
          .bind(data.reference)
          .run()
          .catch(() => {});
      }
    }
    return reply(200, "Email accepted.", { reference: data.reference, emailStatus: "accepted" });
  } catch {
    return reply(
      503,
      "We could not finish saving or sending this estimate. Your selections are still here. Please retry or print a copy.",
    );
  }
}

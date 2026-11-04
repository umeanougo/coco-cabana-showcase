import { reviewEnvironment, hostedSavingMessage } from "../config/review-environment";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/pricing-estimates")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleEstimate } = await import("../server/pricing-estimates");
        if (import.meta.env.DEV) {
          const { localEstimateDB } = await import("../server/local-estimate-store");
          return handleEstimate(
            request,
            { SITE_ORIGIN: new URL(request.url).origin, ESTIMATES_DB: localEstimateDB() },
            { preview: true },
          );
        }
        if (reviewEnvironment.enabled) {
          if (request.headers.get("origin") !== reviewEnvironment.origin)
            return Response.json(
              { message: "This request must come from the designated review website." },
              { status: 403 },
            );
          // No isolated hosted store is enabled. Never use production storage or provider credentials.
          return Response.json(
            { state: "saving_unavailable", message: hostedSavingMessage },
            {
              status: 503,
              headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
            },
          );
        }
        let env = {};
        try {
          env = (await import("cloudflare:workers")).env;
        } catch {
          /* Fail closed without a storage binding. */
        }
        return handleEstimate(request, env);
      },
    },
  },
});

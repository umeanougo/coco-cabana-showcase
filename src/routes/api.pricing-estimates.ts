import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/pricing-estimates")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleEstimate } = await import("../server/pricing-estimates");
        let env = {};
        try {
          const worker = await import("cloudflare:workers");
          env = worker.env;
        } catch {
          /* Local previews deliberately remain unconfigured. */
        }
        return handleEstimate(request, env);
      },
    },
  },
});

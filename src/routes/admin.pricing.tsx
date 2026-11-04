import { createFileRoute } from "@tanstack/react-router";
import { PricingManager } from "@/components/pricing-manager/PricingManager";
export const Route = createFileRoute("/admin/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Manager | Coco Cabana" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PricingManager,
});

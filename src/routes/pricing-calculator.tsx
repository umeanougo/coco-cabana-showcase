import { createFileRoute } from "@tanstack/react-router";
import { CalculatorShell } from "@/components/pricing-calculator/CalculatorShell";
import { site } from "@/config/site";
const title = "Event & Wedding Decor Pricing Calculator – Houston | Coco Cabana";
const description =
  "Build a preliminary estimate for your wedding, birthday, corporate event, baby shower, or celebration based on guest count, selected services, and preferred level of service.";
export const Route = createFileRoute("/pricing-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      {
        rel: "canonical",
        href: site.origin ? `${site.origin.replace(/\/$/, "")}/pricing` : "/pricing",
      },
    ],
  }),
  component: CalculatorShell,
});

import { createFileRoute } from "@tanstack/react-router";
import { CalculatorShell } from "@/components/pricing-calculator/CalculatorShell";
export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Event & Wedding Decor Pricing Calculator – Houston | Coco Cabana" },
      {
        name: "description",
        content:
          "Explore a starting budget for selected wedding or event elements in Houston. Planning, Design and À la carte décor, with fees shown separately.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://cococabana.us/pricing" }],
  }),
  component: CalculatorShell,
});

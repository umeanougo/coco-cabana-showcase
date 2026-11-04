import { createFileRoute } from "@tanstack/react-router";
import { CalculatorShell } from "@/components/pricing-calculator/CalculatorShell";
export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Event & Wedding Decor Pricing Calculator – Houston | Coco Cabana" },
      {
        name: "description",
        content:
          "See what your Houston wedding or event really costs. Build a free estimate for planning, design and decor. Every number, upfront.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://cococabana.us/pricing" }],
  }),
  component: CalculatorShell,
});

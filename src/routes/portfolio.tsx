import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import heroImg from "@/assets/hero-event.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Coco Cabana | Event Design Gallery" },
      {
        name: "description",
        content:
          "Explore a curated gallery of weddings, milestones and luxury events designed by Coco Cabana.",
      },
      { property: "og:title", content: "Portfolio — Coco Cabana" },
      {
        property: "og:description",
        content: "A gallery of weddings, milestones and luxury events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

// Asset-to-event associations are not verified. Do not attach client names or budgets.
const projects = [p1, p2, p3, p4, p5, p6, heroImg].map((src, i) => ({
  src,
  title: `Gallery image ${i + 1}`,
}));

function PortfolioPage() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="relative container mx-auto px-6 text-center">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Selected Works</p>
          <h1 className="font-display text-5xl md:text-7xl">
            Our <span className="italic text-brand-gradient">Portfolio</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
            Explore the existing image collection and open a detail to look closer. Bring the image
            number to your inquiry so we can discuss the look you have in mind. Images do not define
            a tier package or an investment range.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <Link to="/services" className="text-brand underline">
              Compare our services
            </Link>
            <Link to="/pricing" className="text-brand underline">
              Explore a starting budget
            </Link>
            <Link to="/contact" className="text-brand underline">
              Start an inquiry
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Open ${p.title}`}
                key={p.title}
                className="group relative overflow-hidden aspect-[4/5] animate-fade-up"
              >
                <img
                  src={p.src}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-4 bottom-4 bg-background p-5 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="block text-xs text-brand mb-1">View detail →</span>
                  <span className="block font-display text-2xl">{p.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto">
          <DialogTitle>{selected !== null ? projects[selected].title : "Gallery"}</DialogTitle>
          <DialogDescription>
            Inspiration to discuss with our team, not a priced package. Image numbers are not
            automatically sent with your inquiry.
          </DialogDescription>
          {selected !== null && (
            <img
              src={projects[selected].src}
              alt={projects[selected].title}
              className="w-full max-h-[60dvh] object-contain"
            />
          )}
          <Link to="/contact" className="text-brand underline">
            Discuss your event →
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}

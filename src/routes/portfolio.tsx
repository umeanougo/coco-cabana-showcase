import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { gallery as projects } from "@/config/gallery";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
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

function PortfolioPage() {
  const fallback = useRef<HTMLHeadingElement>(null);
  const dialogFocus = useDialogFocus(fallback);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="relative container mx-auto px-6 text-center">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Selected Works</p>
          <h1 ref={fallback} tabIndex={-1} className="font-display text-5xl md:text-7xl">
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
                id={p.id}
                onClick={(event) => {
                  dialogFocus.rememberOpener(event.currentTarget);
                  setSelected(i);
                }}
                aria-label={`Open ${p.label}`}
                key={p.label}
                className="group relative scroll-mt-28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand overflow-hidden aspect-[4/5] animate-fade-up"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-4 bottom-4 bg-background p-5 transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="block text-xs text-brand mb-1">View detail →</span>
                  <span className="block font-display text-2xl">{p.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className="max-w-3xl max-h-[90dvh] overflow-y-auto"
          {...dialogFocus.contentProps}
        >
          <DialogTitle {...dialogFocus.titleProps}>
            {selected !== null ? projects[selected].label : "Gallery"}
          </DialogTitle>
          <DialogDescription>
            Inspiration to discuss with our team, not a priced package. Image numbers are not
            automatically sent with your inquiry.
          </DialogDescription>
          {selected !== null && (
            <img
              src={projects[selected].src}
              alt={projects[selected].alt}
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

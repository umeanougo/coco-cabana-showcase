import { createFileRoute } from "@tanstack/react-router";
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
      { name: "description", content: "Explore a curated gallery of weddings, milestones and luxury events designed by Coco Cabana." },
      { property: "og:title", content: "Portfolio — Coco Cabana" },
      { property: "og:description", content: "A gallery of weddings, milestones and luxury events." },
      { property: "og:image", content: p1 },
    ],
  }),
  component: PortfolioPage,
});

const projects = [
  { src: p1, title: "Garden Ceremony", category: "Wedding" },
  { src: p2, title: "Black & Gold Soirée", category: "Birthday" },
  { src: p3, title: "Crystal Gala", category: "Corporate" },
  { src: p4, title: "Blush Bridal Brunch", category: "Bridal Shower" },
  { src: p5, title: "Soft Pastels", category: "Baby Shower" },
  { src: p6, title: "Twilight Lounge", category: "Engagement" },
  { src: heroImg, title: "Candlelit Reception", category: "Wedding" },
  { src: p1, title: "Floral Arch Series", category: "Decor" },
];

function PortfolioPage() {
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-onyx" />
        <div className="relative container mx-auto px-6 text-center">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Selected Works</p>
          <h1 className="font-display text-5xl md:text-7xl">
            Our <span className="italic text-gold-gradient">Portfolio</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
            A curated look at celebrations we've had the joy of designing.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <figure key={i} className="group relative overflow-hidden aspect-[4/5]">
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90 flex flex-col justify-end p-6">
                <p className="text-[10px] tracking-luxe uppercase text-gold mb-1">{p.category}</p>
                <p className="font-display text-2xl">{p.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="aspect-video bg-card/40 border border-gold-soft flex items-center justify-center">
          {/*
            Highlight reel placeholder. Replace this <video> with your own .mp4 / .webm
            (place in /public) or an <iframe> embed (Vimeo / YouTube).
            Example:
              <iframe src="https://player.vimeo.com/video/XXXX" className="w-full h-full" allow="autoplay; fullscreen" />
          */}
          <div className="text-center px-6">
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-4">Highlight Reel</p>
            <p className="font-display text-2xl mb-2">Video coming soon</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Drop a video file into this placeholder to feature your latest event reel.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

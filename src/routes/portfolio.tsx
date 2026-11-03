import { createFileRoute } from "@tanstack/react-router";
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
      { name: "description", content: "Explore a curated gallery of weddings, milestones and luxury events designed by Coco Cabana." },
      { property: "og:title", content: "Portfolio — Coco Cabana" },
      { property: "og:description", content: "A gallery of weddings, milestones and luxury events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

const projects = [
  { src: p1, title: "Mara Villa Katy", category: "Wedding" },
  { src: p2, title: "Emeka's Lavish 30th", category: "Birthday" },
  { src: p3, title: "Hotel Laura Gala", category: "Corporate" },
  { src: p4, title: "Adrianne Michelle Bridal", category: "Bridal Shower" },
  { src: p5, title: "Soft Pastels Baby Shower", category: "Baby Shower" },
  { src: p6, title: "Rossy's Birthday Bash", category: "Birthday" },
  { src: heroImg, title: "Moyi & Josh", category: "Wedding" },
  { src: p1, title: "Flower Wall Series", category: "Rentals" },
];

const tints = ["bg-tint-blue", "bg-tint-blush", "bg-tint-sage", "bg-tint-tan"];

function PortfolioPage() {
  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? projects : projects.filter((p) => p.category === cat);
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
            Our gallery highlights some of our memorable moments, encapsulating our journey through a multitude of events, each unique in its purpose, scale, and impact, yet all sharing the common thread of our unwavering commitment to excellence.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface"><div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {cats.map((c, i) => (
            <button key={c} onClick={() => setCat(c)} className={`px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition ${cat === c ? "bg-brand text-primary-foreground" : `${tints[i % 4]} text-brand hover:opacity-80`}`}>{c}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p) => (
            <figure key={p.title} className="group relative overflow-hidden aspect-[4/5] animate-fade-up">
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-4 bottom-4 bg-background p-5 transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-[10px] tracking-luxe uppercase text-brand mb-1">{p.category}</p>
                <p className="font-display text-2xl">{p.title}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div></section>

      <section className="py-20 container mx-auto px-6">
        <div className="aspect-video bg-tint-blue flex items-center justify-center">
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

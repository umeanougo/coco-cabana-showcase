import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Coco Cabana | Our Story" },
      { name: "description", content: "Meet the team behind Coco Cabana — passionate event designers crafting unforgettable celebrations." },
      { property: "og:title", content: "About — Coco Cabana" },
      { property: "og:description", content: "Meet the team behind Coco Cabana." },
      { property: "og:image", content: aboutImg },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-12 container mx-auto px-6 text-center">
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Our Story</p>
        <h1 className="font-display text-5xl md:text-7xl">
          Born from a love of <span className="italic text-gold-gradient">celebration</span>
        </h1>
      </section>

      <section className="py-16 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={aboutImg}
              alt="Coco Cabana founder at work"
              width={1280}
              height={1600}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover shadow-luxe"
            />
            <div className="absolute -bottom-6 -right-6 hidden md:block w-40 h-40 border border-gold-soft" />
          </div>
          <div>
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">The Studio</p>
            <h2 className="font-display text-4xl mb-6">
              Designed for the <span className="italic text-gold">moments that matter</span>
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Coco Cabana was founded on the belief that every gathering deserves
                to feel like a love letter — intentional, beautiful and entirely
                yours. We blend timeless design with modern artistry to create
                events that feel as good as they look.
              </p>
              <p>
                From intimate showers to grand celebrations, we partner closely
                with each client — listening, curating and refining until every
                detail tells your story.
              </p>
              <p>
                Our growing rental collection means we can bring even the most
                ambitious vision to life with seamless execution.
              </p>
            </div>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-gold border-b border-gold pb-1">
              Work With Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-y border-gold-soft">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="What we believe" title="Our Values" />
          <div className="mt-16 grid md:grid-cols-3 gap-10">
            {[
              { t: "Intentional Design", d: "Every detail chosen with purpose. Nothing accidental, nothing overlooked." },
              { t: "Effortless Hospitality", d: "Your guests should feel cared for. You should feel free to be present." },
              { t: "Lasting Beauty", d: "Timeless over trendy. We design for memory, not just the moment." },
            ].map((v) => (
              <div key={v.t} className="text-center md:text-left">
                <p className="font-display text-3xl text-gold mb-3">— {v.t}</p>
                <p className="text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6 text-center">
        <SectionHeading
          title="Let's plan something extraordinary"
          subtitle="We'd love to hear about your event and bring your vision to life."
        />
        <Link to="/contact" className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-gold text-primary-foreground shadow-gold">
          Get In Touch <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}

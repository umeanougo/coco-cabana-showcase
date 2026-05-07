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
          Your vision, <span className="italic text-gold-gradient">our expertise</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
          Houston's one-stop shop for all things events: planning, decor and
          rentals, executed with creativity, passion and care.
        </p>
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
              Welcome to <span className="italic text-gold">Coco Cabana</span>
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                At Coco Cabana, we take the stress out of event planning and turn
                your visions into reality. Whether you're dreaming of a
                breathtaking wedding, a corporate gathering that wows, or a
                memorable birthday celebration, we're your one-stop shop for all
                things events.
              </p>
              <p>
                Our dedicated team of experienced planners and decorators ensures
                every detail is meticulously executed, leaving you free to enjoy
                your special day to the fullest. From concept to creation, we
                handle it all with creativity, passion and a commitment to
                exceeding your expectations.
              </p>
              <p>
                Beyond planning and decor, our growing rental collection,
                including statement flower walls, luxury candle staging and our
                signature 360 photo booth, brings even the most ambitious
                visions to life.
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
              { t: "Meticulous Detail", d: "Every element executed with precision so your day radiates beauty and charm." },
              { t: "Effortless Hospitality", d: "We carry the logistics so you can be fully present with your guests." },
              { t: "Creative Vision", d: "From color palette to florals to floor plan, we bring your story to life." },
            ].map((v) => (
              <div key={v.t} className="text-center md:text-left">
                <p className="font-display text-3xl text-gold mb-3">{v.t}</p>
                <p className="text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

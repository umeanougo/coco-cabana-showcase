import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Flower2, Crown, Calendar, Palette, Users, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import heroImg from "@/assets/hero-event.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Coco Cabana | Event Planning, Decor & Rentals" },
      { name: "description", content: "Full-service event planning, custom decor design, and luxury event rentals for weddings, milestones and corporate gatherings." },
      { property: "og:title", content: "Services — Coco Cabana" },
      { property: "og:description", content: "Event planning, decor & rentals." },
    ],
  }),
  component: ServicesPage,
});

const offerings = [
  {
    icon: Sparkles,
    title: "Event Planning",
    desc: "From concept to closing toast, we handle every logistical detail with creativity and care.",
    items: ["Full-service planning", "Partial planning", "Day-of coordination", "Vendor curation"],
  },
  {
    icon: Flower2,
    title: "Wedding Decor",
    desc: "Theming, florals, candle staging and spatial planning that reflect your unique love story.",
    items: ["Fresh floral design", "Luxury candle staging", "Tablescapes & linens", "Backdrops & arches"],
  },
  {
    icon: Crown,
    title: "Rentals",
    desc: "Statement flower walls and our signature 360 photo booth, beautifully maintained.",
    items: ["Flower walls", "360 photo booth", "Neon sign add-ons", "Specialty pieces"],
  },
  {
    icon: Calendar,
    title: "Weddings",
    desc: "Intimate ceremonies to grand celebrations, designed entirely around you.",
    items: ["Ceremony design", "Reception styling", "Eru Iyawo presentation", "Welcome events"],
  },
  {
    icon: Users,
    title: "Milestones & Socials",
    desc: "Birthdays, baby and bridal showers, anniversaries, every chapter beautifully marked.",
    items: ["Birthday bashes", "Baby showers", "Bridal showers", "Anniversary parties"],
  },
  {
    icon: Palette,
    title: "Corporate & Charity",
    desc: "Polished gatherings that align with your brand, mission and audience.",
    items: ["Galas & fundraisers", "Corporate events", "Non-profit events", "Brand activations"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        
        <div className="relative mx-auto max-w-3xl bg-background/95 border border-gold-soft px-8 py-12 text-center">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">What we do</p>
          <h1 className="font-display text-5xl md:text-7xl">Our <span className="italic text-brand-gradient">Services</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
            A full suite of bespoke services — thoughtfully tailored to your vision, story and style.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((o) => (
            <div
              key={o.title}
              className="group p-10 border border-gold-soft hover:border-brand bg-card/40 hover:shadow-gold transition-all"
            >
              <o.icon className="text-brand mb-6" size={36} strokeWidth={1.2} />
              <h3 className="font-display text-2xl mb-3">{o.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{o.desc}</p>
              <ul className="space-y-2">
                {o.items.map((it) => (
                  <li key={it} className="text-sm flex items-start gap-2">
                    <span className="text-brand mt-1">◆</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <SectionHeading eyebrow="What to Expect" title="Our planning process" />
        <p className="mt-6 max-w-2xl mx-auto text-center text-muted-foreground">
          We approach every event, intimate or grand, like it's ours. You'll work hand in hand with us from start to finish.
        </p>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Planning", time: "9–12+ months out", text: "We define your budget and secure key vendors, including your venue, matching you with the perfect team.", items: ["Determining budget", "Venue selection", "Vendor selection"] },
            { step: "02", title: "Design", time: "4–9 months out", text: "A custom design proposal mapping every detail, from color palettes and floor plans to tablescapes and linen swatches.", items: ["Design plan creation", "Mock-ups of design elements", "Selection of design details"] },
            { step: "03", title: "Execution", time: "3 months to event day", text: "We finalize every detail with you and your vendors, then our team runs the day so everything goes to plan.", items: ["Event day timeline", "Final vendor coordination", "Event day execution"] },
          ].map((s) => (
            <div key={s.step} className="p-10 border border-gold-soft bg-card/40">
              <p className="font-display text-4xl text-brand-gradient mb-4">{s.step}</p>
              <h3 className="font-display text-2xl mb-1">{s.title}</h3>
              <p className="text-[11px] tracking-luxe uppercase text-tan-dark mb-4">{s.time}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.text}</p>
              <ul className="space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="text-sm flex items-start gap-2"><span className="text-brand mt-1">◆</span><span>{it}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold">
            Start Your Inquiry <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}

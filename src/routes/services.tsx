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
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative container mx-auto px-6 text-center">
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
        <SectionHeading eyebrow="Our Process" title="From inspiration to celebration" />
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Discover", text: "We learn your story, vision and non-negotiables." },
            { step: "02", title: "Design", text: "Mood boards, layouts and curated proposals tailored to you." },
            { step: "03", title: "Refine", text: "Vendor coordination, walkthroughs and finishing touches." },
            { step: "04", title: "Celebrate", text: "We orchestrate the day so you can be fully present." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <p className="font-display text-5xl text-brand-gradient mb-4">{s.step}</p>
              <h4 className="font-display text-xl mb-2">{s.title}</h4>
              <p className="text-sm text-muted-foreground">{s.text}</p>
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

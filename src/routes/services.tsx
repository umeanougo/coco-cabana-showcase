import { CalculatorCTA } from "@/components/site/CalculatorCTA";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Sparkles,
  Crown,
  Flower2,
  ArrowRight,
  Plus,
  Camera,
  Lightbulb,
  Tv,
  Fence,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import heroImg from "@/assets/hero-event.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Coco Cabana Weddings, Events, Rentals & Candle Staging" },
      {
        name: "description",
        content:
          "Wedding planning and decor, corporate and private event services, flower wall and 360 photo booth rentals, luxury candle staging and à la carte services in Houston.",
      },
      { property: "og:title", content: "Services | Coco Cabana" },
      {
        property: "og:description",
        content: "What do we bring to your special day? Planning, decor, rentals and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const tints = ["bg-tint-blue", "bg-tint-blush", "bg-tint-sage", "bg-tint-tan"];

const core = [
  {
    icon: Heart,
    title: "Weddings",
    desc: "We specialize in crafting extraordinary wedding experiences that capture the essence of your love and reflect your distinct style. Our team of passionate wedding planners and talented decorators are dedicated to curating every detail with precision and care.",
  },
  {
    icon: Sparkles,
    title: "Events",
    desc: "We create magical moments that leave a lasting impression. With a keen eye for aesthetics and creativity, we bring your vision to life whether you're planning a corporate gathering, a milestone celebration, or a themed party.",
  },
  {
    icon: Crown,
    title: "Rentals",
    desc: "Creating the perfect event often requires the right equipment and decor. We provide high-quality, well-maintained flower walls and photo booths that meet your functional requirements and elevate the aesthetics and experience of your event.",
  },
  {
    icon: Flower2,
    title: "Luxury Candle Staging",
    desc: "Captivating candle setups that bathe any venue in a warm, romantic glow.",
    link: "https://luxurycandlestaging.com/",
  },
];

const weddingDetail = [
  {
    t: "Wedding Decor",
    d: "All of the design and decoration elements that turn a wedding venue into a beautiful and cohesive setting that reflects the couple's individual style and vision. From theming and conceptualizing to table settings and spatial planning, we provide the complete package, plus exquisite fresh floral displays and captivating candle setups.",
  },
  {
    t: "Wedding Planning",
    d: "A comprehensive service covering every aspect of planning and executing your dream wedding: venue selection, budget management, vendor hiring, guest logistics, and design considerations, all to create a magical and personalized experience for the couple and their loved ones.",
  },
  {
    t: "Event Decor",
    d: "We work closely with our clients to develop themes and bring them to life using the finest elements and best practices in event decoration. Your guests are definitely going to be mesmerized by the elegance of your event!",
  },
  {
    t: "Event Planning",
    d: "We design and coordinate every detail of special events, from inception to completion: developing a theme, implementing a budget, setting timelines, selecting and reserving event sites, and sourcing equipment and facilities. You can now focus on enjoying your special moment!",
  },
];

const walls = [
  "White Rose Wall",
  "Greenery & White Roses",
  "Pampas Wall",
  "Red Rose Wall",
  "Greenery & Blush Roses",
  "Pink Rose Wall",
];

const booth = [
  { icon: Tv, t: "Free TV Stand" },
  { icon: Lightbulb, t: "Photography Grade Lights" },
  { icon: Fence, t: "Gold Stanchions" },
  { icon: Camera, t: "Wireless Platform" },
];

const alaCarte = [
  {
    t: "Corporate Events",
    d: "A strategic approach to corporate event planning ensures the event aligns with the company's goals, reinforces its brand, and provides value to attendees. We assist in venue selection, theme and branding, as well as program development.",
  },
  {
    t: "Charity & Non-Profit Events",
    d: "Event planning for charitable and nonprofit organizations that takes into account your mission, goals and resources, built on effective communication, community engagement, and a compelling story that resonates with your supporters.",
  },
  {
    t: "Event Design",
    d: "A creative and strategic process for conceptualizing the aesthetic of your event. Ideal for self-planning clients who have selected vendors and need help developing a look and feel for the occasion.",
  },
  {
    t: "Wedding Coaching",
    d: "Personalized coaching sessions with our seasoned wedding experts, offering insights, tips and industry knowledge so couples can plan their own special day while minimizing stress and maximizing enjoyment.",
  },
  {
    t: "Eru Iyawo",
    d: "The presentation of the Engagement list or Bride's List, known as Eru Iyawo in Yoruba culture, is a crucial part of Yoruba traditional weddings. Let us transform your gift display into something extraordinary.",
  },
  {
    t: "Honeymoon Planning",
    d: "A customized itinerary built around your preferences, interests and budget, with a curated list of romantic activities and excursions at your chosen destination.",
  },
  {
    t: "Travel Planning",
    d: "Whether you're yearning for a relaxing beach getaway, an adventurous mountain escape, or a cultural exploration in a vibrant city, we help plan the intricate details of your dream vacation.",
  },
  {
    t: "Concierge Services",
    d: "Personalized assistance with booking reservations, providing information, arranging transportation and making recommendations, all with a high level of convenience and attention.",
  },
];

const phases = [
  {
    step: "I",
    title: "Planning",
    time: "9-12+ months out",
    text: "We define your budget and secure key vendors, including your venue, matching you with the perfect team.",
    items: ["Budget determination", "Venue selection", "Vendor selection"],
  },
  {
    step: "II",
    title: "Design",
    time: "4-9 months out",
    text: "We curate gorgeous designs and determine every detail, from color palettes and floor plans to tablescape decor and linen swatches, so you can see how your design will come to life.",
    items: [
      "Design plan creation",
      "Mockups of specific design elements",
      "Selection of design details",
    ],
  },
  {
    step: "III",
    title: "Execution",
    time: "3 months to event day",
    text: "We finalize every detail with you and your vendors, then our team runs the day so everything goes to plan.",
    items: ["Event day timeline", "Final vendor coordination", "Event day execution"],
  },
];

function ServicesPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [phase, setPhase] = useState(0);
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative mx-4 md:mx-auto max-w-3xl bg-background border border-gold-soft px-8 py-12 text-center shadow-luxe animate-fade-up">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Our Services</p>
          <h1 className="font-display text-5xl md:text-6xl">
            What do we bring to{" "}
            <span className="italic text-brand-gradient">your special day?</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-foreground/80 leading-relaxed">
            At Coco Cabana, we believe that every event is an opportunity to create something
            magical. Our comprehensive range of services includes meticulous event planning,
            exquisite decor design, and flawless execution, all tailored to your unique style. From
            selecting the perfect color scheme and floral arrangements to coordinating every aspect
            of your event, we handle it all, so you can relax and savor every moment.
          </p>
        </div>
      </section>

      <CalculatorCTA compact />
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          {core.map((o, i) => (
            <Reveal key={o.title} delay={(i % 2) * 120}>
              <div className={`group h-full p-10 ${tints[i]} lift`}>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-background text-brand mb-6 transition-transform duration-500 group-hover:scale-110">
                  <o.icon size={24} strokeWidth={1.4} />
                </span>
                <h3 className="font-display text-3xl mb-3">{o.title}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{o.desc}</p>
                <Link to="/pricing-calculator" className="text-link mt-4 block">
                  Not sure what to budget? Estimate your event →
                </Link>
                {o.link && (
                  <a
                    href={o.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1"
                  >
                    Visit website <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            eyebrow="We've got you fully covered"
            title="Weddings & events, planned and styled"
            subtitle="We handle every aspect with precision and grace, from conceptualization and venue selection to vendor coordination and on-site management, tailored to your needs, preferences and budget."
          />
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {weddingDetail.map((w, i) => (
              <Reveal key={w.t} delay={(i % 2) * 120}>
                <div className="h-full p-8 bg-surface border-l-4 border-brand lift">
                  <h3 className="font-display text-2xl mb-3">{w.t}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <SectionHeading
            eyebrow="What to Expect"
            title="Phases of the planning process"
            subtitle="We approach every event, intimate or grand, like it's ours. You'll work hand in hand with us from start to finish."
          />
          <div className="mt-12 flex justify-center gap-3">
            {phases.map((p, i) => (
              <button
                key={p.step}
                onClick={() => setPhase(i)}
                className={`px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition ${i === phase ? "bg-brand text-primary-foreground" : `${tints[i]} text-brand hover:opacity-80`}`}
              >
                Phase {p.step}
              </button>
            ))}
          </div>
          <div
            key={phase}
            className={`mt-8 max-w-3xl mx-auto p-10 md:p-14 ${tints[phase]} animate-fade-up`}
          >
            <p className="text-[11px] tracking-luxe uppercase text-brand mb-2">
              {phases[phase].time}
            </p>
            <h3 className="font-display text-4xl mb-4">{phases[phase].title}</h3>
            <p className="text-foreground/80 leading-relaxed mb-6">{phases[phase].text}</p>
            <p className="text-[11px] tracking-luxe uppercase text-brand mb-3">Focus areas</p>
            <ul className="grid sm:grid-cols-3 gap-3">
              {phases[phase].items.map((it) => (
                <li key={it} className="bg-background px-4 py-3 text-sm">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <SectionHeading
            eyebrow="Event Rentals"
            title="Flower walls"
            subtitle="Our flower walls are more than decorative elements; they are enchanting works of art that transform any space into a floral paradise in an instant. The perfect backdrop for weddings, parties, corporate events and photoshoots."
          />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4">
            {walls.map((w, i) => (
              <div key={w} className={`group p-8 text-center ${tints[i % 4]} lift`}>
                <Flower2
                  className="mx-auto text-brand mb-4 transition-transform duration-700 group-hover:rotate-180"
                  size={32}
                  strokeWidth={1.2}
                />
                <p className="font-display text-xl text-heading">{w}</p>
                <p className="mt-2 text-sm tracking-[0.2em] text-brand">$300</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">
              Signature Rental
            </p>
            <h2 className="font-display text-4xl md:text-5xl">360 Photo Booth</h2>
            <p className="mt-6 text-foreground/80 leading-relaxed">
              In line with our mission to be the one-stop shop for all your event needs, our 360
              photo booth gives your guests the ultimate experience. Its full glam setup features a
              wireless platform with about 14 hours of lithium-powered battery life, amazing
              lighting and a TV, for which we provide battery packs. Setups come with either red or
              black accessories (velvet ropes for stanchions and rug).
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Book the photo booth with any of our other services for a discount, and add a flower
              wall to your rental for <strong>$100 off</strong>. Email{" "}
              <a
                href="mailto:360photobooth@cococabana.us"
                className="text-brand border-b border-brand/40"
              >
                360photobooth@cococabana.us
              </a>
              .
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {booth.map((b, i) => (
              <Reveal key={b.t} delay={i * 100}>
                <div className={`p-8 text-center ${tints[(i + 1) % 4]} lift`}>
                  <b.icon className="mx-auto text-brand mb-3" size={30} strokeWidth={1.3} />
                  <p className="font-display text-lg text-heading">{b.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionHeading eyebrow="À La Carte" title="À la carte services" />
          <div className="mt-12 space-y-3">
            {alaCarte.map((a, i) => (
              <div
                key={a.t}
                className={`${open === i ? tints[i % 4] : "bg-background"} transition-colors`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-display text-xl text-heading">{a.t}</span>
                  <Plus
                    className={`text-brand transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                    size={20}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <p className="overflow-hidden px-6 text-sm text-foreground/80 leading-relaxed">
                    <span className="block pb-6">{a.d}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:-translate-y-0.5 transition"
            >
              Book a consultation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

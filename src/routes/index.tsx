import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Flower2, Crown, Instagram } from "lucide-react";
import heroImg from "@/assets/hero-event.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coco Cabana — Luxury Event Planning, Decor & Rentals" },
      { name: "description", content: "Bespoke event planning, decor and premium event rentals crafted with intention. Weddings, milestones, corporate gatherings." },
      { property: "og:title", content: "Coco Cabana — Luxury Event Planning, Decor & Rentals" },
      { property: "og:description", content: "Bespoke event planning, decor and premium event rentals crafted with intention." },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Sparkles, title: "Event Planning", text: "Weddings, corporate gatherings and birthday celebrations, planned end-to-end so you can be present." },
  { icon: Flower2, title: "Decor & Florals", text: "Fresh florals, luxury candle staging and bespoke design that turns any venue into an experience." },
  { icon: Crown, title: "Rentals", text: "Statement flower walls, neon signs and our signature 360 photo booth, ready to elevate your event." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Luxurious event reception"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        <div className="relative z-10 container mx-auto px-6 text-center pt-24 animate-fade-up">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Coco Cabana</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl mx-auto">
            Where moments become <span className="text-brand-gradient italic">heirlooms</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-foreground/80 leading-relaxed">
            From corporate galas and brand launches to baby showers and birthday bashes, we plan, style and rent everything that makes your event unforgettable.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground rounded-full shadow-gold hover:opacity-90 transition"
            >
              Begin Your Event <ArrowRight size={14} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.25em] uppercase border-2 border-brand rounded-full text-brand hover:bg-brand hover:text-primary-foreground transition"
            >
              View Portfolio
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand/60 text-[10px] tracking-luxe uppercase animate-pulse">
          Scroll
        </div>
      </section>

      {/* INTRO */}
      <section className="py-28 container mx-auto px-6">
        <SectionHeading
          eyebrow="The Coco Cabana Touch"
          title="Designed with intention. Delivered with grace."
          subtitle="From the first sketch to the final candle, we orchestrate every element so you can be fully present in your celebration."
        />
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-babyblue-light/50 border-y border-gold-soft">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {services.map((s) => (
              <div
                key={s.title}
                className="group p-10 rounded-3xl border border-gold-soft hover:border-brand transition-all bg-background/40 hover:shadow-gold"
              >
                <s.icon className="text-brand mb-6" size={36} strokeWidth={1.2} />
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1"
            >
              All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="py-28 container mx-auto px-6">
        <SectionHeading eyebrow="Recent Celebrations" title="A glimpse of our world" />
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[p1, p2, p3].map((src, i) => (
            <Link
              to="/portfolio"
              key={i}
              className="group relative overflow-hidden aspect-[3/4] block"
            >
              <img
                src={src}
                alt="Event design"
                width={1024}
                height={1280}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[10px] tracking-luxe uppercase text-brand mb-1">Featured</p>
                <p className="font-display text-xl">View Project</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <InstagramSection />

      {/* CTA */}
      <section className="py-28 container mx-auto px-6">
        <div className="relative overflow-hidden bg-gradient-onyx border border-gold-soft p-12 md:p-20 text-center shadow-luxe">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.78_0.13_85/0.12),transparent_60%)]" />
          <div className="relative">
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Let's create</p>
            <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
              Your story deserves a setting <span className="italic text-brand-gradient">just as beautiful</span>.
            </h2>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground rounded-full shadow-gold hover:opacity-90 transition"
            >
              Inquire Today <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InstagramSection() {
  return (
    <section className="py-28 bg-babyblue-light/40 border-y border-gold-soft">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="@cococabana.htx"
          title="Live from our feed"
          subtitle="Follow along for behind-the-scenes magic, fresh inspiration and recent celebrations."
        />
        <div className="mt-12 max-w-5xl mx-auto">
          {/*
            Instagram widget placeholder.
            To enable the live feed, sign up for a free SnapWidget or EmbedSocial account,
            connect the @cococabana.htx Instagram, and paste the generated <iframe> here in
            place of this placeholder block.
          */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[p1, p2, p3, heroImg, p2, p3, p1, heroImg].map((src, i) => (
              <a
                key={i}
                href="https://www.instagram.com/cococabana.htx/"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden block"
              >
                <img
                  src={src}
                  alt="Instagram post"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition flex items-center justify-center">
                  <Instagram className="text-brand opacity-0 group-hover:opacity-100 transition" size={28} />
                </div>
              </a>
            ))}
          </div>
          <p className="text-center mt-10 text-xs text-muted-foreground tracking-wide">
            Follow{" "}
            <a href="https://www.instagram.com/cococabana.htx/" target="_blank" rel="noreferrer" className="text-brand border-b border-brand/40">
              @cococabana.htx
            </a>{" "}
            on Instagram
          </p>
        </div>
      </div>
    </section>
  );
}

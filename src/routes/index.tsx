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
      { name: "description", content: "Bespoke event planning, decor and premium event rentals crafted with intention. Corporate events, baby showers, birthdays and weddings in Houston." },
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

const occasions = [
  { title: "Corporate & Galas", text: "Brand launches, holiday parties, conferences and retainer partnerships, delivered with polish and on schedule.", img: p2 },
  { title: "Baby Showers", text: "Soft garlands, dreamy dessert tables and picture-perfect backdrops for welcoming the little one.", img: p3 },
  { title: "Birthdays & Milestones", text: "First birthdays to milestone 30ths and 50ths, styled with personality and a little Coco dust.", img: p1 },
];

function OccasionsSection() {
  return (
    <section className="py-28 container mx-auto px-6">
      <SectionHeading
        eyebrow="Every Occasion"
        title="From the boardroom to the birthday table"
        subtitle="Whether you are hosting five hundred colleagues or twenty of your closest friends, we bring the same care, creativity and professionalism."
      />
      <div className="mt-20 grid md:grid-cols-3 gap-x-10 gap-y-16">
        {occasions.map((o, i) => (
          <article key={o.title} className="group">
            <div className="overflow-hidden aspect-[4/5]">
              <img src={o.img} alt={o.title} loading="lazy" width={1024} height={1280} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-6 flex items-baseline gap-4 border-t border-tan pt-5">
              <span className="font-display italic text-2xl text-gold-dark">0{i + 1}</span>
              <div>
                <h3 className="font-display text-2xl mb-2">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{o.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

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

        <div className="relative z-10 mx-auto max-w-4xl bg-background/95 border border-gold-soft px-8 py-14 md:px-16 text-center mt-24 animate-fade-up">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Coco Cabana</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl leading-[1.05] max-w-5xl mx-auto">
            Where moments become <span className="text-brand-gradient italic">heirlooms</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-foreground/80 leading-relaxed">
            From corporate galas and brand launches to baby showers and birthday bashes, we plan, style and rent everything that makes your event unforgettable.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:opacity-90 transition"
            >
              Begin Your Event <ArrowRight size={14} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.25em] uppercase border border-brand text-brand hover:bg-brand hover:text-primary-foreground transition"
            >
              View Portfolio
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand/60 text-[10px] tracking-luxe uppercase animate-pulse">
          Scroll
        </div>
      </section>

      <OccasionsSection />

      {/* SERVICES */}
      <section className="py-20 border-y border-gold-soft">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {services.map((s) => (
              <div
                key={s.title}
                className="group p-10 border border-gold-soft hover:border-brand transition-all hover:shadow-gold"
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[10px] tracking-luxe uppercase text-brand mb-1">Featured</p>
                <p className="font-display text-xl text-brand-deep">View Project</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <InstagramSection />

      {/* CTA */}
      <section className="py-28 container mx-auto px-6">
        <div className="relative overflow-hidden border border-gold-soft p-12 md:p-20 text-center shadow-luxe">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.78_0.13_85/0.12),transparent_60%)]" />
          <div className="relative">
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Let's create</p>
            <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
              Your story deserves a setting <span className="italic text-brand-gradient">just as beautiful</span>.
            </h2>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:opacity-90 transition"
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
    <section className="py-28 border-y border-gold-soft">
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

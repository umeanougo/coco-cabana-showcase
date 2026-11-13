import { gallery, homeGallery } from "@/config/gallery";
import { ServiceOverview } from "@/components/site/ServiceOverview";
import { reviewEnvironment } from "@/config/review-environment";
import { CalculatorCTA } from "@/components/site/CalculatorCTA";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Flower2, Instagram, Heart, Briefcase, Cake, Baby, Star } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coco Cabana | Event Planning, Decor & Rentals in Houston" },
      {
        name: "description",
        content:
          "Your vision, our expertise. Coco Cabana is Houston's one-stop shop for weddings, corporate gatherings, baby showers and birthday celebrations.",
      },
      { property: "og:title", content: "Coco Cabana | Your Vision, Our Expertise" },
      {
        property: "og:description",
        content:
          "Your one-stop shop for all things events: planning, decor and rentals in Houston.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const tints = ["bg-tint-blue", "bg-tint-blush", "bg-tint-sage", "bg-tint-tan"];

const occasions = [
  {
    key: "corporate",
    icon: Briefcase,
    title: "Corporate & Galas",
    text: "A strategic approach that aligns with your company's goals, reinforces your brand and gives real value to attendees, from venue selection to theme, branding and program development.",
    image: gallery[2],
  },
  {
    key: "baby",
    icon: Baby,
    title: "Baby Showers",
    text: "Soft palettes, dreamy dessert tables and picture-perfect backdrops for welcoming the little one.",
    image: gallery[4],
  },
  {
    key: "birthday",
    icon: Cake,
    title: "Birthdays & Milestones",
    text: "Planning and design for birthdays and milestones, shaped around your priorities.",
    image: gallery[1],
  },
  {
    key: "wedding",
    icon: Heart,
    title: "Weddings",
    text: "Whether you envision an intimate gathering or a grand celebration, trust us to be your partner in creating a wedding cherished forever.",
    image: gallery[0],
  },
];

const marquee = [
  "Weddings",
  "Corporate Events",
  "Baby Showers",
  "Birthday Bashes",
  "Galas",
  "Proposals",
  "Charity Events",
  "Flower Walls",
  "360 Photo Booth",
  "Candle Staging",
  "Eru Iyawo",
];

function OccasionsSection() {
  const [active, setActive] = useState(0);
  const o = occasions[active];
  return (
    <section className="py-28 bg-surface">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Every Occasion"
          title="From the boardroom to the birthday table"
          subtitle="Whether you are hosting five hundred colleagues or twenty of your closest friends, we bring the same care, creativity and professionalism."
        />
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {occasions.map((x, i) => (
            <button
              key={x.key}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.2em] uppercase border transition-all ${
                i === active
                  ? "bg-brand text-primary-foreground border-brand"
                  : `${tints[i]} border-transparent text-brand hover:border-brand`
              }`}
            >
              <x.icon size={14} /> {x.title}
            </button>
          ))}
        </div>
        <div key={o.key} className="mt-12 grid md:grid-cols-2 gap-0 items-stretch animate-fade-up">
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
            <img src={o.image.src} alt={o.image.alt} className="h-full w-full object-cover" />
            <p className="absolute bottom-3 left-3 right-3 bg-background px-4 py-2 text-sm">
              Design inspiration · {o.image.label}. Event association unconfirmed.
            </p>
          </div>
          <div className={`${tints[active]} p-10 md:p-16 flex flex-col justify-center`}>
            <span className="font-display italic text-5xl text-brand/40">0{active + 1}</span>
            <h3 className="font-display text-4xl mt-2 mb-5">{o.title}</h3>
            <p className="text-foreground/80 leading-relaxed">{o.text}</p>
            <Link
              to="/contact"
              className="mt-8 self-start inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all"
            >
              Plan yours <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-28 pb-12 md:pt-32 md:pb-16 flex items-center justify-center overflow-hidden">
        <img
          src={gallery[6].src}
          alt={gallery[6].alt}
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-[fade-up_1.6s_ease-out_both]"
        />
        <div className="relative z-10 mx-4 max-w-4xl bg-background border border-gold-soft px-6 py-8 md:px-12 md:py-12 text-center animate-fade-up shadow-luxe">
          <Star
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-gold bg-background p-2 rounded-full animate-float"
            size={40}
          />
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Coco Cabana</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
            Event planning and design in Houston,{" "}
            <span className="text-brand-gradient italic">shaped around your celebration.</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-foreground/80 leading-relaxed">
            From weddings and birthdays to showers and corporate gatherings: choose full planning,
            design support or the décor pieces you need. Explore a starting budget before you
            inquire.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:-translate-y-0.5 transition"
            >
              Explore your event budget <ArrowRight size={14} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.25em] uppercase border border-brand text-brand hover:bg-brand hover:text-primary-foreground transition"
            >
              View Gallery
            </Link>
          </div>
          <Link to="/contact" className="inline-block mt-6 text-brand underline underline-offset-4">
            Ready to talk? Start an inquiry
          </Link>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-brand-deep text-primary-foreground py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...marquee, ...marquee].map((m, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-6 font-display italic text-xl whitespace-nowrap"
            >
              {m} <span className="text-gold not-italic text-sm">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* WELCOME */}
      <section className="py-28 bg-surface">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-2/3 h-2/3 bg-tint-blue" />
              <div className="absolute -bottom-6 -right-6 w-1/2 h-1/2 bg-tint-blush" />
              <img
                src={gallery[3].src}
                alt={gallery[3].alt}
                loading="lazy"
                className="relative aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">
              Welcome to Coco Cabana
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Your one stop shop for{" "}
              <span className="italic text-brand-gradient">all things events</span>
            </h2>
            <p className="mt-6 text-foreground/80 leading-relaxed">
              Our dedicated team of experienced planners and decorators is here to ensure every
              detail is meticulously executed, leaving you free to enjoy your special day to the
              fullest. From concept to creation, we handle it all with creativity, passion, and a
              commitment to exceeding your expectations.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed italic">
              "We approach every event, intimate or grand, like it's ours!"
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                ["Planning", "Organise"],
                ["Design", "Shape the look"],
                ["À la carte", "Your vision"],
              ].map(([t, d], i) => (
                <div key={t} className={`${tints[i]} p-4 lift`}>
                  <p className="font-display text-xl text-heading">{t}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-brand mt-1">{d}</p>
                </div>
              ))}
            </div>
            <Link
              to="/services"
              className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all"
            >
              See Services <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CalculatorCTA />

      <OccasionsSection />

      <ServiceOverview />

      {/* GALLERY PREVIEW */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            eyebrow="Event Gallery"
            title="A glimpse of our world"
            subtitle="Explore the gallery, then tell us which details you are drawn to. Images are not tier packages or price examples."
          />
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:h-[640px]">
            {homeGallery.map((g, i) => (
              <Link
                to="/portfolio"
                hash={g.id}
                aria-label={`View ${g.label} in the portfolio`}
                key={g.id}
                className={`group relative overflow-hidden aspect-square md:aspect-auto ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-3 bottom-3 bg-background px-4 py-3  transition-transform duration-500">
                  <p className="font-display text-lg text-heading">{g.label}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all"
            >
              View Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <InstagramSection />

      {/* MAILING LIST + CTA */}
      <section className="py-28 bg-surface">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          <Reveal className="h-full">
            <div className="h-full bg-tint-blush p-12 md:p-16 relative overflow-hidden">
              <Flower2
                className="absolute -right-6 -bottom-6 text-brand/10 animate-float"
                size={180}
              />
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">
                Join our mailing list
              </p>
              <h2 className="font-display text-4xl leading-tight">$50 off a flower wall rental</h2>
              <p className="mt-4 text-foreground/80">
                Sign up for $50 off a flower wall rental, along with our latest pictures and
                updates. Offer eligibility and current availability need confirmation.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (reviewEnvironment.enabled) return;
                  const v = new FormData(e.currentTarget).get("email");
                  window.location.href = `mailto:hello@cococabana.us?subject=Mailing%20list%20signup&body=Please%20add%20${encodeURIComponent(String(v))}`;
                }}
                className="relative mt-8 flex flex-col sm:flex-row gap-3"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 bg-background px-5 py-4 text-sm outline-none focus:ring-2 ring-brand"
                />
                <button
                  disabled={reviewEnvironment.enabled}
                  className="px-8 py-4 text-xs tracking-[0.25em] uppercase bg-brand text-primary-foreground hover:opacity-90 transition"
                >
                  {reviewEnvironment.enabled ? "Signup disabled in review" : "Join"}
                </button>
              </form>
            </div>
          </Reveal>
          <Reveal delay={150} className="h-full">
            <div className="h-full bg-tint-blue p-12 md:p-16 flex flex-col justify-center">
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">
                Ready to start planning?
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                Let's get this <span className="italic text-brand-gradient">party started!</span>
              </h2>
              <Link
                to="/contact"
                className="mt-10 self-start inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:-translate-y-0.5 transition"
              >
                Inquire Today <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InstagramSection() {
  return (
    <section className="py-28 bg-surface">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="@cococabana.htx"
          title="A little inspiration"
          subtitle="A selected image gallery, not a live feed. Visit Instagram for current posts."
        />
        <div className="mt-12 max-w-5xl mx-auto">
          {/* Instagram widget placeholder: paste a SnapWidget/EmbedSocial iframe here for the live feed. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...gallery, gallery[1]].map((image, i) => (
              <a
                key={i}
                href="https://www.instagram.com/cococabana.htx/"
                target="_blank"
                rel="noreferrer"
                className={`group relative aspect-square overflow-hidden block ${i % 2 ? "md:translate-y-6" : ""}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition flex items-center justify-center">
                  <Instagram
                    className="text-brand opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition"
                    size={28}
                  />
                </div>
              </a>
            ))}
          </div>
          <p className="text-center mt-16 text-xs text-muted-foreground tracking-wide">
            Follow{" "}
            <a
              href="https://www.instagram.com/cococabana.htx/"
              target="_blank"
              rel="noreferrer"
              className="text-brand border-b border-brand/40"
            >
              @cococabana.htx
            </a>{" "}
            on Instagram
          </p>
        </div>
      </div>
    </section>
  );
}

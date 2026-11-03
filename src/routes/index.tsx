import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Flower2, Crown, Instagram, Heart, Briefcase, Cake, Baby, Star } from "lucide-react";
import heroImg from "@/assets/hero-event.jpg";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coco Cabana | Event Planning, Decor & Rentals in Houston" },
      { name: "description", content: "Your vision, our expertise. Coco Cabana is Houston's one-stop shop for weddings, corporate gatherings, baby showers and birthday celebrations." },
      { property: "og:title", content: "Coco Cabana | Your Vision, Our Expertise" },
      { property: "og:description", content: "Your one-stop shop for all things events: planning, decor and rentals in Houston." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const tints = ["bg-tint-blue", "bg-tint-blush", "bg-tint-sage", "bg-tint-tan"];

const services = [
  { icon: Heart, title: "Weddings", text: "Extraordinary wedding experiences that capture the essence of your love and reflect your distinct style." },
  { icon: Sparkles, title: "Events", text: "Corporate gatherings, milestone celebrations and themed parties made seamless, stylish and extraordinary." },
  { icon: Crown, title: "Rentals", text: "High-quality flower walls and our 360 photo booth that elevate the look and experience of your event." },
  { icon: Flower2, title: "Luxury Candle Staging", text: "Captivating candle setups that bathe your venue in a warm, unforgettable glow." },
];

const occasions = [
  { key: "corporate", icon: Briefcase, title: "Corporate & Galas", text: "A strategic approach that aligns with your company's goals, reinforces your brand and gives real value to attendees, from venue selection to theme, branding and program development.", img: p3 },
  { key: "baby", icon: Baby, title: "Baby Showers", text: "Soft palettes, dreamy dessert tables and picture-perfect backdrops for welcoming the little one.", img: p5 },
  { key: "birthday", icon: Cake, title: "Birthdays & Milestones", text: "From Rossy's Birthday Bash to Emeka's Lavish 30th, milestone celebrations styled with personality and a little Coco dust.", img: p2 },
  { key: "wedding", icon: Heart, title: "Weddings", text: "Whether you envision an intimate gathering or a grand celebration, trust us to be your partner in creating a wedding cherished forever.", img: p1 },
];

const marquee = ["Weddings", "Corporate Events", "Baby Showers", "Birthday Bashes", "Galas", "Proposals", "Charity Events", "Flower Walls", "360 Photo Booth", "Candle Staging", "Eru Iyawo"];

function OccasionsSection() {
  const [active, setActive] = useState(0);
  const o = occasions[active];
  return (
    <section className="py-28 bg-background">
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
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.2em] uppercase border transition-all ${
                i === active ? "bg-brand text-primary-foreground border-brand" : `${tints[i]} border-transparent text-brand hover:border-brand`
              }`}
            >
              <x.icon size={14} /> {x.title}
            </button>
          ))}
        </div>
        <div key={o.key} className="mt-12 grid md:grid-cols-2 gap-0 items-stretch animate-fade-up">
          <div className="overflow-hidden aspect-[4/3] md:aspect-auto">
            <img src={o.img} alt={o.title} className="h-full w-full object-cover" />
          </div>
          <div className={`${tints[active]} p-10 md:p-16 flex flex-col justify-center`}>
            <span className="font-display italic text-5xl text-brand/40">0{active + 1}</span>
            <h3 className="font-display text-4xl mt-2 mb-5">{o.title}</h3>
            <p className="text-foreground/80 leading-relaxed">{o.text}</p>
            <Link to="/contact" className="mt-8 self-start inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all">
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Luxurious event reception" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover scale-105 animate-[fade-up_1.6s_ease-out_both]" />
        <div className="relative z-10 mx-4 max-w-4xl bg-background border border-gold-soft px-8 py-14 md:px-16 text-center mt-24 animate-fade-up shadow-luxe">
          <Star className="absolute -top-5 left-1/2 -translate-x-1/2 text-gold bg-background p-2 rounded-full animate-float" size={40} />
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-6">Coco Cabana</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05]">
            Your vision, <span className="text-brand-gradient italic">our expertise</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-foreground/80 leading-relaxed">
            At Coco Cabana, we take the stress out of event planning and turn your visions into reality. Whether you're dreaming of a breathtaking wedding, a corporate gathering that wows, or a memorable birthday celebration, we're your one-stop shop for all things events.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:-translate-y-0.5 transition">
              Contact Us <ArrowRight size={14} />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.25em] uppercase border border-brand text-brand hover:bg-brand hover:text-primary-foreground transition">
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-brand-deep text-primary-foreground py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-display italic text-xl whitespace-nowrap">
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
              <img src={p4} alt="Coco Cabana event decor" loading="lazy" className="relative aspect-[4/5] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Welcome to Coco Cabana</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">Your one stop shop for <span className="italic text-brand-gradient">all things events</span></h2>
            <p className="mt-6 text-foreground/80 leading-relaxed">
              Our dedicated team of experienced planners and decorators is here to ensure every detail is meticulously executed, leaving you free to enjoy your special day to the fullest. From concept to creation, we handle it all with creativity, passion, and a commitment to exceeding your expectations.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed italic">"We approach every event, intimate or grand, like it's ours!"</p>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[["Planning", "9-12+ mo"], ["Design", "4-9 mo"], ["Execution", "Event day"]].map(([t, d], i) => (
                <div key={t} className={`${tints[i]} p-4 lift`}>
                  <p className="font-display text-xl text-heading">{t}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-brand mt-1">{d}</p>
                </div>
              ))}
            </div>
            <Link to="/services" className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all">
              See Services <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <OccasionsSection />

      {/* SERVICES */}
      <section className="py-28 bg-surface">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="What we bring" title="What do we bring to your special day?" />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <Link to="/services" className={`group block h-full p-8 ${tints[i]} lift`}>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-background text-brand mb-6 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <s.icon size={24} strokeWidth={1.4} />
                  </span>
                  <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{s.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-brand opacity-0 group-hover:opacity-100 transition">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="Event Gallery" title="A glimpse of our world" subtitle="Memorable moments, each unique in purpose, scale and impact, all sharing our unwavering commitment to excellence." />
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:h-[640px]">
            {[
              { src: p1, t: "Mara Villa Katy", c: "md:col-span-2 md:row-span-2" },
              { src: p2, t: "Emeka's Lavish 30th", c: "" },
              { src: p6, t: "Rossy's Birthday Bash", c: "" },
              { src: p3, t: "Hotel Laura Gala", c: "" },
              { src: p5, t: "Baby Shower", c: "" },
            ].map((g) => (
              <Link to="/portfolio" key={g.t} className={`group relative overflow-hidden aspect-square md:aspect-auto ${g.c}`}>
                <img src={g.src} alt={g.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-x-3 bottom-3 bg-background px-4 py-3 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-display text-lg text-heading">{g.t}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1 hover:gap-4 transition-all">
              View Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <InstagramSection />

      {/* MAILING LIST + CTA */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          <Reveal className="h-full">
            <div className="h-full bg-tint-blush p-12 md:p-16 relative overflow-hidden">
              <Flower2 className="absolute -right-6 -bottom-6 text-brand/10 animate-float" size={180} />
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Join our mailing list</p>
              <h2 className="font-display text-4xl leading-tight">$50 off a flower wall rental</h2>
              <p className="mt-4 text-foreground/80">Sign up for $50 off a flower wall rental, along with our latest pictures and updates.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = new FormData(e.currentTarget).get("email");
                  window.location.href = `mailto:hello@cococabana.us?subject=Mailing%20list%20signup&body=Please%20add%20${encodeURIComponent(String(v))}`;
                }}
                className="relative mt-8 flex flex-col sm:flex-row gap-3"
              >
                <input name="email" type="email" required placeholder="Your email" className="flex-1 bg-background px-5 py-4 text-sm outline-none focus:ring-2 ring-brand" />
                <button className="px-8 py-4 text-xs tracking-[0.25em] uppercase bg-brand text-primary-foreground hover:opacity-90 transition">Join</button>
              </form>
            </div>
          </Reveal>
          <Reveal delay={150} className="h-full">
            <div className="h-full bg-tint-blue p-12 md:p-16 flex flex-col justify-center">
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Ready to start planning?</p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">Let's get this <span className="italic text-brand-gradient">party started!</span></h2>
              <Link to="/contact" className="mt-10 self-start inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.25em] uppercase bg-gradient-brand text-primary-foreground shadow-gold hover:-translate-y-0.5 transition">
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
        <SectionHeading eyebrow="@cococabana.htx" title="Live from our feed" subtitle="Follow along for behind-the-scenes magic, fresh inspiration and recent celebrations." />
        <div className="mt-12 max-w-5xl mx-auto">
          {/* Instagram widget placeholder: paste a SnapWidget/EmbedSocial iframe here for the live feed. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[p1, p2, p3, p4, p5, p6, heroImg, p2].map((src, i) => (
              <a key={i} href="https://www.instagram.com/cococabana.htx/" target="_blank" rel="noreferrer" className={`group relative aspect-square overflow-hidden block ${i % 2 ? "md:translate-y-6" : ""}`}>
                <img src={src} alt="Instagram post" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/60 transition flex items-center justify-center">
                  <Instagram className="text-brand opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition" size={28} />
                </div>
              </a>
            ))}
          </div>
          <p className="text-center mt-16 text-xs text-muted-foreground tracking-wide">
            Follow{" "}
            <a href="https://www.instagram.com/cococabana.htx/" target="_blank" rel="noreferrer" className="text-brand border-b border-brand/40">@cococabana.htx</a>{" "}
            on Instagram
          </p>
        </div>
      </div>
    </section>
  );
}

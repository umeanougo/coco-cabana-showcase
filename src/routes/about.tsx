import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import christineImg from "@/assets/team-christine.webp";
import belemaImg from "@/assets/team-belema.avif";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

const tints = ["bg-tint-blue", "bg-tint-blush", "bg-tint-sage", "bg-tint-tan"];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Coco Cabana | Curating Breathtaking Events" },
      {
        name: "description",
        content:
          "Meet Coco Cabana — a Houston team of dedicated planners and decorators turning your vision into a breathtaking reality.",
      },
      { property: "og:title", content: "About — Coco Cabana" },
      {
        property: "og:description",
        content:
          "Curating breathtaking events with creativity, professionalism and a personal touch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    t: "Professionalism",
    d: "Planning and coordinating an event can be a stressful experience. At Coco Cabana we bring the highest level of professionalism to every client we serve.",
  },
  {
    t: "A Personal Touch",
    d: "Building strong and enduring relationships with our clients is at our core. Every project is a collaborative effort, and our commitment to those connections is what sets us apart.",
  },
  {
    t: "Creativity",
    d: "Coco Cabana is all about creating an amazing and indelible impression on your guests, with our signature creative pixie dust, read 'Coco dust', for this very purpose.",
  },
  {
    t: "Attention to Detail",
    d: "A great event is a symphony of crucial little parts moving in harmony. We listen carefully to our clients' desires and bring every tittle to life.",
  },
];

const team = [
  {
    name: "Christine Osakwe",
    role: "Owner + Creative Director",
    img: christineImg,
    bio: "Christine is a professional event planner, event decorator and interior designer whose flair for sprinkling pixie dust on creative projects can only be matched by her deep interest in connecting with people and having a good time while at it. An artist at heart, she thoroughly enjoys the process of transforming any creative idea into a work of art.",
  },
  {
    name: "Belema-Ruth Umeano",
    role: "In-House Planner",
    img: belemaImg,
    bio: "Belema-Ruth is a professional event planner and decorator with a love for the details and structural side of things. She enjoys building together the pieces necessary to bring a client's vision to life. Her priority is ensuring you feel at ease from beginning to end, knowing you don't have to worry about the nitty gritty. With the theme in mind, she selects the items that create the right atmosphere, enhance the mood and complement the event's aesthetics.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-12 container mx-auto px-6 text-center">
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">About Coco Cabana</p>
        <h1 className="font-display text-5xl md:text-7xl">
          Curating <span className="italic text-brand-gradient">breathtaking events</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
          With a team of dedicated and creative planners and decorators, we take pride in
          transforming your vision into a breathtaking reality. From the perfect color palette to
          elegant tablescapes, we honor every detail so your event becomes a true reflection of your
          dreams.
        </p>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <SectionHeading
            eyebrow="Why choose us"
            title="Why Coco Cabana"
            subtitle="Our commitment to excellence, paired with meticulous attention to detail, ensures your event will not only be flawlessly executed but will also radiate beauty and charm."
          />
          <div className="mt-16 grid md:grid-cols-2 gap-10">
            {pillars.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 120}>
                <div className={`h-full p-10 ${tints[i]} lift`}>
                  <p className="font-display italic text-4xl text-brand/30 mb-2">0{i + 1}</p>
                  <p className="font-display text-2xl text-heading mb-3">{v.t}</p>
                  <p className="text-foreground/80 leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <SectionHeading eyebrow="The Studio" title="Meet the team" />
        <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {team.map((m, i) => (
            <div key={m.name} className={`text-center p-10 ${tints[i]} lift`}>
              <div className="mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-background shadow-luxe transition-transform duration-500 hover:scale-105">
                <img
                  src={m.img}
                  alt={m.name}
                  width={384}
                  height={384}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-6 font-display text-2xl text-heading">{m.name}</p>
              <p className="text-[11px] tracking-luxe uppercase text-brand mt-1">{m.role}</p>
              <p className="mt-5 text-muted-foreground leading-relaxed text-sm">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Your next event</p>
          <h2 className="font-display text-4xl md:text-5xl">
            Love is <span className="italic text-brand-gradient">in the air</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Every event is a once-in-a-lifetime occasion, and that's why we embrace the art of
            curating beautiful moments. Let us create your next event, one that captivates the
            senses, touches the heart and becomes a cherished memory for a lifetime.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-brand border-b border-brand pb-1"
          >
            Start your event <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}

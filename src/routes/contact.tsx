import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Coco Cabana | Inquire About Your Event" },
      { name: "description", content: "Tell us about your upcoming event. Coco Cabana responds to every inquiry personally — let's start designing your celebration." },
      { property: "og:title", content: "Contact — Coco Cabana" },
      { property: "og:description", content: "Tell us about your upcoming event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-12 container mx-auto px-6 text-center">
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Inquire</p>
        <h1 className="font-display text-5xl md:text-7xl">
          Let's <span className="italic text-brand-gradient">create together</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
          Share a few details and we'll be in touch within 1–2 business days to
          begin designing your celebration.
        </p>
      </section>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-4xl">Why us?</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">At Coco Cabana, our commitment to excellence, coupled with a meticulous attention to detail, ensures that your event will not only be flawlessly executed but will also radiate beauty and charm. Pick the form that matches your inquiry.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { t: "General Contact", d: "Would you like us to handle planning or decor for your upcoming event?", c: "bg-tint-blue" },
              { t: "Luxury Candle Staging", d: "Just interested in our candle staging service? Use our form or visit luxurycandlestaging.com.", c: "bg-tint-blush" },
              { t: "360 Photo Booth", d: "Just interested in our photo booth? Fill out the form or email 360photobooth@cococabana.us.", c: "bg-tint-sage" },
              { t: "Flower Wall Rental", d: "Renting a flower wall and possibly adding on a neon sign? Use this form.", c: "bg-tint-tan" },
            ].map((f) => (
              <a key={f.t} href="https://www.honeybook.com/widget/coco_cabana_223521/cf_id/631af7ecf7bcf404cfac7ef9" target="_blank" rel="noreferrer" className={`group block p-8 ${f.c} lift`}>
                <h3 className="font-display text-2xl mb-3">{f.t}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{f.d}</p>
                <span className="mt-5 inline-block text-[10px] tracking-[0.25em] uppercase text-brand border-b border-brand/40 group-hover:border-brand">Open form →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-tint-blue">
              <h3 className="font-display text-2xl mb-6">Get in touch</h3>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="text-brand mt-0.5 shrink-0" size={18} />
                  <a href="mailto:hello@cococabana.us" className="hover:text-brand transition">
                    hello@cococabana.us
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="text-brand mt-0.5 shrink-0" size={18} />
                  <a href="https://www.instagram.com/cococabana.htx/" target="_blank" rel="noreferrer" className="hover:text-brand transition">
                    @cococabana.htx
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand mt-0.5 shrink-0" size={18} />
                  <span className="text-muted-foreground">Houston, TX · local & destination events</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-brand mt-0.5 shrink-0" size={18} />
                  <span className="text-muted-foreground">By appointment only</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gold-soft/50">
                <p className="text-[10px] tracking-luxe uppercase text-brand/70 mb-4">Follow us</p>
                <SocialLinks iconSize={20} />
              </div>
            </div>

            <div className="p-8 bg-tint-blush">
              <p className="divider-gold text-[10px] tracking-luxe uppercase mb-4">A note</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We respond to every inquiry personally. Once submitted, you'll
                receive a confirmation and we'll follow up to schedule a
                discovery call.
              </p>
            </div>
          </aside>

          {/* HoneyBook contact form — opens in new tab (HoneyBook blocks iframe embedding) */}
          <div className="lg:col-span-2">
            <div className="bg-surface p-10 md:p-16 shadow-luxe text-center">
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Inquiry form</p>
              <h2 className="font-display text-3xl md:text-4xl mb-5">
                Tell us about your <span className="italic text-brand-gradient">event</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Click below to open our full inquiry form. You'll share details
                about your date, guest count, vision, and budget — it takes just
                a few minutes.
              </p>
              <a
                href="https://www.honeybook.com/widget/coco_cabana_223521/cf_id/631af7ecf7bcf404cfac7ef9"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gradient-brand text-primary-foreground px-10 py-4 text-[11px] tracking-luxe uppercase font-medium hover:opacity-90 transition shadow-luxe"
              >
                Open inquiry form
              </a>
              <p className="mt-6 text-xs text-muted-foreground">
                Powered by HoneyBook · Submissions go straight to our inbox
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

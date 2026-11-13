import { reviewEnvironment } from "@/config/review-environment";
import { site } from "@/config/site";
import { CalculatorCTA } from "@/components/site/CalculatorCTA";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Coco Cabana | Inquire About Your Event" },
      {
        name: "description",
        content:
          "Tell us about your upcoming event. Coco Cabana responds to every inquiry personally — let's start designing your celebration.",
      },
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
          Tell us what you are planning and the support you need: Planning, Design or À la carte
          décor.
        </p>
      </section>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-4xl">Ready to inquire?</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Share your date, vision and priorities through our inquiry form. We’ll follow up to
              discuss the details.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                t: "Planning or design for my event",
                d: "For personal celebrations and corporate organisers. Tell us whether you need Planning, Design or À la carte décor.",
                c: "bg-tint-blue",
              },
              {
                t: "Planner collaboration",
                d: "For professional planners seeking Design or À la carte décor support for a client.",
                c: "bg-tint-blush",
              },
              {
                t: "Rentals & specialist services",
                d: "Ask about flower walls, the 360 photo booth, candle staging or another specific offering.",
                c: "bg-tint-sage",
              },
            ].map((f) => (
              <a key={f.t} href="#inquiry-form" className={`group block p-8 ${f.c} lift`}>
                <h3 className="font-display text-2xl mb-3">{f.t}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{f.d}</p>
                <span className="mt-5 inline-block text-[10px] tracking-[0.25em] uppercase text-brand border-b border-brand/40 group-hover:border-brand">
                  View inquiry options →
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-center text-muted-foreground">
            All three routes use the same general HoneyBook inquiry form. Please describe your
            service there; your selection and calculator details are not automatically transferred.
          </p>
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
                  <a
                    href={reviewEnvironment.enabled ? undefined : "mailto:hello@cococabana.us"}
                    aria-disabled={reviewEnvironment.enabled}
                    className="hover:text-brand transition"
                  >
                    hello@cococabana.us
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="text-brand mt-0.5 shrink-0" size={18} />
                  <a
                    href="https://www.instagram.com/cococabana.htx/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand transition"
                  >
                    @cococabana.htx
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand mt-0.5 shrink-0" size={18} />
                  <span className="text-muted-foreground">
                    Houston, TX · local & destination events
                  </span>
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
                An inquiry starts a conversation about your event. A consultation is a separate next
                step; opening this page does not reserve a date or book an appointment.
              </p>
            </div>
          </aside>

          {/* HoneyBook contact form — opens in new tab (HoneyBook blocks iframe embedding) */}
          <div id="inquiry-form" className="lg:col-span-2 scroll-mt-28">
            <div className="bg-surface p-10 md:p-16 shadow-luxe text-center">
              <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Inquiry form</p>
              <h2 className="font-display text-3xl md:text-4xl mb-5">
                Tell us about your <span className="italic text-brand-gradient">event</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                The general inquiry form opens in HoneyBook. Include your service, date, guest count
                and priorities, along with any selections you want to discuss.
              </p>
              <a
                href={reviewEnvironment.enabled ? undefined : site.honeybook}
                aria-disabled={reviewEnvironment.enabled}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gradient-brand text-primary-foreground px-10 py-4 text-[11px] tracking-luxe uppercase font-medium hover:opacity-90 transition shadow-luxe"
              >
                {reviewEnvironment.enabled ? "Inquiries disabled in review" : "Open inquiry form"}
              </a>
              <p className="mt-6 text-xs text-muted-foreground">
                {reviewEnvironment.enabled
                  ? "Test website: no inquiry or booking will be submitted."
                  : "Powered by HoneyBook · Submissions go straight to our inbox"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <CalculatorCTA compact />
    </>
  );
}

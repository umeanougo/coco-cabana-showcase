import { createFileRoute } from "@tanstack/react-router";
import { Mail, Instagram, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Coco Cabana | Inquire About Your Event" },
      { name: "description", content: "Tell us about your upcoming event. Coco Cabana responds to every inquiry personally — let's start designing your celebration." },
      { property: "og:title", content: "Contact — Coco Cabana" },
      { property: "og:description", content: "Tell us about your upcoming event." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useEffect(() => {
    const id = "honeybook-embed-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <>
      <section className="pt-40 pb-12 container mx-auto px-6 text-center">
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">Inquire</p>
        <h1 className="font-display text-5xl md:text-7xl">
          Let's <span className="italic text-gold-gradient">create together</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
          Share a few details and we'll be in touch within 1–2 business days to
          begin designing your celebration.
        </p>
      </section>

      <section className="py-12 container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-8 border border-gold-soft bg-card/40">
              <h3 className="font-display text-2xl mb-6">Get in touch</h3>
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="text-gold mt-0.5 shrink-0" size={18} />
                  <a href="mailto:hello@cococabana.com" className="hover:text-gold transition">
                    hello@cococabana.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="text-gold mt-0.5 shrink-0" size={18} />
                  <a href="https://instagram.com/coco_cabana" target="_blank" rel="noreferrer" className="hover:text-gold transition">
                    @coco_cabana
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-gold mt-0.5 shrink-0" size={18} />
                  <span className="text-muted-foreground">Serving local & destination events</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-gold mt-0.5 shrink-0" size={18} />
                  <span className="text-muted-foreground">By appointment only</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border border-gold-soft bg-gradient-onyx">
              <p className="divider-gold text-[10px] tracking-luxe uppercase mb-4">A note</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We respond to every inquiry personally. Once submitted, you'll
                receive a confirmation and we'll follow up to schedule a
                discovery call.
              </p>
            </div>
          </aside>

          {/* HoneyBook embedded form */}
          <div className="lg:col-span-2">
            <div className="border border-gold-soft bg-cream p-4 md:p-6 shadow-luxe min-h-[900px]">
              <div
                className="hb-p-223521-1"
                data-widget-type="placement_widget"
                data-widget-id="223521"
                data-placement-id="1"
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Form not loading?{" "}
              <a
                href="https://www.honeybook.com/widget/coco_cabana_223521/cf_id/631af7ecf7bcf404cfac7ef9"
                target="_blank"
                rel="noreferrer"
                className="text-gold border-b border-gold/40"
              >
                Open in a new tab
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { reviewEnvironment } from "@/config/review-environment";
import { Link } from "@tanstack/react-router";
import { Mail, Clock } from "lucide-react";
import logo from "@/assets/coco-cabana-logo.png";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-gold-soft mt-24">
      <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-3 mb-5">
            <img
              src={logo}
              alt="Coco Cabana"
              width={56}
              height={56}
              className="h-16 w-16 object-contain rounded-full bg-brand-deep p-1 ring-2 ring-gold/60"
            />
            <div>
              <p className="font-display text-xl">Coco Cabana</p>
              <p className="text-[10px] tracking-luxe text-brand uppercase">
                Events · Decor · Rentals
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Houston's one-stop shop for events, decor and rentals. Bespoke planning, luxe florals,
            flower walls and 360 photo booths, designed with intention.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-luxe uppercase mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/pricing" className="hover:text-brand transition">
                Estimate Your Event
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-brand transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-brand transition">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-brand transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-luxe uppercase mb-5">Connect</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={reviewEnvironment.enabled ? undefined : "mailto:hello@cococabana.us"}
                aria-disabled={reviewEnvironment.enabled}
                className="flex items-center gap-2 hover:text-brand transition"
              >
                <Mail size={16} />
                <span>hello@cococabana.us</span>
              </a>
            </li>
            <li>
              <span className="flex items-center gap-2">
                <Clock size={16} /> Available by appointment
              </span>
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-[10px] tracking-luxe uppercase text-brand/70 mb-3">Follow</p>
            <SocialLinks iconSize={18} />
          </div>
        </div>
      </div>
      <div className="border-t border-gold-soft">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Coco Cabana. All rights reserved.</p>
          <p className="tracking-luxe uppercase text-brand/70">Designed with intention</p>
        </div>
      </div>
    </footer>
  );
}

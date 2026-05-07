import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import logo from "@/assets/coco-cabana-logo.png";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-gold-soft bg-gradient-onyx mt-24">
      <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="Coco Cabana" width={56} height={56} className="h-14 w-14 rounded-full" />
            <div>
              <p className="font-display text-xl">Coco Cabana</p>
              <p className="text-[10px] tracking-luxe text-gold uppercase">Events · Decor · Rentals</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Houston's one-stop shop for events, decor and rentals. Bespoke
            planning, luxe florals, flower walls and 360 photo booths, designed
            with intention.
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-luxe uppercase text-gold mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/services" className="hover:text-gold transition">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold transition">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-gold transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-luxe uppercase text-gold mb-5">Connect</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:hello@cococabana.us" className="flex items-center gap-2 hover:text-gold transition">
                <Mail size={16} /><span>hello@cococabana.us</span>
              </a>
            </li>
            <li>
              <a href="tel:+10000000000" className="flex items-center gap-2 hover:text-gold transition">
                <Phone size={16} /> Available by appointment
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-[10px] tracking-luxe uppercase text-gold/70 mb-3">Follow</p>
            <SocialLinks iconSize={18} />
          </div>
        </div>
      </div>
      <div className="border-t border-gold-soft">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Coco Cabana. All rights reserved.</p>
          <p className="tracking-luxe uppercase text-gold/70">Designed with intention</p>
        </div>
      </div>
    </footer>
  );
}

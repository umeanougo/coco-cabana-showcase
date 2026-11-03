import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/coco-cabana-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background border-b border-gold-soft py-3"
          : "bg-background border-b border-gold-soft py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
          <img
            src={logo}
            alt="Coco Cabana"
            width={44}
            height={44}
            className="h-12 w-12 object-contain shrink-0 rounded-full bg-brand-deep p-1 ring-2 ring-gold/60 transition-transform duration-500 group-hover:rotate-12"
          />
          <span className="hidden sm:block min-w-0">
            <span className="block font-display text-base lg:text-lg tracking-wide text-foreground leading-tight whitespace-nowrap">Coco Cabana</span>
            <span className="hidden lg:block text-[10px] tracking-luxe text-brand uppercase leading-tight whitespace-nowrap">Events · Decor · Rentals</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 lg:gap-8 flex-1 justify-center">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[11px] lg:text-xs tracking-[0.2em] uppercase text-foreground/80 hover:text-brand transition-colors whitespace-nowrap"
              activeProps={{ className: "text-brand" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-flex items-center px-4 py-2.5 text-[11px] tracking-[0.25em] uppercase border border-brand text-brand hover:bg-brand hover:text-primary-foreground transition-all whitespace-nowrap shrink-0"
        >
          Book Now
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-brand"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold-soft bg-background">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.2em] uppercase text-foreground/80 hover:text-brand"
                activeProps={{ className: "text-brand" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-5 py-3 text-xs tracking-[0.25em] uppercase border border-brand text-brand"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

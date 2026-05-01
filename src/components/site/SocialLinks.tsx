import { Instagram, Facebook } from "lucide-react";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/cococabana.htx/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/CocoCubana",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@cococabana.htx",
    icon: TikTokIcon,
  },
  {
    label: "Pinterest",
    href: "https://es.pinterest.com/cococabanahtx/",
    icon: PinterestIcon,
  },
  {
    label: "Linktree",
    href: "https://linktr.ee/cococabana",
    icon: LinktreeIcon,
  },
] as const;

type IconProps = { size?: number; className?: string };

function TikTokIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
    </svg>
  );
}

function PinterestIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.17-.1-.95-.2-2.4.04-3.44.22-.93 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.67.97-2.92 2.17-2.92 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.26 3.78-5.51 0-2.88-2.07-4.9-5.03-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.04.4 2.15.9 2.75.1.12.11.22.08.34l-.33 1.36c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.91-7.25 4.15 0 7.38 2.96 7.38 6.91 0 4.13-2.6 7.45-6.21 7.45-1.21 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14C9.57 23.81 10.77 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
    </svg>
  );
}

function LinktreeIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.74 2v6.36l4.5-4.7 2.42 2.43-4.72 4.5H22v3.4h-6.06l4.72 4.55-2.42 2.36-6.24-6.36-6.24 6.36-2.42-2.36 4.72-4.55H2v-3.4h6.06L3.34 6.09l2.42-2.43 4.5 4.7V2h3.48zm-3.48 14.69h3.48V24h-3.48v-7.31z" />
    </svg>
  );
}

type Variant = "row" | "stack";

export function SocialLinks({
  variant = "row",
  iconSize = 18,
  className = "",
}: {
  variant?: Variant;
  iconSize?: number;
  className?: string;
}) {
  if (variant === "stack") {
    return (
      <ul className={`space-y-3 text-sm ${className}`}>
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-gold transition"
            >
              <s.icon size={iconSize} /> {s.label}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="text-foreground/80 hover:text-gold transition"
        >
          <s.icon size={iconSize} />
        </a>
      ))}
    </div>
  );
}

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: Props) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="divider-gold text-[11px] tracking-luxe uppercase mb-5">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl leading-tight">{title}</h2>
      {subtitle && <p className="mt-5 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { websitePricing } from "@/config/pricing-calculator";
export function ServiceOverview() {
  return (
    <section className="py-16 md:py-24 bg-surface" aria-labelledby="service-overview">
      <div className="container mx-auto px-6">
        <h2 id="service-overview" className="font-display text-4xl text-center">
          Choose the support you need
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-center text-muted-foreground">
          Planning, Design and À la carte décor for weddings, birthdays, showers, corporate events
          and other celebrations.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {Object.entries(websitePricing.services).map(([id, service], i) => (
            <article
              key={id}
              className={`p-8 ${["bg-tint-blue", "bg-tint-blush", "bg-tint-sage"][i]}`}
            >
              <h3 className="font-display text-3xl">{service.name}</h3>
              <p className="mt-4 leading-relaxed">{service.description}</p>
              <p className="mt-4 text-sm leading-relaxed">{service.detail}</p>
              <p className="mt-4 text-sm">
                {id === "planning"
                  ? "Calculator: selected vendors and décor, plus the applicable planning fee."
                  : id === "design"
                    ? "Calculator: selected décor, plus the design fee."
                    : "Calculator: selected décor, with no planning or design fee."}
              </p>
              <Link
                to="/pricing"
                className="inline-block mt-6 text-brand underline underline-offset-4"
              >
                Explore {service.name} pricing →
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Service scope is agreed with you. Calculator totals cover your selected items; they do not
          include every cost of an event.
        </p>
        <Link
          to="/contact"
          className="block mt-5 text-center text-brand underline underline-offset-4"
        >
          Know what you need? Start an inquiry →
        </Link>
      </div>
    </section>
  );
}

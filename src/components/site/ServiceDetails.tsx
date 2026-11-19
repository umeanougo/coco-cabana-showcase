import { Link } from "@tanstack/react-router";

const planning = [
  {
    id: "full-planning",
    title: "Full Planning",
    text: "Our Full Planning service allows you to relegate the major part of your event planning process to us. While you are part of every decision, we take the heavy lifting off your shoulders in order to allow you focus on enjoying your big moment.",
  },
  {
    id: "partial-planning",
    title: "Partial Planning",
    text: "Our Partial Planning Service is for you if you have some of your vendors hired and most of the big decisions made, but you’d like us to manage and oversee the entire event so that you can sit back, relax, and prepare to walk down the aisle.",
  },
  {
    id: "day-of-coordination",
    title: "Day-of Coordination",
    text: "The Day of Coordination service is perfect for you if you want to handle the entire planning process yourself, but are worn out at the thought of coordinating and supervising the vendors on your big day. With this service, we relieve you of that burden.",
  },
  {
    id: "destination-weddings",
    title: "Destination Weddings",
    text: "Planning a wedding in a unique location far from home? Our destination wedding service supports choosing a location, guest lodging and securing vendors.",
  },
  {
    id: "event-planning",
    title: "Event Planning",
    text: "For celebrations beyond weddings, planning brings together your theme, budget, timeline, site and equipment needs.",
  },
];

export function ServiceDetails() {
  return (
    <section className="py-16 bg-surface" aria-labelledby="service-details-heading">
      <div className="container mx-auto px-6">
        <h2 id="service-details-heading" className="font-display text-4xl text-center">
          Find the right level of support
        </h2>
        <p className="max-w-2xl mx-auto text-center mt-5 leading-relaxed">
          Explore the services behind Planning, Design and À la carte décor. Availability, scope and
          inclusions are agreed for your event; these are not fixed calculator packages.
        </p>
        <nav className="flex flex-wrap justify-center gap-5 mt-7" aria-label="Service details">
          <a href="#planning-details" className="underline underline-offset-4">
            Planning options
          </a>
          <a href="#design-details" className="underline underline-offset-4">
            Design & florals
          </a>
          <a href="#rentals" className="underline underline-offset-4">
            Décor & rentals
          </a>
        </nav>
        <div id="planning-details" className="scroll-mt-28 mt-12">
          <h3 className="font-display text-3xl mb-6">
            Planning · from the first idea to event day
          </h3>
          <p className="mb-6 leading-relaxed max-w-3xl">
            Wedding planning brings together venue selection, budget management, vendor hiring,
            guest logistics and design considerations. Choose the support that fits the decisions
            you have already made.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {planning.map((item) => (
              <article id={item.id} key={item.id} className="scroll-mt-28 bg-background p-6 md:p-8">
                <h4 className="font-display text-2xl">{item.title}</h4>
                <p className="mt-4 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div id="design-details" className="scroll-mt-28 mt-12">
          <h3 className="font-display text-3xl mb-6">Design · the look and atmosphere</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <article className="bg-background p-6 md:p-8">
              <h4 className="font-display text-2xl">Wedding & Event Décor</h4>
              <p className="mt-4 leading-relaxed">
                We work closely with you to develop themes based on your location, event type and
                style. Floral arrangements, balloon artistry, candles and accessories shape the
                atmosphere of your celebration. Table settings and spatial planning bring those
                details together.
              </p>
              <p className="mt-4 leading-relaxed">
                Choose Design when you want us to create the concept; choose À la carte décor when
                you already have a vision and need specific pieces brought to life.
              </p>
            </article>
            <article id="fresh-flowers" className="scroll-mt-28 bg-background p-6 md:p-8">
              <h4 className="font-display text-2xl">Fresh Flowers</h4>
              <p className="mt-4 leading-relaxed">
                From a botanical theme to a minimalist feel of greenery, fresh florals bring colour
                and character to an event. Our floral offering includes à la carte and package
                options; discuss the arrangements and scope you need.
              </p>
            </article>
          </div>
        </div>
        <div className="mt-8 border border-border p-6 md:p-8">
          <h3 className="font-display text-2xl">À la carte décor & rentals</h3>
          <p className="mt-4 leading-relaxed">
            Explore six flower-wall styles, our 360 Photo Booth and Luxury Candle Staging. Custom
            candlelight staging brings together the size, arrangement and atmosphere of your event.
            Ask our team about availability, installation, collection and final inclusions.
          </p>
          <div className="mt-5 flex flex-wrap gap-5">
            <a href="#rentals" className="underline">
              View flower walls
            </a>
            <a href="#photo-booth" className="underline">
              Explore the photo booth
            </a>
            <Link to="/contact" className="underline">
              View inquiry options
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

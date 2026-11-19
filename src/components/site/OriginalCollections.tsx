const collections = [
  {
    title: "Mara Villa Katy",
    detail: "Photography credited to Adrianne Michelle",
    path: "wedding-gallery",
  },
  { title: "Moyi & Josh", detail: "Photography credited to ELI CAPTURE", path: "wedding-gallery" },
  { title: "Baby Shower", detail: "Photo collection", path: "gallery" },
  { title: "Emeka’s Lavish 30th", detail: "Video credited to DEJA VU’S LENS", path: "gallery" },
  { title: "Rossy’s Birthday Bash", detail: "Event video", path: "gallery" },
  { title: "D Fash Proposal", detail: "Proposal video", path: "gallery" },
];

export function OriginalCollections() {
  return (
    <section id="original-collections" className="py-16 scroll-mt-28">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-4xl">More celebrations from our archive</h2>
        <p className="mt-5 max-w-2xl leading-relaxed">
          Explore the named photo collections and films on Coco Cabana’s original website. The links
          open the original galleries with their existing credits.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {collections.map((item) => (
            <article className="bg-surface border border-border p-6" key={item.title}>
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm">{item.detail}</p>
              <a
                href={`https://cococabana.us/pages/${item.path}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 underline underline-offset-4"
                aria-label={`View ${item.title} in the original gallery`}
              >
                View original gallery ↗
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

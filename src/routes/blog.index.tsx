import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, articleDate, PAGE_SIZE } from "@/content/blog";

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(
      1,
      Math.min(Math.ceil(articles.length / PAGE_SIZE), Math.floor(Number(search.page) || 1)),
    ),
  }),
  head: () => ({
    meta: [
      { title: "Journal | Coco Cabana Event Planning & Design" },
      {
        name: "description",
        content:
          "Event planning advice, design ideas, wedding traditions and stories from Coco Cabana. Explore the complete journal archive.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { page } = Route.useSearch();
  const pageCount = Math.ceil(articles.length / PAGE_SIZE);
  return (
    <>
      <section className="pt-36 pb-12 px-6 max-w-3xl mx-auto text-center">
        <p className="divider-gold text-xs tracking-luxe uppercase mb-5">The Coco Cabana Journal</p>
        <h1 className="font-display text-5xl md:text-7xl">
          Ideas for a <em>meaningful celebration</em>
        </h1>
        <p className="mt-6 leading-relaxed">
          Planning advice, design details and stories behind the celebrations. Explore our complete
          collection, with each article’s original publication date.
        </p>
      </section>
      <section className="bg-surface py-16" aria-label="Article archive">
        <div className="container mx-auto px-6">
          <p className="mb-8 text-sm">
            {articles.length} articles · Page {page} of {pageCount}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((article) => (
              <article
                key={article.slug}
                className="journal-card border border-border p-6 md:p-8 flex flex-col"
              >
                <p className="text-xs mb-4">{article.archive}</p>
                <h2 className="font-display text-2xl leading-snug">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: article.slug }}
                    className="hover:underline underline-offset-4"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm mt-4">
                  <time dateTime={article.published}>{articleDate(article.published)}</time> ·{" "}
                  {article.author}
                </p>
                <p className="mt-5 text-sm leading-relaxed line-clamp-3">{article.description}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: article.slug }}
                  className="mt-auto pt-6 underline underline-offset-4"
                  aria-label={`Read ${article.title}`}
                >
                  Read the article →
                </Link>
              </article>
            ))}
          </div>
          <nav className="mt-10 flex flex-wrap gap-3 justify-center" aria-label="Blog pages">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                to="/blog"
                search={{ page: n }}
                aria-current={n === page ? "page" : undefined}
                className={`selection-control px-5 py-3 ${n === page ? "is-selected" : ""}`}
                aria-label={`Page ${n}`}
              >
                {n}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}

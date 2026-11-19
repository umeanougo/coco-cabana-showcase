import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { articles, articleDate, relatedArticles } from "@/content/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: article }) =>
    article
      ? {
          meta: [
            { title: `${article.title} | Coco Cabana` },
            { name: "description", content: article.description },
            { property: "og:title", content: article.title },
            { property: "og:description", content: article.description },
            { property: "og:type", content: "article" },
            { property: "article:published_time", content: article.published },
            { name: "author", content: article.author },
          ],
          // The original remains canonical until an approved production migration.
          links: [{ rel: "canonical", href: article.originalUrl }],
        }
      : {},
  component: BlogArticle,
});

function BlogArticle() {
  const article = Route.useLoaderData();
  const related = relatedArticles(article.slug);
  return (
    <>
      <article className="pt-32 md:pt-40 pb-16 px-6 max-w-3xl mx-auto">
        <Link to="/blog" search={{ page: 1 }} className="underline underline-offset-4">
          ← All articles
        </Link>
        <header className="mt-10 mb-10">
          <p className="text-sm mb-4">{article.archive}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight break-words">
            {article.title}
          </h1>
          <p className="mt-6 text-sm">
            By {article.author} ·{" "}
            <time dateTime={article.published}>{articleDate(article.published)}</time>
          </p>
        </header>
        {/* Static, allowlisted markup extracted from Coco Cabana-owned source articles. No user HTML. */}
        <div className="article-copy" dangerouslySetInnerHTML={{ __html: article.html }} />
        <aside className="mt-10 border-t border-border pt-6 text-sm leading-relaxed">
          <p>
            Originally published by Coco Cabana. Dates and article wording are retained; historical
            advice and offers may have changed.
          </p>
          <a
            className="inline-block mt-3 underline underline-offset-4"
            href={article.originalUrl}
            target="_blank"
            rel="noreferrer"
          >
            View the original article and photography ↗
          </a>
        </aside>
      </article>
      <section className="bg-surface py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl">Continue exploring</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/blog/$slug"
                params={{ slug: item.slug }}
                className="border border-border p-6 font-display text-xl underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link to="/services" className="underline">
              Explore our services
            </Link>
            <Link to="/pricing" className="underline">
              Build a starting budget
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

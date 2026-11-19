import records from "./articles.json";

export const articles = records;
export const PAGE_SIZE = 6;
export const articleDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

// Relationships are editorial, based on the subjects of the original articles.
const relatedGroups = [
  [
    "event-planning-checklist",
    "event-planning-tips",
    "how-to-choose-the-right-event-planner-for-your-event",
    "10-budget-friendly-ideas-to-make-events-memorable",
  ],
  [
    "10-travel-planning-tips-for-your-destination-weddings",
    "how-to-manage-wedding-planning-stress-and-stay-organised",
    "top-wedding-planning-mistakes-to-avoid-for-your-big-day",
    "eru-iyawo-a-timeless-yoruba-wedding-tradition",
  ],
  [
    "why-i-created-custom-foam-balloon-sculptures-instead",
    "more-than-a-grand-opening-how-we-turned-a-nail-salon-into-a-valentines-day-love-letter",
    "recap-of-planning-a-stunning-event",
    "planning-the-perfect-memorable-baby-shower",
  ],
  [
    "event-decor-trends",
    "10-creative-ways-to-personalize-your-event",
    "top-5-reasons-your-event-needs-a-photo-booth",
  ],
];
export function relatedArticles(slug: string) {
  const group = relatedGroups.find((g) => g.includes(slug)) ?? [];
  return articles
    .filter((article) => article.slug !== slug && group.includes(article.slug))
    .slice(0, 3);
}

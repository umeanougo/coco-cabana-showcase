import { scheduledFeeCents, toCents } from "./fee-schedule";
import { z } from "zod";
const text = z.string().trim().min(1).max(200);
const copy = z.string().max(4000);
const id = z
  .string()
  .regex(
    /^[a-z][a-z0-9_-]{0,79}$/,
    "Use a stable lowercase ID with letters, numbers, hyphens or underscores.",
  );
const amount = z
  .number()
  .finite()
  .min(0)
  .max(10000000)
  .refine(
    (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001,
    "Use at most two decimal places.",
  );
const positive = z.number().int().min(1).max(10000);
const tier = z
  .object({ minimum: amount, maximum: amount })
  .strict()
  .refine((t) => t.minimum <= t.maximum, "Minimum price must not exceed maximum price.");
const tierText = z.object({ economic: text, average: text, lux: text }).strict();
const service = z
  .object({ name: text, description: copy, detail: copy, referenceMinimum: amount })
  .strict();
const example = z
  .object({
    description: copy,
    approval: z.enum(["approved", "pending"]),
    image: z
      .object({
        src: z
          .string()
          .url()
          .refine((s) => s.startsWith("https://"), "Images must use HTTPS."),
        alt: text,
        approval: z.enum(["approved", "pending"]),
      })
      .strict()
      .optional(),
  })
  .strict();
export const itemSchema = z
  .object({
    id,
    name: text,
    description: copy,
    categoryId: z.enum(["planning", "decor", "specialty"]),
    displayOrder: z.number().int().min(0).max(10000),
    hidden: z.boolean(),
    calculationType: z.enum(["flat", "per_guest", "per_table", "quantity", "custom_quote"]),
    status: z.enum(["reference", "approved", "missing"]),
    tiers: z
      .object({ economic: tier.optional(), average: tier.optional(), lux: tier.optional() })
      .strict(),
    version: text,
    audiences: z
      .array(z.enum(["client", "planner"]))
      .min(1)
      .max(2),
    services: z
      .array(z.enum(["planning", "design", "alacarte"]))
      .min(1)
      .max(3),
    inclusions: copy,
    exclusions: copy,
    pricingNotes: copy,
    examples: z
      .object({
        economic: example.optional(),
        average: example.optional(),
        lux: example.optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((i, ctx) => {
    if (i.calculationType === "custom_quote" && i.status !== "missing")
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "Custom quote items must use missing/custom quote status.",
      });
    if (
      i.status !== "missing" &&
      ["economic", "average", "lux"].some((t) => !i.tiers[t as keyof typeof i.tiers])
    )
      ctx.addIssue({
        code: "custom",
        path: ["tiers"],
        message: "Provide all three tier ranges, or mark the item missing/custom quote.",
      });
    if (
      new Set(i.audiences).size !== i.audiences.length ||
      new Set(i.services).size !== i.services.length
    )
      ctx.addIssue({ code: "custom", message: "Availability mappings must be unique." });
  });
export const configurationSchema = z
  .object({
    schemaVersion: z.literal(1),
    catalogVersion: text,
    items: z.array(itemSchema).min(1).max(500),
    categories: z
      .array(
        z
          .object({
            id: z.enum(["planning", "decor", "specialty"]),
            name: text,
            displayOrder: z.number().int().min(0).max(10000),
          })
          .strict(),
      )
      .length(3),
    tierLabels: tierText,
    tierDescriptions: tierText,
    assumptions: z
      .object({
        currency: z.literal("USD"),
        guestsPerTable: positive,
        minGuests: positive,
        maxGuests: positive,
        minQuantity: positive,
        maxQuantity: positive,
      })
      .strict(),
    services: z.object({ planning: service, design: service, alacarte: service }).strict(),
    eventTypes: z.array(text).min(1).max(30),
    disclaimer: copy,
    exclusions: copy,
    fees: z
      .object({
        lowerThreshold: amount,
        upperThreshold: amount,
        lowerPercent: z.number().finite().min(0).max(100),
        upperPercent: z.number().finite().min(0).max(100),
        flatAmount: amount,
      })
      .strict(),
  })
  .strict()
  .superRefine((c, ctx) => {
    const fail = (path: string[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    if (new Set(c.items.map((i) => i.id)).size !== c.items.length)
      fail(["items"], "Item IDs must be unique.");
    if (new Set(c.categories.map((i) => i.id)).size !== 3)
      fail(["categories"], "Keep each of the three established category IDs exactly once.");
    if (c.assumptions.minGuests > c.assumptions.maxGuests)
      fail(["assumptions"], "Minimum guests must not exceed maximum guests.");
    if (c.assumptions.minQuantity > c.assumptions.maxQuantity)
      fail(["assumptions"], "Minimum quantity must not exceed maximum quantity.");
    if (c.fees.lowerThreshold <= 0 || c.fees.lowerThreshold >= c.fees.upperThreshold)
      fail(["fees"], "Fee thresholds must be positive and strictly increasing.");
    // Nonnegative percentages make each band nondecreasing. Checking the last
    // cent in each inclusive band against the first cent in the next is enough
    // to establish monotonic totals over every possible subtotal range.
    else if (Object.values(c.fees).every(Number.isFinite)) {
      for (const [threshold, settings] of [
        ["lowerThreshold", "the lower threshold, lower percentage or middle flat fee"],
        ["upperThreshold", "the upper threshold, upper percentage or middle flat fee"],
      ] as const) {
        const boundary = toCents(c.fees[threshold]);
        const before = boundary + scheduledFeeCents(boundary, c.fees);
        const after = boundary + 1 + scheduledFeeCents(boundary + 1, c.fees);
        if (after < before) {
          const dollars = (cents: number) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(cents / 100);
          fail(
            ["fees", threshold],
            `Final total decreases across the ${threshold === "lowerThreshold" ? "lower" : "upper"} threshold at ${dollars(boundary)}: ${dollars(before)} becomes ${dollars(after)} when the subtotal increases by one cent. Adjust ${settings} so the total does not decrease.`,
          );
        }
      }
    }
  });
export type PricingConfiguration = z.infer<typeof configurationSchema>;
export type ConfiguredItem = z.infer<typeof itemSchema>;
export const draftSchema = z
  .object({
    schemaVersion: z.literal(1),
    baseCatalogVersion: text,
    lastSavedAt: z.string().datetime().nullable(),
    exportedAt: z.string().datetime().optional(),
    configuration: configurationSchema,
  })
  .strict();
export type PricingDraft = z.infer<typeof draftSchema>;
export const pricingDraftKey = "coco-cabana:pricing-manager:draft:v1";
export function explainValidation(error: z.ZodError) {
  return error.issues
    .slice(0, 12)
    .map((i) => `${i.path.join(" → ") || "Configuration"}: ${i.message}`)
    .join("\n");
}
export function readPricingImport(raw: string): PricingDraft {
  if (raw.length > 2000000) throw new Error("Pricing file is too large (maximum 2 MB).");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Choose a valid pricing JSON file.");
  }
  const parsed = draftSchema.safeParse(data);
  if (!parsed.success) throw new Error(explainValidation(parsed.error));
  return parsed.data;
}
export function savePricingDraft(
  storage: Pick<Storage, "setItem">,
  draft: PricingDraft,
  now = new Date().toISOString(),
) {
  const parsed = draftSchema.parse({ ...draft, lastSavedAt: now });
  storage.setItem(pricingDraftKey, JSON.stringify(parsed)); // Throw before the UI changes or claims success.
  return parsed;
}
export function pricingChanges(before: PricingConfiguration, after: PricingConfiguration) {
  const added = after.items.filter((i) => !before.items.some((o) => o.id === i.id)).length;
  const removed = before.items.filter((i) => !after.items.some((o) => o.id === i.id)).length;
  const changed = after.items.filter((i) => {
    const old = before.items.find((o) => o.id === i.id);
    return old && JSON.stringify(old) !== JSON.stringify(i);
  }).length;
  const settings = (Object.keys(after) as (keyof PricingConfiguration)[]).filter(
    (k) => k !== "items" && JSON.stringify(before[k]) !== JSON.stringify(after[k]),
  );
  return `${added} added, ${changed} changed, ${removed} removed items. Settings: ${settings.join(", ") || "unchanged"}.`;
}

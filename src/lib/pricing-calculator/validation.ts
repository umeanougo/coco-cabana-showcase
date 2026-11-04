import type { PricingConfiguration } from "./configuration";
import { z } from "zod";
import {
  pricingItems,
  websitePricing,
  applicable,
  type PricingItem,
} from "../../config/pricing-calculator";
export const basicsSchema = z.object({
  audience: z.enum(["client", "planner"]),
  service: z.enum(["planning", "design", "alacarte"]),
  eventType: z.string().min(1).max(100),
  eventDate: z.string().trim().max(100),
  location: z.string().trim().max(160),
  guestCount: z.number().finite().min(0).max(1000000),
  // Bounded identity data may retain invalid inactive inputs for later recovery.
  ownFeePercent: z.number().finite().min(-1000000).max(1000000),
});
export const selectionSchema = z.object({
  id: z.string().min(1).max(100),
  tier: z.enum(["economic", "average", "lux"]),
  quantity: z.number().finite().min(-1000000).max(1000000),
});
export const selectionsSchema = z
  .array(selectionSchema)
  .max(100)
  .refine((v) => new Set(v.map((i) => i.id)).size === v.length, "Duplicate item.");
export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(40),
  businessName: z.string().trim().max(160),
  instagram: z.string().trim().max(100),
  clientPurpose: z.enum(["current", "exploring"]),
  marketingConsent: z.boolean(),
});
export const submissionSchema = z.object({
  reference: z.string().uuid(),
  catalogVersion: z.string().min(1).max(100).optional(),
  basics: basicsSchema,
  selections: selectionsSchema.refine((v) => v.length > 0),
  contact: contactSchema,
  attribution: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
    })
    .default({}),
});
export type Basics = z.infer<typeof basicsSchema>;
export type Selection = z.infer<typeof selectionSchema>;
export type Submission = z.infer<typeof submissionSchema>;

export function scopeIssues(
  basics: Basics,
  selections: Selection[],
  catalog: PricingItem[] = pricingItems,
  config: PricingConfiguration = websitePricing,
) {
  const { assumptions } = config;
  const guestError = `Enter ${assumptions.minGuests}–${assumptions.maxGuests.toLocaleString("en-US")} whole-number guests.`;
  const issues: { field: string; message: string }[] = [];
  const base = basicsSchema.safeParse(basics);
  if (!base.success)
    for (const issue of base.error.issues)
      issues.push({
        field: String(issue.path[0]),
        message: issue.path[0] === "guestCount" ? guestError : issue.message,
      });
  if (
    !Number.isInteger(basics.guestCount) ||
    basics.guestCount < assumptions.minGuests ||
    basics.guestCount > assumptions.maxGuests
  )
    issues.push({ field: "guestCount", message: guestError });
  if (!config.eventTypes.includes(basics.eventType))
    issues.push({ field: "eventType", message: "Choose a current event type." });
  const bounded = selectionsSchema.safeParse(selections);
  if (!bounded.success)
    issues.push({
      field: "selections",
      message: "Check selection IDs and quantities; duplicate items are not allowed.",
    });
  if (
    basics.audience === "planner" &&
    basics.service === "planning" &&
    (basics.ownFeePercent < 0 ||
      basics.ownFeePercent > 100 ||
      Math.abs(basics.ownFeePercent * 100 - Math.round(basics.ownFeePercent * 100)) >= 1e-8)
  )
    issues.push({
      field: "ownFeePercent",
      message: "Enter a planning percentage from 0–100 with up to two decimal places.",
    });
  for (const s of selections) {
    const item = catalog.find((i) => i.id === s.id);
    if (!item) {
      issues.push({
        field: s.id,
        message: "This item is no longer available. Review current pricing.",
      });
      continue;
    }
    if (!applicable(item, basics.audience, basics.service)) continue;
    if (
      item.calculationType === "quantity" &&
      (!Number.isInteger(s.quantity) ||
        s.quantity < assumptions.minQuantity ||
        s.quantity > assumptions.maxQuantity)
    )
      issues.push({
        field: s.id,
        message: `Enter ${assumptions.minQuantity}–${assumptions.maxQuantity} whole-number units for ${item.name}.`,
      });
    if (item.status !== "missing" && !item.tiers[s.tier])
      issues.push({ field: s.id, message: `Choose an available tier for ${item.name}.` });
  }
  return issues;
}

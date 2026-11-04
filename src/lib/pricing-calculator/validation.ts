import { z } from "zod";
import {
  eventTypes,
  venueStatuses,
  planningStages,
  pricingItems,
  assumptions,
} from "../../config/pricing-calculator";
export const basicsSchema = z.object({
  eventType: z.string().refine((v) => eventTypes.includes(v)),
  eventDate: z.string().trim().max(100),
  location: z.string().trim().min(1, "Enter your event city or location.").max(160),
  guestCount: z.number().int().min(1).max(assumptions.maxGuests),
  tableCount: z.number().int().min(1).max(10000).optional(),
  venueStatus: z.string().refine((v) => venueStatuses.includes(v)),
  planningStage: z.string().refine((v) => planningStages.includes(v)),
  desiredBudget: z.number().min(0).max(100000000).optional(),
});
export const selectionSchema = z.object({
  id: z.string().refine((v) => pricingItems.some((i) => i.id === v && i.active)),
  tier: z.enum(["essential", "signature", "luxury"]),
  quantity: z.number().int().min(1).max(10000),
});
export const selectionsSchema = z
  .array(selectionSchema)
  .max(100)
  .refine((v) => new Set(v.map((i) => i.id)).size === v.length);
export const submissionSchema = z.object({
  reference: z.string().uuid(),
  basics: basicsSchema,
  selections: selectionsSchema.refine((v) => v.length > 0),
  contact: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40),
    contactPermission: z.boolean(),
    marketingConsent: z.boolean(),
  }),
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

export type Tier = "essential" | "signature" | "luxury";
export type CalculationType =
  "per_guest" | "per_table" | "per_item" | "flat" | "per_hour" | "percentage" | "custom_quote";
export type PricingItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  active: boolean;
  calculationType: CalculationType;
  serviceFeeEligible: boolean;
  percentageBaseIds?: string[];
  tiers: Partial<Record<Tier, { minimum: number; maximum: number; description: string }>>;
};
export const tierLabels = { essential: "Essential", signature: "Signature", luxury: "Luxury" };
export const tierDescriptions = {
  essential: "A considered foundation",
  signature: "An elevated finish",
  luxury: "A statement setting",
};
export const categories = [
  {
    id: "planning",
    name: "Planning and vendors",
    items: [
      "Event planning",
      "Event coordination",
      "Venue",
      "Catering",
      "Drinks or bar",
      "DJ",
      "MC or host",
      "Photography",
      "Videography",
      "Entertainment",
      "Security",
      "Staffing",
      "Transportation",
    ],
  },
  {
    id: "decor",
    name: "Décor and design",
    items: [
      "Event design",
      "Backdrop",
      "Floral centrepieces",
      "Floral installations",
      "Entrance sign",
      "Welcome area",
      "Stage design",
      "Sweetheart table",
      "Guest-table décor",
      "Linens",
      "Chairs",
      "Tables",
      "Lighting",
      "Draping",
      "Luxury candle staging",
      "Custom fabrication",
      "Cultural décor",
      "Other décor",
    ],
  },
  {
    id: "rentals",
    name: "Rentals and enhancements",
    items: [
      "Flower wall",
      "Neon sign",
      "360 photo booth",
      "Specialty seating",
      "Lounge furniture",
      "Charger plates",
      "Decorative structures",
      "Custom signage",
      "Other rentals",
    ],
  },
];
export const pricingItems: PricingItem[] = categories.flatMap((c) =>
  c.items.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    categoryId: c.id,
    name,
    description:
      name === "Chairs"
        ? "One chair per guest. Final style and availability confirmed during consultation."
        : "Scope and pricing are tailored to your event during consultation.",
    active: true,
    calculationType: name === "Chairs" ? ("per_guest" as const) : ("custom_quote" as const),
    serviceFeeEligible: false,
    tiers:
      name === "Chairs"
        ? {
            essential: { minimum: 4, maximum: 10, description: tierDescriptions.essential },
            signature: { minimum: 10, maximum: 14, description: tierDescriptions.signature },
            luxury: { minimum: 14, maximum: 28, description: tierDescriptions.luxury },
          }
        : {},
  })),
);
export const assumptions = { currency: "USD", guestsPerTable: 8, maxGuests: 10000 };
export const serviceFee = {
  active: true,
  rate: 0.2,
  minimum: 0,
  eligibleCategoryIds: [] as string[],
  excludedItemIds: [] as string[],
  eligibilityConfirmed: false,
  display: "separate" as const,
  explanation:
    "Coco Cabana’s planning and management fee is calculated against applicable event spending. Your final fee depends on the services selected, event complexity, confirmed scope, and vendor requirements.",
};
export const disclaimer =
  "This estimate is a preliminary planning range based on the information and selections provided. It is not a proposal, quote, or guarantee of availability. Final pricing is confirmed after Coco Cabana reviews your event scope, venue, design requirements, logistics, date, vendor availability, taxes, and applicable fees.";
export const exclusions =
  "Taxes, delivery, setup, teardown, travel, venue charges, permits, security, gratuities, rush and holiday charges, destination costs, custom fabrication, vendor minimums, damage and rental deposits, and additional service charges are not included unless explicitly priced.";
export const eventTypes = [
  "Wedding",
  "Birthday or milestone",
  "Baby shower",
  "Corporate event",
  "Gala or nonprofit event",
  "Proposal or engagement",
  "Cultural or traditional celebration",
  "Other",
];
export const venueStatuses = [
  "Venue booked",
  "Considering venues",
  "Need venue support",
  "Event at a private residence",
  "Not sure yet",
];
export const planningStages = [
  "Just exploring",
  "Choosing a date",
  "Venue selected",
  "Vendors being selected",
  "Event already in planning",
  "Need urgent support",
];

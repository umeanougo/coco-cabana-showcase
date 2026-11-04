import catalog from "./pricing-catalog.json";
export type Tier = "economic" | "average" | "lux";
export type Audience = "client" | "planner";
export type Service = "planning" | "design" | "alacarte";
export type Category = "planning" | "decor" | "specialty";
export type TierExample = {
  description: string;
  approval: "approved" | "pending";
  image?: { src: string; alt: string; approval: "approved" | "pending" };
};
export type PricingItem = {
  examples?: Partial<Record<Tier, TierExample>>;
  id: string;
  name: string;
  categoryId: Category;
  calculationType: "flat" | "per_guest" | "per_table" | "quantity" | "custom_quote";
  status: "approved" | "reference" | "missing";
  tiers: Partial<Record<Tier, { minimum: number; maximum: number }>>;
  version: string;
  audiences: Audience[];
  services: Service[];
  exclusions: string;
};
export const pricingVersion = "christine-reference-2026-11-04-v2";
export const tierLabels = { economic: "Economic", average: "Average", lux: "Lux" };
export const tierDescriptions = {
  economic: "Beautiful basics; smart, budget-friendly choices",
  average: "The most popular range for Houston events",
  lux: "Premium finishes, statement pieces, high-end vendors",
};
export const exclusions =
  "Taxes, delivery, setup, teardown and travel are not calculated here. Their treatment and final inclusions require confirmation. Unpriced selections are additional, not free.";
export const pricingItems: PricingItem[] = (
  catalog as Omit<PricingItem, "version" | "audiences" | "services" | "exclusions">[]
).map((item) => ({
  ...item,
  version: pricingVersion,
  audiences: ["client", "planner"],
  services: item.categoryId === "planning" ? ["planning"] : ["planning", "design", "alacarte"],
  exclusions,
}));
export const categories: { id: Category; name: string }[] = [
  { id: "planning", name: "Planning vendors" },
  { id: "decor", name: "Décor elements" },
  { id: "specialty", name: "Specialty" },
];
export const assumptions = {
  currency: "USD",
  guestsPerTable: 8,
  minGuests: 10,
  maxGuests: 1000,
  maxQuantity: 30,
};
export const eventTypes = [
  "Wedding",
  "Birthday",
  "Baby shower",
  "Corporate event",
  "Traditional / Eru Iyawo",
  "Other celebration",
];
export const disclaimer =
  "This is an estimate to help you plan, not a quote. Final pricing depends on your date, venue and design.";
export const feeExplanation =
  "20% of the selected subtotal up to $25,000; a flat $5,000 above $25,000 through $50,000; 10% above $50,000. Each end of your range is calculated separately.";
export const services = {
  planning: {
    name: "Planning",
    description: "We plan and design your whole event, start to finish.",
    detail:
      "Sourcing and managing vendors, building your timeline, designing the look and running the day.",
    referenceMinimum: 10000,
  },
  design: {
    name: "Design",
    description: "Our design vision, sourced and installed. You handle the planning.",
    detail:
      "We create the design concept, present a lookbook, then source, build and install every detail.",
    referenceMinimum: 5000,
  },
  alacarte: {
    name: "À la carte décor",
    description: "You know exactly what you want. We bring it to life.",
    detail:
      "Send us your inspiration. No design service, just the pieces you choose, set up beautifully.",
    referenceMinimum: 3000,
  },
};
export const serviceName = (audience: Audience, service: Service) =>
  audience === "planner" && service === "planning" ? "Full event budget" : services[service].name;
export const applicable = (item: PricingItem, audience: Audience, service: Service) =>
  item.audiences.includes(audience) && item.services.includes(service);

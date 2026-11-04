import catalog from "./pricing-catalog.json";
import {
  configurationSchema,
  type PricingConfiguration,
  type ConfiguredItem,
} from "../lib/pricing-calculator/configuration";
export type Tier = "economic" | "average" | "lux";
export type Audience = "client" | "planner";
export type Service = "planning" | "design" | "alacarte";
export type Category = "planning" | "decor" | "specialty";
export type PricingItem = Omit<
  ConfiguredItem,
  "description" | "inclusions" | "pricingNotes" | "displayOrder" | "hidden"
> &
  Partial<
    Pick<ConfiguredItem, "description" | "inclusions" | "pricingNotes" | "displayOrder" | "hidden">
  >;
export type TierExample = NonNullable<ConfiguredItem["examples"]>[Tier];
export const websitePricing = configurationSchema.parse(catalog);
export const pricingVersion = websitePricing.catalogVersion;
export const {
  tierLabels,
  tierDescriptions,
  exclusions,
  categories,
  assumptions,
  eventTypes,
  disclaimer,
  services,
} = websitePricing;
export const pricingItems: PricingItem[] = websitePricing.items;
export const feeDescription = (config: PricingConfiguration) =>
  `${config.fees.lowerPercent}% of the selected subtotal up to $${config.fees.lowerThreshold.toLocaleString("en-US")}; a flat $${config.fees.flatAmount.toLocaleString("en-US")} above $${config.fees.lowerThreshold.toLocaleString("en-US")} through $${config.fees.upperThreshold.toLocaleString("en-US")}; ${config.fees.upperPercent}% above $${config.fees.upperThreshold.toLocaleString("en-US")}. Each end of your range is calculated separately.`;
export const feeExplanation = feeDescription(websitePricing);
export const serviceName = (audience: Audience, service: Service, config = websitePricing) =>
  audience === "planner" && service === "planning"
    ? "Full event budget"
    : config.services[service].name;
export const applicable = (item: PricingItem, audience: Audience, service: Service) =>
  !item.hidden && item.audiences.includes(audience) && item.services.includes(service);

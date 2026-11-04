import { createContext, useContext } from "react";
import { websitePricing, feeDescription, serviceName } from "@/config/pricing-calculator";
import type { PricingConfiguration } from "@/lib/pricing-calculator/configuration";
export const PricingContext = createContext<{
  configuration: PricingConfiguration;
  localPreview: boolean;
}>({ configuration: websitePricing, localPreview: false });
export function usePricing() {
  const { configuration, localPreview } = useContext(PricingContext);
  return {
    ...configuration,
    configuration,
    localPreview,
    pricingItems: configuration.items,
    feeExplanation: feeDescription(configuration),
    serviceName: (
      audience: Parameters<typeof serviceName>[0],
      service: Parameters<typeof serviceName>[1],
    ) => serviceName(audience, service, configuration),
  };
}

// This repository currently deploys to the designated stakeholder test site only.
// Trusted build configuration, never a visitor flag. Change only in a reviewed launch release.
export const reviewEnvironment = {
  enabled: true,
  origin: "https://cococabana.easeops.ca",
  revision: "corrected-review-2026-11-04",
  hostedSaving: false,
} as const;
export const referencePricingEnabled = reviewEnvironment.enabled || import.meta.env.DEV;
export const hostedSavingUnavailable =
  reviewEnvironment.enabled && !import.meta.env.DEV && !reviewEnvironment.hostedSaving;
export const hostedSavingMessage =
  "Saving is unavailable on this test website. Your selections stay in this tab. No estimate has been saved and no email has been sent.";

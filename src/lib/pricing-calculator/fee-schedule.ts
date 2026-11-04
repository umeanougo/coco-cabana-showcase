// Independent of configuration loading so validation and calculation share exactly
// the same integer-cent conversions, inclusive bands and percentage rounding.
export type FeeSchedule = {
  lowerThreshold: number;
  upperThreshold: number;
  lowerPercent: number;
  upperPercent: number;
  flatAmount: number;
};
export const toCents = (amount: number) => Math.round(amount * 100);
export const scheduledFeeCents = (subtotal: number, fees: FeeSchedule) =>
  subtotal <= toCents(fees.lowerThreshold)
    ? Math.round((subtotal * fees.lowerPercent) / 100)
    : subtotal <= toCents(fees.upperThreshold)
      ? toCents(fees.flatAmount)
      : Math.round((subtotal * fees.upperPercent) / 100);

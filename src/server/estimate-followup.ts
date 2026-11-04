// Policy only. No scheduler or outbound sender is installed/enabled in this pass.
export type FollowupLead = {
  audience: "client" | "planner";
  acceptedAt: number | null;
  marketingConsent: boolean;
  unsubscribed: boolean;
  bookingStatus: "unknown" | "not_booked" | "booked";
  sentDays: number[];
};
export type FollowupReadiness = {
  enabled: boolean;
  providerConfigured: boolean;
  copyApproved: boolean;
  bookingSignalReliable: boolean;
  suppressionReady: boolean;
  videoApproved: boolean;
};
export function dueFollowups(lead: FollowupLead, readiness: FollowupReadiness, now: number) {
  if (
    !Object.values(readiness).every(Boolean) ||
    !lead.acceptedAt ||
    !lead.marketingConsent ||
    lead.unsubscribed ||
    lead.bookingStatus !== "not_booked"
  )
    return [];
  return [2, 7]
    .filter((day) => !lead.sentDays.includes(day) && now >= lead.acceptedAt! + day * 86400000)
    .map((day) => ({
      day,
      audience: lead.audience,
      content:
        day === 2
          ? "Questions about your estimate? + consultation link"
          : "Belema services/packages video + consultation link",
    }));
}
export const followupReadiness: FollowupReadiness = {
  enabled: false,
  providerConfigured: false,
  copyApproved: false,
  bookingSignalReliable: false,
  suppressionReady: false,
  videoApproved: false,
};

import { reviewEnvironment } from "./review-environment";
// A real session link must be verified by the team. An inquiry URL is not a scheduler.
export function verifiedScheduler(url: string | undefined, verified: boolean) {
  if (!url || !verified) return "";
  try {
    const u = new URL(url);
    if (
      u.protocol !== "https:" ||
      !(u.hostname === "honeybook.com" || u.hostname.endsWith(".honeybook.com")) ||
      u.pathname.includes("/widget/") ||
      u.username ||
      u.password
    )
      return "";
    return u.href;
  } catch {
    return "";
  }
}
export const consultationUrl = reviewEnvironment.enabled
  ? ""
  : verifiedScheduler(
      import.meta.env.VITE_HONEYBOOK_SCHEDULER_URL,
      import.meta.env.VITE_HONEYBOOK_SCHEDULER_VERIFIED === "true",
    );

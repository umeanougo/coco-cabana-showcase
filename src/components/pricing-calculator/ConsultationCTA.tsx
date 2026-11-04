import { consultationUrl } from "@/config/consultation";
import { track } from "@/lib/pricing-calculator/analytics";
export function ConsultationCTA({ planner = false }: { planner?: boolean }) {
  return (
    <section className="cc-consult">
      <h3>{planner ? "Let’s talk about your clients’ events." : "Your vision, our expertise."}</h3>
      <p>
        {planner
          ? "You’ve got the planning covered. Let’s talk about how we can support you with décor and design, and our Planner Partner Program."
          : "Book a free consultation and we’ll walk you through how to make this budget work."}
      </p>
      {consultationUrl ? (
        <a
          className="cc-button"
          href={consultationUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("consultation_clicked")}
        >
          Book a free consultation
        </a>
      ) : (
        <p className="cc-note">
          Online consultation scheduling is not connected in this preview. No appointment has been
          booked.
        </p>
      )}
    </section>
  );
}

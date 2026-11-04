> **Superseded for the current calculator:** see [hosted review configuration](hosted-review.md). This document describes the earlier scaffold.

# Event Budget Calculator handoff

Implemented at `/pricing-calculator` in the existing Coco Cabana Showcase repository. No separate application or hosting project was created. Changes are on `feat/event-budget-calculator`; production has not been deployed.

## Inspection and implementation map

| Finding                                                              | Implementation                                                                                                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| React, TanStack Start file routes, Vite, Cloudflare/Nitro deployment | New page and same-origin POST route; retained existing build configuration with Cloudflare import externalization                          |
| Cream, espresso, lavender, serif brand system                        | Compact service rows, segmented radio tiers, responsive form, desktop summary and accessible mobile drawer                                 |
| HoneyBook URL repeated on Contact                                    | `src/config/site.ts`; existing forms retained, no unsupported prefill                                                                      |
| No database, email, analytics provider or Calendly configuration     | D1 migration, server-side Resend adapter, signed optional webhook and neutral browser analytics events; honest missing-configuration state |
| Existing shadcn drawer available                                     | Reused Vaul drawer with accessible title, close action and scrollable contents                                                             |
| Fake telephone and public developer video placeholder                | Removed; appointment information retained                                                                                                  |

## Files

- `src/config/pricing-calculator.ts`: categories, approved prices, tiers, fee eligibility, assumptions and disclaimer.
- `src/config/site.ts`: central HoneyBook, Calendly, website origin and contact details.
- `src/lib/pricing-calculator/`: pure calculation engine, Zod validation, analytics adapter.
- `src/components/pricing-calculator/`: shell/progress/session persistence, event fields, service selection, summary, email and consultation.
- `src/routes/pricing-calculator.tsx`: SEO metadata, canonical and automatically split route.
- `src/routes/api.pricing-estimates.ts`: POST-only server integration.
- `src/server/`: validated persistence/delivery handler and escaped branded HTML email.
- `migrations/0001_pricing_estimates.sql`: protected D1 storage and rate limits.
- `.env.example`, `tests/pricing.test.ts`, `scripts/test-pricing.mjs`, screenshots and this guide.
- Header, Footer, Home, Services, Contact, Portfolio, root layout and stylesheet updated. About, Reveal and SectionHeading received formatting-only fixes for existing lint errors. Generated route tree updated.

## Pricing and calculation rules

Only chairs have published rates: Essential $4–10, Signature $10–14, Luxury $14–28, each per guest. USD is an explicit assumption based on the Houston business; Christine must confirm it. Other services remain consultation-only and never contribute an invented number. Candle staging has one item in Décor to avoid duplicate charging.

All rates are centralized. Per-guest, per-table, per-item, per-hour and flat calculations use the relevant quantity. Missing table count uses eight guests per table, rounded up. Percentage items use explicit `percentageBaseIds`, exclude other percentage rows, and interpret rates as percentage points (10 = 10%). Totals use integer cents internally. Target budget is context, not a pricing multiplier.

The configurable fee is 20%, separated from subtotal. Eligible items/categories and exclusions are supported, with an optional minimum. No eligibility was provided, so all items start ineligible and the UI says “To be confirmed.” Do not enable eligibility without approval. The numeric range prominently excludes unpriced services, unconfirmed fees and other exclusions.

## State and lead handling

Versioned session storage retains valid draft event details, selections, step, opaque reference and allowlisted UTM attribution through refresh in the same tab. It does not store contact form fields. Closing the tab ends ordinary session storage; browser session restore can retain it. Storage failures display a warning. Event/selection edits rotate the reference. A reference submitted with different contact details returns an explicit conflict; edit a selection to obtain a new reference. Failed sending retains selections and allows print/retry.

The server validates bounded JSON, rejects foreign origins, recomputes totals, limits submissions to ten per IP/hour using D1, and writes a unique opaque public reference. The JSON payload contains event/contact fields, consent flags, selected tiers/quantities, recomputed totals, custom items, assumptions, timestamp, attribution and source. Public list/read/update endpoints do not exist. Cloudflare account permissions protect administrative access.

Retries with the same reference and payload reuse one record and the same Resend idempotency key. Accepted sends return without re-sending. Pending retries expire after one hour, inside the provider's idempotency window. UI success requires provider acceptance; acceptance is not proof of inbox delivery. Delivery/bounce tracking needs a future authenticated provider callback.

## Enable production services

1. In the existing deployment account, create a Cloudflare D1 database, bind it as `ESTIMATES_DB`, and apply `migrations/0001_pricing_estimates.sql`. Add the real binding to the retained Wrangler configuration; verify that Lovable's deployment carries the binding through Nitro. No database was provisioned in this task.
2. Configure server-only `SITE_ORIGIN` as the exact public origin, `RESEND_API_KEY` and `ESTIMATE_FROM_EMAIL` using a verified sender domain. Keep keys out of all `VITE_` variables.
3. Set public `VITE_SITE_URL` to the same origin. Until supplied, the page uses a route-relative canonical. Set `VITE_COCO_CABANA_CALENDLY_URL` and server `COCO_CABANA_CALENDLY_URL` to the approved booking link. Missing Calendly hides the button and logs a development-only note.
4. Optional: set `EASEOPS_ESTIMATE_WEBHOOK_URL` and `EASEOPS_ESTIMATE_WEBHOOK_SECRET`. The handler sends the saved record, reference and consent state after email acceptance. Verify `X-Coco-Signature` as hexadecimal HMAC-SHA256 of `X-Coco-Timestamp + '.' + raw body`, reject stale timestamps, and deduplicate by reference. Optional webhook failure never changes accepted email delivery; failed deliveries are recorded for manual replay. No automatic webhook retry worker is included.
5. Perform a real staging database/email test and verify the branded email in intended mail clients before production. This task used mocked provider/database tests and unconfigured local submission only. No real email was sent.
6. Agree on data-retention duration and authorized administrators; configure deletion/retention operationally before capturing production leads. Add account-level abuse monitoring if traffic warrants it.

HoneyBook opens the exact existing inquiry form in a new tab; visitors are asked to include the reference. There is no automatic HoneyBook lead creation or prefill. Optional integrations must respect separate contact and marketing consent. This is an estimate workflow, not a checkout.

## Analytics

Listen for the local `coco:analytics` CustomEvent to connect an approved analytics provider. No data is transmitted to third-party analytics by this implementation. Events: `pricing_calculator_viewed`, `pricing_calculator_started`, `pricing_event_basics_completed`, `pricing_category_opened`, `pricing_item_selected`, `pricing_tier_selected`, `pricing_item_removed`, `pricing_estimate_generated`, `pricing_email_requested`, `pricing_email_succeeded`, `pricing_email_failed`, `pricing_consultation_clicked`, `pricing_honeybook_clicked`, `pricing_calculator_abandoned`. Payloads are limited to event type, guest band, category, tier and step where applicable. Abandonment on route unmount is best-effort; tab termination is not guaranteed to emit it.

## Validation

- `npm test`: 15 passing tests: approved chair examples, recalculation/removal/custom quote, quantity bases, percentage base, fee eligibility/exclusions/minimum, invalid guests, missing configuration, cross-origin rejection, failed provider/retry/idempotency.
- `npm run typecheck`: passed.
- `npm run lint`: passed with seven existing fast-refresh warnings in UI primitives/router.
- `npm run build`: passed; calculator has its own generated chunk. Existing build tool emits nonfatal deployment warnings.
- Browser: event basics, forward/back/edit navigation, tier selection, refresh persistence, mobile drawer, and missing-email-configuration feedback verified. No email success was simulated in the browser.
- Requested CSS viewports 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844 and 360×800 show document width equal to viewport width. See `screenshots/viewport-checks.json` and screenshots. Existing five public routes were also smoke-tested at 360px without horizontal overflow.
- Native labels, numeric constraints, grouped radios, checkbox selection, visible focus, skip link, step focus, live range/status, reduced motion and accessible drawer implemented. This was not a comprehensive assistive-technology audit.
- Print styles retain branding, event details, itemized ranges, reference, assumptions/disclaimer and configured booking URL. Final PDF pagination and cross-browser print behavior still need manual review.

## Decisions Christine must supply

Approved prices and concrete inclusions for every additional item/tier; fee-eligible items/categories/exclusions and any minimum; approval of 20% fee copy; confirmation of USD and eight guests/table; tax/logistics/vendor minimum treatment; final disclaimer; real Calendly link; verified public origin; verified email sender and credentials; database/deployment access; data-retention policy and marketing-consent wording; optional EaseOps destination and processing scope. Until these are supplied, this educates visitors with chair pricing and consultation requests, not a complete event-cost estimate.

The dependency install reported 31 audit findings in the existing dependency graph (11 high). No dependency upgrades or forced audit fixes were applied; this deserves a separate compatibility/security review before release.

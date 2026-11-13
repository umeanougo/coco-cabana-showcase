# Website and calculator UX pass

Implemented against main `af72a5b638aad608b08e6ac865fa29bca1c91296`. This is a review-site update, not commercial approval. No catalog values, fee formulas, schema versions, backend, domain mappings or integration settings changed.

## Changes and sources

| Problem                                                | Change                                                                                                                                                                                             | Evidence                                                                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Generic opening and mixed service taxonomy             | Houston/event-planning headline, budget/gallery/inquiry actions; shared published service component on Home and Services                                                                           | Current UX request §§3–5; Christine brief “Service selection and fees” and “Planner path”; reference ledger R01–R07 |
| Hidden continue buttons and lengthy lists              | Visible service actions outside disclosures; native keyboard-operable category headers; expand/collapse controls and selected counts/subtotals; no automatic selection                             | Current request §§5,8; brief “How the screen behaves” / “Design and UX”                                             |
| Total implied full event coverage                      | Selected-items heading; priced count, separate unpriced selections, canonical exclusions visible near desktop/mobile totals; Review breakdown label                                                | Current request §6; brief estimate disclaimer; existing partial estimate corrections                                |
| Weak tier guidance                                     | Pricing-unit multipliers at point of selection; approved item example descriptions on tier buttons; existing inclusions/notes visible; honest generic fallback and approved-photo-only detail view | Current request §7; brief item cards; ledger R12. Approved detailed examples remain absent                          |
| Contact diverted visitors or implied separate forms    | Inquiry first; client/planner/specialist routes go to shared inquiry section, explicitly no automatic HoneyBook context transfer; calculator secondary; no response-time or confirmation promises  | Current request §9; existing general HoneyBook destination                                                          |
| Unverified portfolio associations / “live” static grid | Neutral image references, accessible enlarged gallery view and service/budget/inquiry links; static-grid wording                                                                                   | Current request §10. Asset-to-event mappings are not verified in available evidence                                 |

Exact private source documents remain in the existing ignored reference packet. No private planner reward terms or raw stakeholder material are added to public source.

## Pricing and offer ownership

The Pricing Manager controls only `src/config/pricing-catalog.json`. Its draft storage, gate, validation, preview isolation, export schema and approved-export script are unchanged. Service copy reads the published configuration; local preview reads its context.

Standalone offers predate this pass and are **not established as approved by the reference packet**:

- Services: six flower-wall variants display $300 via the existing single mapped price expression. Source/technical owner: `src/routes/services.tsx`; business confirmation owner: Christine. Distinct from calculator Backdrop; this distinction is now visible.
- Services: $100 off a flower wall with a photo-booth rental, plus an unspecified bundle discount. Same source/owner; amounts preserved. Confirm eligibility, duration, inclusions and stacking.
- Home: $50 flower-wall mailing-list offer. Source: `src/routes/index.tsx`; Christine to confirm current terms and interaction with the bundle promotion. Amount preserved; signup disabled.

These are distinct promotions, not duplicate prices for a single package. No second pricing catalog introduced. Do not edit them in the Pricing Manager expecting the rental pages to change.

## Content still needed from Christine

- For Backdrop, Floral centerpieces, Chairs and Candle staging, **each Economic/Average/Lux tier** needs an approved item-specific description, actual inclusions/exclusions, physical scope/quantity basis, price drivers, and a correctly associated photograph with publication rights and alt text. Existing descriptions/inclusions/notes are blank; only reference ranges and units are supplied. No materials, dimensions, quantities of décor pieces, chair models or labor inclusions have been invented. The presentation supports approved content already; no CMS or schema migration required.
- For each portfolio image, confirm the actual event and permission to identify it. To build a project story: event type, location, guest count, objective, Coco Cabana role/delivered scope, approved testimonial, and explicitly approved investment range. Prior named mappings (including one image reused for two different projects) are removed pending verification, not treated as proof.
- Confirm the retained coaching, travel, honeymoon, concierge and other specialist offerings and their scope. They are now a secondary section, not mislabeled À la carte décor. Illustrative planning timelines need business confirmation.
- Confirm final reference rates, missing custom-quote packages, minima and logistics/tax policy. Their existing provisional treatment is retained.

## Verification

- 29 tests pass: original 27 plus two focused rendered-content regressions for canonical exclusions/partial scope and approved-only tier guidance with local table assumptions. The test bundler now supports Node built-ins used by React server rendering. No dependency added.
- Existing $3,000 fee-boundary rejection, upper-boundary/cent-level tests and client/planner/service/quantity tests remain passing.
- Typecheck, lint and build required before merge. Lint baseline: seven existing Fast Refresh warnings; no new lint errors.
- Local browser checks: Chrome 1440×900 and 390×844; supplementary in-app browser at actual 355×767 CSS pixels (viewport scaling is recorded, not claimed as exact requested dimensions). Home CTA, client corporate path, visible service actions, category keyboard Enter, tier dialog/Escape, mobile review/removal, Design/À la carte switching, planner 15%, unpriced Eru scope, quantities and invalid guest input exercised.
- Reference client Planning, 250 guests: Lux catering $18,750–$37,500 + Average backdrop $1,500–$2,500 = subtotal $20,250–$40,000; fee $4,050–$5,000; total $24,300–$45,000. Browser output matches. Design gives $1,800–$3,000; À la carte $1,500–$2,500; planner 15% displays $23,290–$46,000 after existing rounding.
- Quantity check: Average hair & makeup ×3 = $525–$825 plus $105–$165 fee = $630–$990. Zero guests pauses totals and shows validation.
- Local Manager preview changed Backdrop name to a synthetic QA label; separate public tab retained Backdrop. Reset confirmation interrupted Chrome automation; cleanup verification is recorded separately in the private report.
- These checks do not establish customer comprehension, conversion lift, a full assistive-technology audit or physical-device compatibility. External delivery/bookings remain disabled. Production content approval and integrations remain outside scope.

Screenshots and deployment observations are stored locally in `docs/coco-cabana-implementation/`, excluded from Git alongside the existing reference packet.

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

## Focused correction pass — 2026-11-13

Baseline: `044643e4f1ea28342f846cb548319bbfa7678f54` (PR #7). The reviewed selection-count, dialog-focus/close-size and gallery-reference defects were present; no duplicate fixes were skipped.

- Selection identity/counts now survive invalid guest/quantity inputs independently of the calculation. Applicable, additional quote-only and excluded retained selections remain distinct; current money is paused, invalid guest/table multipliers are replaced with guidance, and restoring valid inputs restores the original estimate.
- A shared controlled-dialog focus helper records the exact opener, focuses the heading initially and restores the opener or a visible fallback. Tier, desktop/mobile breakdown and gallery dialogs use it. Close targets are 44×44 CSS pixels. Tier buttons reference their rendered unit, price and guidance, retaining pressed state.
- Important pricing guidance is 13–14px and wraps. Mobile clearance measures the actual bar. Below 600px available viewport height it becomes an inline summary above inputs; focus clearance runs after native focus scrolling. The full selected-item summary is also available in the mobile page flow. This adjacent change prevents enlarged qualifiers from obscuring keyboard-focused controls.
- One shared gallery source preserves Portfolio references 1–7 and maps Home's third image to image 6. Labels remain visible, links target matching portfolio anchors, alt text describes visible image content, and occasion images visibly disclose unconfirmed associations.
- Services separates Corporate/Charity occasions from retained specialist offerings, links duplicate Event Design to the canonical Design section, and uses customer-facing rental clarification. Rental amounts/promotions are untouched.
- A private approval worksheet covers all twelve requested item-tier combinations, candle overlap, rates/minima/exclusions, eight missing FAQ topics, verified examples, image rights, offers and specialist/timeline decisions. It is in the existing ignored implementation documentation directory, not public source.

Validation: 32 tests pass (three focused regressions added); typecheck and production build pass; lint has zero errors and the same seven existing Fast Refresh warnings. Existing toolchain build warnings remain (Node module registration deprecation, dependency unused imports, Wrangler main override). Catalog, fee engine, pricing configuration validation, Manager storage/import/export/version logic and integration settings have no changes.

Local browser evidence confirms the exact $20,250–$40,000 subtotal + $4,050–$5,000 fee = $24,300–$45,000 reference, clear/zero/restore continuity, service switches, planner fee separation, custom scope, tier/removal updates, focus return including hidden desktop-opener fallback, 44px close targets, associated tier descriptions, matching gallery anchors and Services grouping. Mobile sizes checked: 390×844, 360×740, short 390×500; tablet 768×1024. Measured 390px bar with one custom item: 239.375px, with dynamic page clearance. No horizontal overflow in these checked states. Native mobile keyboard and a full assistive-technology audit are not established by these checks.

Manager save/reload, preview isolation, downloaded JSON export, rejected invalid JSON and reviewed valid reimport passed using a disposable local draft. Native reset confirmation stalled the browser automation; its cleanup result must be checked separately and is not inferred from the click. Private final verification/deployment observations and screenshots are recorded in `docs/coco-cabana-implementation/ux-corrections/README.md`.

## Final bounded cleanup — 2026-11-13

Corrected the existing `.cc-category .cc-partial` declaration from 10px to 13px with 1.5 line height; no competing override or wording/layout changes. Computed 13px/19.5px confirmed with a custom-quote selection at 360px and 390px; wrapping remains separate from subtotal, count and disclosure control. Existing 32 tests, typecheck and build pass; lint retains seven baseline warnings, no errors. Actual outputs are retained in ignored local verification records.

Chrome's native UI confirmed 200% zoom (effective viewport 960×331 CSS pixels, DPR 2). Guest editing, tier selection and tier/review dialogs remained usable; settled dialogs fit the viewport with reachable close controls. Native Manager Reset was accepted in a newly opened Incognito window: disposable saved label survived reload, Reset restored Economic, and a further reload preserved the reset result. The isolated window was closed; existing regular-profile drafts were not modified. No real-device phone/keyboard capability was available. No catalog, fee, Manager behavior or integration changes were made.

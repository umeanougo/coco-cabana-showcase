# Frontend Pricing Manager

Review entry: https://cococabana.easeops.ca/admin/pricing. Unlisted and noindex; neither is access control. Public `/pricing` always uses the bundled website configuration. Preserve the separate cococabana.us site.

## Access and editing

The disposable demo code is `COCO-REVIEW-2026`. Configure it in `src/config/pricing-manager.ts`, then use the normal PR/main/Lovable deployment workflow. The code and checks are public and bypassable. Never reuse a personal password or put confidential briefs, supplier costs, partner terms, credentials or personal data here. There are no accounts, invitations or authentication backend. Unlock is held in sessionStorage for the tab; Lock / Sign out removes it. Browser session restoration can restore sessionStorage, so explicitly lock on a shared device.

1. Search/filter the items. Edit an item, then **Save on this device**. Save validates the complete draft, including other pending settings, and closes the item editor only after storage succeeds. Cancel, Close and navigation protect unsaved edits.
2. Add items with generated stable IDs; rename without changing identity. Hide/restore affects availability. Category names/order and the three fixed tier labels/descriptions can change. Missing/custom-quote items remain unpriced even if they retain tier numbers. Marking a draft approved does not publish it.
3. Edit assumptions, descriptions and disclaimer/exclusions. Advanced fee settings are collapsed by default. They retain the three-band fee model, independent endpoints, client/planner applicability and optional planner fee. Fee thresholds are inclusive at the upper edge of each band. Reference service minimums remain informational, not minimum charges.
4. **Preview changes** validates and opens the actual calculator with an explicit local-draft banner. It can preview unsaved settings without saving them. Return to editing keeps your work. Preview event selections are temporary and reset on re-entry. Estimate copying/submission is disabled in this preview.
5. **Export pricing** downloads a complete validated JSON envelope. It can export unsaved valid settings, but does not save them locally or update the shared website. **Import pricing** accepts an exported file or its pasted JSON contents, validates it, shows a change summary, and requires confirmation before saving/replacing the draft. Invalid input leaves the draft unchanged. Imported text is rendered as text, never executed.
6. **Reset to website prices** asks before replacing the local draft with the current bundled configuration.

## Storage and limitations

Key: `coco-cabana:pricing-manager:draft:v1` in this origin's localStorage. Envelope fields: schemaVersion (1), baseCatalogVersion, lastSavedAt (ISO), configuration; exports also include exportedAt. The complete editable configuration is stored, not customer estimates. It survives reload and browser/server restarts in the same browser profile and origin, subject to browser retention policy. Clearing site data, private browsing or storage eviction can erase it. Download exports as backups.

There is no shared backend, staff retrieval, cross-device sync, concurrent editing coordination or collaboration. Two tabs can hold different drafts; last successful save wins. Use one editor tab. A different origin (including localhost versus the hosted test domain) has separate storage. Browser quota/security failures show errors rather than claiming success; malformed stored data is not silently repaired or overwritten on load.

A base catalog mismatch displays a review warning and retains the old base version. It does not merge or overwrite new website prices. The apply script refuses mismatched bases: export for backup, reset to current website prices, then review and re-enter the intended changes before exporting again. Do not merely edit the base version to bypass review.

Three category IDs and three tier IDs are fixed; category names/order and item membership are editable. There is no formula editor, image uploader or publishing API. Existing saved customer-estimate snapshots are untouched. No new backend, email, marketing, booking, CRM or payment service is enabled. Existing hosted review safeguards remain in force.

## Applying an approved export

Only apply a reviewed export; the editor does not approve prices on anyone's behalf. Run from the repository root on a new branch based on the latest main, preserving Lovable edits:

```sh
git switch main
git pull --ff-only origin main
git switch -c pricing/approved-update
node scripts/apply-pricing-export.mjs /absolute/path/approved-pricing.json --version christine-approved-YYYY-MM-DD-vN
node scripts/apply-pricing-export.mjs /absolute/path/approved-pricing.json --version christine-approved-YYYY-MM-DD-vN --write
npx prettier --write src/config/pricing-catalog.json
npm test
npm run typecheck
npm run lint
npm run build
git diff -- src/config/pricing-catalog.json
```

The first script command validates and reports changes without writing. The second writes only `src/config/pricing-catalog.json`, the canonical configuration, and assigns the supplied new catalog version to the catalog and each item. The same export and version produce the same configuration; timestamps are not written into the catalog. It refuses unsupported schemas, invalid data, stale bases and reuse of the current catalog version. A subsequent repeat against the already updated repository is rejected as stale.

Review the diff and calculator flows; commit only the approved configuration and relevant implementation changes. Push the branch, open a PR against main, inspect checks and merge. Let the existing Lovable project `c0cebeb6-62bc-4f86-8e13-003af30ffaf2` sync that merge, then publish/update the existing test site at cococabana.easeops.ca and verify `/pricing` and `/admin/pricing`. Do not change domain mappings or publish to cococabana.us. Raw exports and private reference material need not be committed. No repository credentials are in the browser.

## Verification for this implementation

Automated: 24 passing tests (the original 19 plus 5 manager/configuration tests), typecheck, lint and production build. The five new tests cover complete envelope round-trip/base preservation, failed storage and rejected import immutability, invalid configuration constraints, configuration-aware engine/public isolation, and unpriced/custom items with configurable quantity limits. Existing tests retain the exact $20,250–$40,000 subtotal + $4,050–$5,000 fee = $24,300–$45,000 scenario and held external deliveries.

Browser checks and deployment evidence are recorded in the local implementation report. Storage-blocked/quota failures are simulated in unit tests, not by changing the user's browser settings. No live forms, messages or bookings are submitted as verification.

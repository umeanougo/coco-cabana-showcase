# Coco Cabana hosted stakeholder review

Target: https://cococabana.easeops.ca/pricing. Existing Lovable project c0cebeb6-62bc-4f86-8e13-003af30ffaf2, synced from main. No deployment to cococabana.us.

`src/config/review-environment.ts` is explicit trusted release configuration, shared by client and server. Normal production build retains qualified reference pricing and noindex. This is not development mode. Current release marker: corrected-review-2026-11-04.

No isolated hosted database is enabled. Hosted saving is explicitly unavailable: the contact layout can be reviewed with synthetic data, the save button is disabled, and the server independently returns 503 without storing anything or contacting providers. Requests from other origins are rejected. No browser flag can enable saving or delivery. Local Node development still uses ignored local SQLite for synthetic saves. Version-aware immutable persistence remains tested locally; it is not claimed as deployed storage.

Recovery blocks live provider calls in the review build. Local mocked tests can exercise delivery contracts. Review snapshots remain held even if a future release enables delivery. HoneyBook CTAs, inquiry links and marketing signup are disabled for review. No live CRM/payment integration is added. Noindex is a crawler hint, not access control.

Private reference packets, raw brief/evidence, review ZIP, local SQLite, environment files and review screenshots/reports are excluded from commits. No runtime catalog, Airtable, shared leads or automation milestone is included.

Before a future launch: separately review environment settings, approved prices, privacy/copy/assets, isolated versus production storage, staff access, notification recovery scheduling and provider configuration. Never repurpose test records for live outreach.

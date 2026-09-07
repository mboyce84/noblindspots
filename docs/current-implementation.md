# NoBlindSpots — current implementation
Updated September 2026. This document supersedes the old mock-runtime descriptions in CLAUDE.md and README history.

## What works in this release
- Existing React 18 / Vite 5 / TypeScript codebase and retained EOD form shapes.
- Redesigned responsive sales page, workspace shell, executive dashboard, attribution, pipeline, offer economics, client health, imports, reconciliation, audit history, team roster, team goals, and daily reporting.
- A Cloudflare Worker API and managed D1 database, deployed privately through Sites. This is a **runtime adaptation from the Notion Postgres design**, not a deployed Supabase instance. The user confirmed the old app had no running database.
- Stable natural keys: UNIQUE(org_id, kind, source, source_id), integer cents, USD validation, atomic import batches, rejection logs, late contact backfill, metadata-first matching and unambiguous email fallback.
- A sample workspace and an initially empty business workspace, independently persisted for each authenticated account.
- Tenant identity comes only from the Sites dispatcher's authenticated-user headers. The server derives org IDs from that identity. Browser role selectors never authorize access. Reporting profiles are not login accounts.
- Exclusion/restore and manual customer matching with audit logs. Candidate duplicates are heuristics and require human review.
- Financial calculations share one engine with the UI and tests. Cash is successful payment amounts plus negative refund records, before fees; margin deducts fees once along with other costs. Overhead allocation sums exactly to imported overhead.
- Period and offer filters affect all figures; verification reveals source rows and original fields. Exported monetary columns use dollars and protect spreadsheet formulas.
- Sales-page requests are stored with their owner identity and shown in Import history. No emails, payment retries, or external messages are sent.

## Current limits and next releases
This is the Notion brief's working v1, not the entire roadmap. Imports are limited to 500 rows / 1 MB and a workspace to 10,000 records. USD and date-only reporting use YYYY-MM-DD. Import dates currently require ISO values. Queries aggregate within the bounded workspace rather than using 100k-row metric snapshots.

Native GHL/Stripe webhook sync, AI column mapping, automatic EOD prefilling, external team invitations, client-safe sharing, billing, template customization, a configurable metric compiler, multi-currency conversion, and Postgres deployment are not enabled. The sales page and app state these boundaries instead of simulating them.

The repository's system-architecture-spec.md and original Supabase migrations remain reference inputs for that roadmap. The old migrations contain demo rows and are **not** applied by this release. A future Supabase/Postgres implementation must use real auth IDs, organization membership, RLS, signature verification, and server-side view scoping. Do not deploy the old demo auth policies as production auth.

## Run locally
Node 24 is used for the local SQLite test adapter.
1. npm ci
2. npm run dev:api (local loopback API, explicitly local development identity)
3. npm run dev
4. npm test
5. npm run build

The local API applies generated Drizzle migrations once and stores data in ignored .local/noblindspots.sqlite. It is bound to 127.0.0.1; its local identity must never be copied into hosted request handlers.

On this Windows host, native esbuild cannot enumerate an ancestor directory. Running the command in a temporary drive mapping to the **same checkout** avoids reading that directory:
subst N: C:\\path\\to\\noblindspots
Set-Location N:\\
npm run dev
The mapping is per process logon; no system folder or denied content is read.

## Hosting
The current target is Sites / Cloudflare Workers. .openai/hosting.json declares DB as a logical D1 binding. The build produces dist/client assets and dist/server/index.js with a default fetch handler. The exact built index is embedded in the Worker for SPA deep links. Drizzle migrations are schema-only and packaged under dist/.openai/drizzle.

Vercel's old api/waitlist.ts and vercel.json remain from the previous prototype, but a plain Vercel static deployment does **not** implement this API. Use the documented Worker deployment or implement the server adapter for another host first.

## Validation
Automated tests cover malformed/quoted CSV, exact cents, invalid dates/currencies, ambiguous matching, refunds/fees, overhead allocation, show-rate denominators, spreadsheet-formula escaping, deterministic fixtures, unauthorized access, cross-origin writes, repeat imports, rejection atomicity, tenant isolation, exclusion persistence, contact backfill, manual-match preservation, dataset separation, and durable EOD reports.
No browser interaction testing was requested, so validation used compilation, source review, HTTP smoke checks, and the data/API tests.

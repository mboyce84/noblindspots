# Current runtime

Read [docs/current-implementation.md](docs/current-implementation.md) first. The mock runtime notes below describe the previous version and are superseded.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # type-check via tsc and build production bundle to dist/
npm run lint      # eslint .
npm run preview   # serve the production build locally
```

There is no test suite configured (no test runner in `package.json`) — don't assume `npm test` exists.

## Project context

This repo started as the **FBASU KPI Dashboard**, imported from a Bolt.new export (see `.bolt/config.json`, template `bolt-vite-react-ts`). It is the first reference implementation inside a larger product called **NoBlindSpots** — see [docs/system-architecture-spec.md](docs/system-architecture-spec.md) for the target multi-tenant architecture (Metric/Widget/View/Template layers) this codebase is meant to generalize into. That rebuild has not started: the app is still single-tenant with a mocked data layer.

"FBASU" no longer appears in any user-visible string. It **does** appear throughout `docs/`, where it is deliberate vocabulary for the coaching-sales-team *Template* — do not find-and-replace it there.

The EOD forms are a keeper product surface, not legacy. The strategy is to *shrink* them as fields become derivable from GoHighLevel and Stripe (`Form → webhook, until derived`), leaving roughly 14 of the current 55 fields that genuinely need a human. Don't propose deleting them.

For the full business context this codebase serves — the "Make Data Sexy" community it's bundled with, pricing, competitive landscape, locked product decisions, and open items — see [docs/context-handoff.md](docs/context-handoff.md).

## Architecture

Vite + React 18 + TypeScript SPA, client-side routed with `react-router-dom`, styled with Tailwind, charts via Recharts. Entry point `src/main.tsx` → `App.tsx`, which wraps everything in `AuthProvider` (`src/context/AuthContext.tsx`) and a `Router`.

Routes split into three groups: `/` (public marketing landing), `/login`, and everything else behind `ProtectedRoute`. `ProtectedRoute` gates on `user` being non-null — **it does not check `role`**, so any authenticated user can reach `/admin/*` directly by URL; role-based restriction only happens in `Sidebar.tsx`'s nav-item list. `vercel.json` supplies the SPA rewrite; without it every deep link 404s in production.

### The public landing page

`src/pages/Landing.tsx` is composition only. Sections live in `src/components/Landing/`, and **all copy is in `landingContent.ts`** so a wording change never touches a component. `Section.tsx` and `BrandMark.tsx` are the shared primitives.

Constraints worth preserving: `Landing` deliberately does not call `useAuth()` (reading auth state would flash a spinner on the page paid traffic lands on, and would stop you viewing your own ad's landing page while signed in). It must not import `Layout`/`Sidebar`/`Header` — that's the authenticated shell, which has no responsive handling. `DashboardPreview.tsx` hardcodes its own figures rather than importing `mockData`, and avoids Recharts to keep first paint fast.

Waitlist submissions go through `src/lib/waitlist.ts`, which picks an adapter (`console` / `webhook` / `proxy`) from `VITE_WAITLIST_MODE`. **Production defaults to `proxy`** so an unconfigured deploy errors honestly instead of faking success and dropping real signups; `api/waitlist.ts` forwards server-side using `WAITLIST_WEBHOOK_URL` (no `VITE_` prefix, so it stays out of the client bundle).

### The data layer is entirely mocked, despite a real Supabase client existing

`src/lib/supabase.ts` creates a real Supabase client from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (and throws if they're missing), but **none of the exported services actually query it**. `userService`, `teamGoalsService`, `submissionService`, and `authService` all read/write in-memory arrays (`mockUsers`, `mockSubmissions`, `mockTeamGoals`) defined at the top of that same file — state resets on every page reload. `authService.signInWithEmail` checks email against `mockUsers` and a hardcoded password (`demo123`); it never calls Supabase Auth.

The real intended schema lives in `supabase/migrations/*.sql` (`users`, `eod_submissions` tables with RLS policies and demo-user seed data matching the mock users), but the app code and the SQL schema are disconnected — migrations were never wired up to the services in `supabase.ts`. When reconnecting real persistence, the migrations are the source of truth for shape; `supabase.ts`'s services are the integration point to rewrite.

### Roles and forms

Four roles gate dashboards and forms throughout: `admin`, `closer`, `dm-setter`, `phone-setter` (defined in `src/types/index.ts`). Each non-admin role has its own EOD ("end of day") submission form shape — `PhoneSetterForm`, `CloserForm`, `DMSetterForm` in `src/types/index.ts` — matching the per-role KPI form components under `src/components/Forms/`. `src/pages/EODForm.tsx` routes to the correct form by the logged-in user's role. Dashboard rendering per role lives in `src/pages/Dashboard.tsx`, with reusable pieces in `src/components/Dashboard/` (`MetricCard`, `Chart`, `RoleDashboardSelector` for admins switching between role views).

### Admin-only pages

`src/pages/admin/` holds `Users.tsx` (user CRUD via `userService`), `AllSubmissions.tsx`, `EODCompliance.tsx` (compliance calendar over submission data), and `Settings.tsx`. `Settings.tsx` is a stub: 18 controls, a simulated save, nothing persisted and nothing consumed by any other page.

### Demo data

`src/utils/mockData.ts` is deterministic — values come from a seeded hash, not `Math.random()`, and dependent metrics are derived from their base so the funnel reconciles against the curriculum's benchmarks (25% lead→booked, 70% booked→showed, 25% showed→closed). Keep both properties: random values re-rolled on every render and made numbers change when you toggled the time range, which is fatal for a product sold on trustworthy numbers. Names in there are generic on purpose — the dashboard is reachable from a public page.

Known remaining inconsistency: `calculateKPIs` always reduces `data.daily`, so the time-range toggle changes the charts but not the KPI tiles.

## Environment variables

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required at build/runtime (`src/lib/supabase.ts` throws otherwise) even though they're currently unused for actual data access. See `.env.example`.


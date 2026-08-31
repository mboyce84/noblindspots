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

This repo is the **FBASU KPI Dashboard**, imported from a Bolt.new export (see `.bolt/config.json`, template `bolt-vite-react-ts`). It's being repositioned as the first reference implementation inside a larger product called **NoBlindSpots** — see [docs/system-architecture-spec.md](docs/system-architecture-spec.md) for the target multi-tenant architecture (Metric/Widget/View/Template layers) this codebase is meant to generalize into. That rebuild has not started: the code here is still the original single-tenant FBASU app. Expect naming to be inconsistent during the transition — `package.json` name and the page `<title>` say "NoBlindSpots", but in-app UI (`Sidebar.tsx`, `Login.tsx`) and mock data still say "FBASU".

For the full business context this codebase serves — the "Make Data Sexy" community it's bundled with, pricing, competitive landscape, locked product decisions, and open items — see [docs/context-handoff.md](docs/context-handoff.md).

## Architecture

Vite + React 18 + TypeScript SPA, client-side routed with `react-router-dom`, styled with Tailwind, charts via Recharts. Entry point `src/main.tsx` → `App.tsx`, which wraps everything in `AuthProvider` (`src/context/AuthContext.tsx`) and a `Router`. `ProtectedRoute` in `App.tsx` gates every route except `/login` on `user` being non-null — **it does not check `role`**, so any authenticated user can reach `/admin/*` routes directly by URL; role-based restriction only happens in `Sidebar.tsx`'s nav-item list.

### The data layer is entirely mocked, despite a real Supabase client existing

`src/lib/supabase.ts` creates a real Supabase client from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (and throws if they're missing), but **none of the exported services actually query it**. `userService`, `teamGoalsService`, `submissionService`, and `authService` all read/write in-memory arrays (`mockUsers`, `mockSubmissions`, `mockTeamGoals`) defined at the top of that same file — state resets on every page reload. `authService.signInWithEmail` checks email against `mockUsers` and a hardcoded password (`demo123`); it never calls Supabase Auth.

The real intended schema lives in `supabase/migrations/*.sql` (`users`, `eod_submissions` tables with RLS policies and demo-user seed data matching the mock users), but the app code and the SQL schema are disconnected — migrations were never wired up to the services in `supabase.ts`. When reconnecting real persistence, the migrations are the source of truth for shape; `supabase.ts`'s services are the integration point to rewrite.

### Roles and forms

Four roles gate dashboards and forms throughout: `admin`, `closer`, `dm-setter`, `phone-setter` (defined in `src/types/index.ts`). Each non-admin role has its own EOD ("end of day") submission form shape — `PhoneSetterForm`, `CloserForm`, `DMSetterForm` in `src/types/index.ts` — matching the per-role KPI form components under `src/components/Forms/`. `src/pages/EODForm.tsx` routes to the correct form by the logged-in user's role. Dashboard rendering per role lives in `src/pages/Dashboard.tsx`, with reusable pieces in `src/components/Dashboard/` (`MetricCard`, `Chart`, `RoleDashboardSelector` for admins switching between role views).

### Admin-only pages

`src/pages/admin/` holds `Users.tsx` (user CRUD via `userService`), `AllSubmissions.tsx`, `EODCompliance.tsx` (compliance calendar over submission data), and `Settings.tsx`.

## Environment variables

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required at build/runtime (`src/lib/supabase.ts` throws otherwise) even though they're currently unused for actual data access. See `.env.example`.

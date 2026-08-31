# MAKE DATA SEXY + NOBLINDSPOTS — FULL CONTEXT HANDOFF
**Owner:** Marquiste Boyce
**Purpose:** paste or upload this at the start of a new chat to restore full context on the business, the decisions made, what's built, and what's still open.
**As of:** end of the planning session

---

# 1. WHAT THIS IS

Two connected things:

**Make Data Sexy** — a paid Skool community for GoHighLevel businesses. Teaches owners to see and use their own business data, and eventually to build the internal tools their business needs.

**NoBlindSpots** — the software. An ingestion and reconciliation engine that pulls GHL, Stripe, and other payment processors into one normalized layer, plus a semantic layer that turns that into trustworthy metrics, plus dashboards composed from templates.

**Relationship:** the community teaches judgment, the software removes labor. Community is $97/month and the software is included when it ships. They are deliberately two names doing two jobs — Make Data Sexy is what people join and feel part of, NoBlindSpots is a tool people use and can be marketed to people outside the community.

**Positioning line:** the operating dashboard for GoHighLevel businesses.

**Who it's for:** coaches, agencies, consultants, and event businesses running on GHL, doing $100K–$1M, whose numbers live in five places.

**The core insight the whole thing rests on:** GHL's native reporting can't answer basic operating questions, and a meaningful share of revenue never touches GHL at all. Owners make decisions on stale exports or on numbers that are confidently wrong.

---

# 2. THE OPERATOR — CONTEXT THAT MATTERS

- Runs a white-label GoHighLevel agency (Automate Your Hustle)
- Has built dashboards for real clients: FBASU (coaching sales team, role-based), EFW (event/ticketing), Carly Hill Coaching (DM tracker), Elise (consultant)
- Quit drinking and lost 30 pounds tracking daily deposits — this is a real and distinctive personal story that anchors the brand
- Genuine passion is AI app building, not dashboards specifically. This was surfaced late and resolved by reframing: the community is about building the tools your business needs, and the dashboard is simply the first one because every business needs it and it's immediately sellable.
- **Known pattern to watch:** this is at least the sixth time the concept has widened right at the moment of shipping. The Skool space still is not fully launched. Reframes that cost nothing and let him ship with more enthusiasm are good. Reframes that trigger a redesign are the pattern, not a strategy.

---

# 3. DECISIONS THAT ARE LOCKED

| Decision | Answer | Why |
|---|---|---|
| Community name | **Make Data Sexy** | Memorable, ownable, stands out in a GHL feed full of dry functional branding. Minor search collision with a dormant 2019 Excel book (Annie Cushing) — assessed as acceptable. |
| App name | **NoBlindSpots** | Fear/risk positioning: "you're losing money because you can't see it." Split from the community name deliberately. |
| Pricing (community) | **$97/month**, or **$970/year founding** locked for life, first 25 members | $47 anchors as a hobby community to a buyer doing $100K+/yr. Founding incentive is the annual lock, not a discount. |
| Pricing (software) | $97 / $247 / $497 monthly, $3,500+ DFY setup | Matches PIF Perfect's market rate. |
| Vertical | **GoHighLevel businesses**, not "coaching businesses" | The three real clients are a coach, an event business, and a consultant. GHL is what they share. Decisive factor is findability — you can go where GHL users are tomorrow. |
| Live cadence | Monthly Dashboard Teardown (first Monday, 12pm ET) + async Review Week (third Monday) + weekly 15-min group onboarding | Twelve live obligations a year, not fifty-two. |
| Free community? | **No.** | No audience to fill one, unwanted management load, free rooms fill with non-buyers. |
| Free top-of-funnel | The Three Numbers diagnostic tool (built, needs hosting) | Qualifies better than a free room, captures email, demos the product, zero ongoing management. |
| Trial | **Off** | Value isn't experienced until someone builds something. Undercuts the founding-annual pitch. |
| "Applet" as a term | **Rejected** | Ambiguous. Correct term is Template. |

---

# 4. THE CURRICULUM — "THE VISIBLE BUSINESS"

Eight modules. Modules 1, 7, 8 are **judgment** (no tool can do them). Modules 2–6 are **labor** (what NoBlindSpots eventually removes). Each labor module ends with an honest "or don't do any of this — here's what the tool does for you" lesson.

| # | Module | Answers |
|---|---|---|
| 1 | Find Your Headline Numbers | What should I actually be tracking? |
| 2 | Get It Out | How do I get data out of the tools it's trapped in? |
| 3 | Clean Enough | My data's a mess, do I have to fix it all first? |
| 4 | The One-Screen Rule | How do I lay this out so people actually look? |
| 5 | Make It Live | How do I stop updating it by hand? (includes embedding the dashboard inside GHL) |
| 6 | Lock It Down | Who can see my client data right now? |
| 7 | What It Actually Costs | Which of my offers is actually making money? |
| 8 | Read the Room | I have a dashboard. Now what? |

**Module 1 was revised.** It was originally "The Three Numbers" — pick one volume, one constraint, one outcome. That was dropped because it contradicts the actual portfolio: EFW shows 4 headline numbers, FBASU shows 4, Carly's tracker shows 7. **The count isn't fixed, the shape is** — a small set of headline metrics above the fold, supporting breakdowns underneath, sorted by role where there's more than one. The chain-and-leak exercise (write your business as a sequence of conversions, find the biggest percentage drop) survives intact and still works.

**Benchmarks, researched and locked:** 25% lead-to-booked, 70% booked-to-showed, 25% showed-to-closed for coaching/consulting.

**Module 7 is the differentiator.** Revenue by offer hides ad spend, commission, processing fees, and delivery cost. Nobody else teaches contribution margin per offer. Record it second, right after Module 1.

**Still to do on the curriculum:** Module 8 needs the department-layer lessons added (company-level headline set expanding into marketing/sales/fulfillment sets, each with an owner). The Module 1 deck (`module-1-deck.html`) still has the old "three numbers" framing on slides 3 and 7 and needs rewording.

---

# 5. NOBLINDSPOTS — ARCHITECTURE SUMMARY

Full spec is in `docs/system-architecture-spec.md` in this repo.

**Five layers:**

```
5. PRESENTATION   React rendering, sharing, row-filtered client views
4. COMPOSITION    Templates → Views → Widgets
3. SEMANTIC       Metric definitions (JSON) → query compiler   ← the moat
2. NORMALIZED     contacts, appointments, opportunities, transactions
1. INGESTION      CSV upload, webhooks, scheduled export
```

**Terminology, locked:**
- **Metric** — a single defined number with its calculation rules, stored as JSON not code
- **Widget** — a metric rendered a specific way
- **View** — a set of widgets scoped to one audience or role
- **Template** — a starter bundle of metrics + widgets + views for a business type

**FBASU is a Template**, not a separate product — the one for coaching businesses with a sales team.

**Five non-negotiable rules:**
1. **Never append, always upsert** on `UNIQUE (org_id, source, source_id)`. One double-counted revenue number permanently destroys trust.
2. Tenancy enforced at the data layer (Postgres RLS), not the app layer.
3. Every displayed number is verifiable — click it, see the rows behind it.
4. Row filters on shared views enforced server-side.
5. Metrics are data, not code — adding one never requires a deploy.

**Two non-standard metric fields that encode the teaching into the product:**
- `tier` — headline or supporting (Module 1's sorting)
- `action_note` — what to do if this number moves (Module 1's Lesson 1.5)

**The customization ladder** (the direct answer to TEDi's "you can't customize it"):
0. Pick a template → 1. Toggle widgets → 2. Edit filters/targets via form → 3. Guided new metric → 4. Custom expression/SQL → 5. Request a build (DFY)

Every Level-5 DFY build gets saved back as a new template. The library compounds with each client.

**Key architectural judgment: exports beat direct API as the foundation.** Bulk-pulling GHL means paginating four object types with rate limits and sync state. A CSV is one file parsed in seconds with full history. Use exports for volume and history, webhooks for deltas, never poll an API for bulk data.

**Build order:** schema with constraints → CSV ingestion → ingest_runs logging → semantic layer + query compiler → verification drill-through → widgets/views with FBASU hardcoded → rendering/sharing → template picker → customization levels 1–3 → financial layer → webhooks → more templates.

**Critical sequencing note:** do not build the template abstraction until FBASU works end-to-end on real client data. Generalizing from one example is how abstraction goes wrong.

**The metric that decides whether this is a business:** percentage of accounts that upload or sync a second time within 30 days. Below ~30% means it's a one-time tool wearing a subscription costume.

---

# 6. COMPETITIVE LANDSCAPE

**TEDi** (trackwithtedi.ai) — closest competitor. Looker Studio templates fed by a Google Sheet "Brain" via Zapier. Eight department dashboards (Advertising, Cold Outbound, Call Booking, Sales, Source, Business Finances, Personal Finances, Wealth Projector). Real proof: Hormozi quote, Dan Henry and Ravi Abuvala testimonials, five years of building. Pricing $97/mo, $597/yr, $997 lifetime.

*Their admitted weakness, from their own sales page:* "Learning TEDi will be like learning a new language, it will take time. At first, it may feel intimidating... full benefits unfold over a few months." And their FAQ: "Can I customize TEDi? Not directly, and you shouldn't need to."

*Gaps to exploit:* no QuickBooks/Xero sync, no margin-per-offer, no customization, Zapier costs scale badly, attribution requires Hyros or manual UTMs.

*The strategic lesson from them:* they went straight to eight department dashboards with no on-ramp. **Same destination, better on-ramp** is the differentiator — not a smaller product.

**PIF Perfect** (Edward Stranks) — sales tracking software built from Cole Gordon's spreadsheets, five years of distribution in this exact niche. $97/$247/$497.

*Their hole:* the entire model assumes a human types numbers daily. One of their three flagship articles is literally "Why Your Reps Stopped Logging Their Numbers." **Counter-position: they made the form faster, we deleted most of the form** — scheduled calls, showed calls, offers made, deals won, and cash collected are all derivable from GHL and Stripe.

**Community Launch** (Christian Crenshaw) — $10K DFY community builder. Sales call already taken; couldn't afford it. Worth stealing: the three-tier offer stack, anti-churn dunning (~80% of cancellations are declined cards), 40% referral program, weekly group onboarding, the comment-to-DM keyword funnel.

**The moat, four things in ascending durability:**
1. Domain knowledge (opportunity value ≠ revenue, GHL overwrites attribution, etc.)
2. Switching cost created at onboarding
3. Distribution and trust via the community
4. **Benchmarks** — at 20+ clients, "your show rate is 58%, median for GHL businesses your size is 71%." Design the schema for this now, build in year two.

---

# 7. WHAT'S BUILT AND WHERE

**Built assets:**
- Nine module cover images + banner + icon (mission control aesthetic, green/purple/black/white)
- Three Numbers diagnostic tool (interactive HTML, needs hosting + webhook URL pasted in)
- Module 1 slide deck (needs the "three numbers" reframe applied)
- Video 1 deck (EFW/GHL reporting story)
- Full Skool setup kit with all paste-ready copy
- NoBlindSpots repo starter: `CLAUDE.md` + six docs, renamed and cross-referenced

**Notion workspace** — "Make Data Sexy" hub with child pages: Video Ideas database, The Visible Business (curriculum), Skool Setup, Launch Plan, Launch Copy, Funnel/Ads/Lead Magnet, Master Brain (NoBlindSpots), Community + Software, Levels/Milestones/Unlocks, Dream Customer Profile, EFW Findings, Coaching Business Dashboard Spec, Content & AEO Strategy.

**Output files worth knowing about:** `noblindspots-architecture-spec.md`, `master-brain-architecture.md`, `call-disposition-tracking.md`, `pif-perfect-teardown.md`, `mds-implementation-plan.md`, `skool-setup-kit-current.md`, `course-descriptions-and-video-script.md`, `ad-testing-playbook.md`, `paid-community-funnel-mapped.md`.

---

# 8. WHAT'S STILL OPEN

**Blocking / time-sensitive:**
- **Skool space not fully launched.** All copy and assets exist. It's roughly two hours of setup work.

**Product decisions needing answers (several affect the schema):**
1. Metric versioning — when a definition changes, do historical snapshots recompute or freeze? *Leaning: freeze, flag the change on the trend line.*
2. Multi-currency — out of scope for v1 but carry the field now.
3. Custom metric ownership — org-scoped only, or promotable to a shared library? *Leaning: org-scoped, manual promotion.*
4. Template updates — do existing orgs get template v2? *Leaning: opt-in with diff preview.*
5. Benchmark participation — opt-in or automatic once anonymized? Needs deciding before any cross-org aggregation is written.

**Smaller items:**
- Banner subtitle still says "coaching businesses," should say "GoHighLevel businesses"
- Module 1 deck slides 3 and 7 need the headline/supporting reframe
- Module 8 needs department-layer lessons added
- T-shirt mockup (Higgsfield daily limit was hit)
- Three Numbers diagnostic needs hosting + `WEBHOOK_URL` pasted in

---

# 9. STANDING GUIDANCE

Things worth holding onto across sessions:

**On scope:** the strategy has never been the bottleneck. Six times now the concept has widened at the moment of shipping. A reframe that costs nothing and increases enthusiasm is good; one that triggers a redesign is the pattern.

**On the software:** it isn't optional to the business — it's what justifies $97/month after month three once a member finishes the curriculum. That puts a roughly 90-day ship deadline on a working v1 (ingestion, one dashboard, the margin view).

**On sequencing:** every DFY engagement is a paid test of the architecture. Build it manually for the next client, note every annoying step, automate that step. You get paid to write the spec.

**On content:** two YouTube videos and two long-form AEO articles per month, paired so one recording session feeds both. The four best article topics nobody has covered well: why Stripe and CRM totals don't match, contracted vs cash collected, what each offer costs to sell, and pipeline objects vs order objects.

**On ads:** $10–20/day, Messages objective not conversions (at that budget you'd never exit Meta's learning phase optimizing for purchase). One campaign, one ad set, three creatives, broad targeting.

**The north star:** revenue from a stranger-adjacent buyer within 30 days.

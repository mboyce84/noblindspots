# NOBLINDSPOTS — SYSTEM ARCHITECTURE SPECIFICATION
**Version:** 1.0
**Status:** Design — pre-build
**Audience:** engineering, builder agent, future you

---

# 1. PURPOSE

Define how NoBlindSpots serves structurally different businesses (coaching with a sales team, event, consulting, agency) from one codebase, without building bespoke software per client and without shipping a blank canvas nobody finishes.

**The problem being solved architecturally:**

Every existing option fails at one of two extremes.

| Extreme | Example | Failure |
|---|---|---|
| Fully generic | Looker Studio, Metabase | Blank canvas. Non-technical owner abandons it. |
| Fully fixed | TEDi | Eight prebuilt dashboards, no customization. Their own FAQ: *"Can I customize TEDi? Not directly, and you shouldn't need to."* Learning curve measured in months. |

NoBlindSpots sits between: **opinionated defaults, progressive customization.**

---

# 2. TERMINOLOGY — LOCKED

Drop "applet." It's ambiguous and implies installable mini-apps. Use these four terms consistently in code, docs, and UI.

| Term | Definition | Example |
|---|---|---|
| **Metric** | A single defined number, with its calculation rules | `cash_collected`, `show_rate` |
| **Widget** | A metric rendered a specific way | Big number with trend · Leaderboard · Funnel |
| **View** | A set of widgets scoped to one audience or role | Executive view · Closer view |
| **Template** | A starter bundle of metrics + widgets + views for a business type | FBASU (coaching sales team) · Event · Consultant |

**FBASU is a Template**, not a separate product. That resolves the earlier ambiguity.

---

# 3. ARCHITECTURE — FIVE LAYERS

```
┌─────────────────────────────────────────────────────┐
│  5. PRESENTATION   React views, rendering, sharing  │
├─────────────────────────────────────────────────────┤
│  4. COMPOSITION    Templates → Views → Widgets      │
├─────────────────────────────────────────────────────┤
│  3. SEMANTIC       Metric definitions ← THE PRODUCT │
├─────────────────────────────────────────────────────┤
│  2. NORMALIZED     contacts, transactions, etc.     │
├─────────────────────────────────────────────────────┤
│  1. INGESTION      CSV, webhooks, scheduled export  │
└─────────────────────────────────────────────────────┘
```

**Layers 1–2 are already specced** in `master-brain-architecture.md` (upsert on `UNIQUE (org_id, source, source_id)`, never append).

**Layer 3 is the part that doesn't exist yet and is the actual moat.** Anyone can render a chart. Encoding that "cash collected" ≠ "contracted revenue," that show rate's denominator excludes cancellations, that margin needs commission and processing fees subtracted — that's domain knowledge, and it's what a competitor can't clone by looking at screenshots.

---

# 4. THE SEMANTIC LAYER (Layer 3)

## 4.1 Metric definition schema

Metrics are **data, not code.** Stored as JSON in Postgres, versioned, editable through the UI. Adding a metric never requires a deploy.

```json
{
  "id": "cash_collected",
  "label": "Cash Collected",
  "description": "Money that actually landed, net of fees and refunds. Not contracted value.",
  "type": "sum",
  "source": "transactions",
  "field": "amount_net",
  "filters": [
    { "field": "status", "op": "eq", "value": "succeeded" },
    { "field": "refunded", "op": "eq", "value": false }
  ],
  "format": "currency",
  "grains": ["day", "week", "month"],
  "tier": "headline",
  "owner_role": "executive",
  "target": { "type": "monthly", "value": 100000 },
  "action_note": "If this is off pace, check booked→showed before spending on leads.",
  "verify": true
}
```

**Metric types:**

| Type | Purpose | Required fields |
|---|---|---|
| `count` | Row count | `source`, `filters`, optional `distinct_on` |
| `sum` | Total of a numeric field | `source`, `field`, `filters` |
| `avg` | Mean | `source`, `field`, `filters` |
| `ratio` | Conversion rate | `numerator{}`, `denominator{}` |
| `derived` | Arithmetic across metrics | `expression`, optional `group_by` |
| `duration` | Elapsed time between events | `start_field`, `end_field`, `unit` |

**Ratio example — show rate, with the denominator subtlety that matters:**

```json
{
  "id": "show_rate",
  "label": "Show Rate",
  "type": "ratio",
  "numerator":   { "source": "appointments", "type": "count",
                   "filters": [{ "field": "status", "op": "eq", "value": "showed" }] },
  "denominator": { "source": "appointments", "type": "count",
                   "filters": [{ "field": "status", "op": "in",
                                 "value": ["showed", "no_show"] }] },
  "format": "percent",
  "benchmark": 0.70,
  "tier": "headline",
  "owner_role": "sales_manager"
}
```

*Note the denominator excludes cancelled and rescheduled. That single decision is the difference between a trustworthy number and a wrong one, and it's exactly the kind of thing a template encodes so the customer never has to get it right themselves.*

**Derived example — the margin view, the differentiator:**

```json
{
  "id": "contribution_margin",
  "label": "Contribution Margin",
  "type": "derived",
  "expression": "cash_collected - ad_spend - commissions - processing_fees - direct_expenses",
  "group_by": "offer_slug",
  "format": "currency",
  "tier": "headline",
  "owner_role": "executive"
}
```

## 4.2 Two fields that aren't standard BI, and why they matter

**`tier`** — `headline` or `supporting`. This encodes the Module 1 teaching directly into the product: a small set of headline numbers above the fold, supporting breakdowns underneath. Not a fixed count. Enforced softly at the View level (warn above ~7 headline widgets, don't block).

**`action_note`** — free text answering "what do I do if this moves." Surfaces on hover and in the drill-through drawer. This is Lesson 1.5 made into a product feature, and it's the thing that stops a dashboard from becoming wallpaper.

## 4.3 Verification (`verify: true`)

Every metric with `verify` renders as clickable. Clicking opens a drawer showing:

- The calculation in plain language
- The filter conditions applied
- Matching row count
- Scrollable table of the underlying rows
- CSV export of those rows

**This is a support tool as much as a feature.** When a client says "that number's wrong," the answer is "click it." It also directly answers the trust objection prospects have voiced about AI-generated numbers they couldn't verify.

---

# 5. COMPOSITION LAYER (Layer 4)

## 5.1 Widget

```json
{
  "id": "w_cash_headline",
  "metric_id": "cash_collected",
  "viz": "big_number",
  "options": {
    "comparison": "prev_period",
    "sparkline": true,
    "show_target": true
  },
  "size": { "w": 1, "h": 1 }
}
```

**Viz types and when the system should default to each:**

| Viz | Use for | Auto-selected when |
|---|---|---|
| `big_number` | Headline metrics | `tier: headline`, no `group_by` |
| `trend_line` | Anything over time | grain requested, single series |
| `bar_breakdown` | Comparison across a dimension | `group_by` present, <12 categories |
| `leaderboard` | People | `group_by` is a user field |
| `funnel` | Stage sequences | metric is part of a defined `chain` |
| `table` | Detail / export | `tier: supporting`, many columns |
| `alert_list` | Risk items | metric has a `threshold` |

**Rule from Module 4, enforced in defaults:** rates get big numbers with trend, never pie charts. People get leaderboards. Stages get funnels with drop-off labeled between steps. Money gets a two-line series (contracted vs collected).

## 5.2 View

```json
{
  "id": "v_executive",
  "label": "Executive",
  "audience": "internal",
  "role": "executive",
  "headline_widgets": ["w_cash_headline", "w_leads_headline", "w_show_rate", "w_margin"],
  "supporting_widgets": ["w_rev_by_offer", "w_closer_leaderboard", "w_source_breakdown"],
  "filters_exposed": ["date_range", "offer_slug"],
  "row_filter": null
}
```

`row_filter` is what enables client-safe sharing — a view scoped to `client_id = X` shows only that client's rows, enforced server-side.

## 5.3 Template

```json
{
  "id": "tpl_coaching_sales_team",
  "label": "Coaching business with a sales team",
  "internal_name": "FBASU",
  "required_sources": ["ghl", "stripe"],
  "optional_sources": ["quickbooks", "meta_ads", "other_processor"],
  "required_fields": [
    { "key": "appointment_status", "hint": "GHL appointment status" },
    { "key": "opportunity_stage",  "hint": "GHL pipeline stage" },
    { "key": "assigned_user",      "hint": "closer or setter on the record" }
  ],
  "chain": ["lead", "contacted", "booked", "showed", "closed"],
  "benchmarks": { "lead_to_booked": 0.25, "booked_to_showed": 0.70, "showed_to_closed": 0.25 },
  "metrics": ["leads_in", "booked_calls", "show_rate", "close_rate",
              "cash_collected", "contribution_margin", "speed_to_lead", "..."],
  "views": ["v_executive", "v_phone_setter", "v_dm_setter", "v_closer"],
  "role_map": { "executive": "v_executive", "closer": "v_closer" }
}
```

**Launch template library:**

| Template | Status | Source |
|---|---|---|
| Coaching business with a sales team | Built | FBASU |
| Event / ticketed business | Built | EFW |
| DM-led sales pipeline | Built | Carly's tracker |
| Consultant / service provider | To build | Elise's setup |
| Agency (multi-client) | Later | — |

---

# 6. THE CUSTOMIZATION LADDER

The single most important design decision in the product. Never blocked, never overwhelmed.

| Level | Action | Who | Effort |
|---|---|---|---|
| **0** | Pick a template | Everyone, at onboarding | 1 click |
| **1** | Toggle widgets on/off, reorder | Anyone | seconds |
| **2** | Edit a metric's filters, target, or benchmark via form | Owner | minutes |
| **3** | Build a new metric from mapped fields, guided | Owner | ~10 min |
| **4** | Custom expression / raw SQL | Power user, agency tier | as needed |
| **5** | Request a build | DFY customer | paid |

**The compounding loop:** every Level-5 DFY build produces a config that gets saved as a new template or as new metrics in the shared library. The library grows with every client engagement, and it's a moat that strengthens over time rather than a feature that gets cloned.

**This is the direct answer to TEDi.** They stop at Level 0. Carly hits the Level 2–3 wall every month and currently has to ask you.

---

# 7. ONBOARDING FLOW

Target: **working dashboard in under 30 minutes.** TEDi's own copy admits theirs takes months and "may feel intimidating." That gap is the wedge.

```
1. Create org
2. "What kind of business?"        → template selected
3. Connect or upload               → CSV upload works day one; webhooks optional
4. Column mapping                  → Claude-assisted, confidence-scored, always overridable
5. Template instantiates           → metrics + views created with real data
6. Headline review                 → "These are your headline numbers. Keep or change."
7. Done                            → dashboard live, shareable
```

**Step 6 is where the teaching and the product meet.** It's Module 1's sorting exercise, performed inside the app, on their real data. A member who did the course recognizes it immediately; one who didn't gets taught by using it.

---

# 8. DATA MODEL — LAYER 3+ ADDITIONS

Layers 1–2 unchanged from `master-brain-architecture.md`. New tables:

```sql
templates          id, slug, label, version, definition_json, is_public
metrics            id, org_id, template_id, slug, label, definition_json,
                   tier, owner_role, is_custom, created_by, version
                   UNIQUE (org_id, slug)
widgets            id, org_id, metric_id, viz, options_json, size_json
views              id, org_id, slug, label, audience, role,
                   layout_json, row_filter_json
                   UNIQUE (org_id, slug)
view_widgets       view_id, widget_id, position, tier
metric_snapshots   id, org_id, metric_id, grain, period_start,
                   value, computed_at
                   UNIQUE (org_id, metric_id, grain, period_start)
share_links        id, org_id, view_id, token, row_filter_json,
                   expires_at, password_hash, revoked_at
audit_log          id, org_id, actor_id, action, target_type, target_id, at
```

**`metric_snapshots` matters more than it looks.** Precomputing values per grain keeps dashboards fast, makes trend comparison trivial, and is the substrate for cross-client benchmarking later. Design it now even though benchmarks ship in year two.

---

# 9. NON-FUNCTIONAL REQUIREMENTS

| Area | Requirement |
|---|---|
| **Tenancy** | Every query scoped by `org_id` at the data layer, not the app layer. Postgres RLS. |
| **Performance** | Dashboard load <2s on 100k rows. Snapshots precomputed, not live-aggregated. |
| **Sharing** | Row filters enforced server-side. Client-side manipulation must not reveal unfiltered data. |
| **Auditability** | Every metric value traceable to source rows. Every share-link access logged. |
| **Ingest observability** | `ingest_runs` populated on every load. "Why is this number wrong" answerable without guessing. |
| **AI cost** | Claude called on upload (column mapping) and on reconciliation narrative only. Never on dashboard view. Cache by header signature. |

---

# 10. BUILD SEQUENCE

1. Layers 1–2: schema, upsert rule, CSV ingestion, `ingest_runs`
2. Layer 3: metric definition engine + query compiler (JSON → SQL)
3. Verification drill-through — build alongside the engine, not after
4. Layer 4: widgets, views, one hardcoded template (FBASU)
5. Layer 5: rendering, sharing, row filters
6. Template picker + Claude column mapping
7. Customization ladder Levels 1–3
8. Financial layer metrics (margin, CAC)
9. Webhooks for GHL + Stripe
10. Additional templates

**Steps 1–5 with FBASU hardcoded is a shippable product for one segment.** Don't build the template system until FBASU works end to end on a real client's data — otherwise you're generalizing from one example, which is how abstraction goes wrong.

---

# 11. OPEN DECISIONS

These need answering before or early in the build:

1. **Metric versioning** — when a definition changes, do historical snapshots recompute or stay frozen? *Recommendation: freeze, and flag the definition change on the trend line, so history stays honest.*
2. **Multi-currency** — out of scope for v1, but does the schema carry a currency field now? *Recommendation: yes, cheap to add, painful to retrofit.*
3. **Who owns a custom metric** — org-scoped only, or promotable to the shared library? *Recommendation: org-scoped by default, manual promotion by you, since promotion is how the library compounds.*
4. **Template updates** — if FBASU v2 ships, do existing orgs get it? *Recommendation: opt-in with a diff preview. Silent changes to someone's dashboard destroy trust.*
5. **Benchmark participation** — opt-in or automatic once anonymized? *Legal and trust question, needs deciding before any cross-client aggregation is written.*

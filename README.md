# Microsoft Project Coordinator — Learning Command Center

A local-first, interactive learning app for transitioning into Microsoft-centric
IT project coordination. The centerpiece is an interactive **Ecosystem Map** —
a layered terrain model of how Microsoft 365, identity, endpoint management,
Azure infrastructure, security, and project delivery controls fit together —
alongside learning tracks, a glossary, retrieval drills, a scenario lab, a
RAID trainer, a cutover-runbook trainer, interview prep, a 21-day study plan,
and local progress tracking.

No backend. No account. No paid dependency. Everything is stored in your
browser via `localStorage`.

## Accuracy approach

This app deliberately separates four kinds of content everywhere it appears:

1. **Verified factual content** — tagged with a source badge, linking to an
   entry in `src/content/sources.ts` (official Microsoft Learn pages, or
   TrustedTech company pages).
2. **User-authored notes** — STAR stories, day notes — visually distinct and
   never treated as fact.
3. **Scenario/simulation content** — the Scenario Lab is fixed, hand-written
   simulation data, not real customer data and not dynamically generated.
4. **Assumptions / illustrative examples** — labeled as such in place (e.g.
   military/operations analogies are explicitly marked "conceptual analogy,
   not a technical definition").

Specific rules baked into the content:

- **MS-900 is marked retired** (March 31, 2026) everywhere it's referenced —
  see the Sources view and Command Center certification notices.
- **AZ-900 is presented as active**, per the source baseline date recorded in
  `src/content/sources.ts` (`SOURCE_BASELINE_DATE`).
- **AB-900 is never called a one-for-one replacement for MS-900** — it's
  presented only as current Microsoft 365 beginner/admin material.
- **Licensing content carries a "verify current information" note** rather
  than hard-coded entitlements or prices, since licensing changes.

## Tech stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router for navigation
- React Flow for the ecosystem map / dependency graph
- Framer Motion for purposeful, reduced-motion-aware animation
- Recharts-ready (progress bars are custom; swap in Recharts if you want
  richer charts later)
- Zustand (`persist` middleware) for local state — quiz history, progress,
  notes, pinned concepts, STAR stories — all in `localStorage`
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint        # oxlint
```

## Deploying to GitHub Pages

The Vite config switches its `base` path to `/msft-learning/` only when built
with `--mode gh-pages` (see `vite.config.ts`), so local dev and a normal
`npm run build` are unaffected.

**Option A — GitHub Actions (included):** `.github/workflows/deploy.yml`
builds and deploys automatically on every push to `main`. In your repo
settings, set **Settings → Pages → Source** to **GitHub Actions**. No
further setup needed.

**Option B — manual:**

```bash
npm run build:pages     # builds to dist/ with the /msft-learning/ base path
npx gh-pages -d dist    # or: push the contents of dist/ to a gh-pages branch
```

If your repository name isn't `msft-learning`, update the `base` value in
`vite.config.ts` to match (`/<your-repo-name>/`), or set it to `/` if you're
deploying to a custom domain or a user/org root site.

## Project structure

```
src/
  content/            # All factual/learning content — data, not JSX
    types.ts          # Shared content type definitions
    sources.ts        # Source registry — every factual item cites an id here
    concepts.ts        # ~68 ecosystem concepts (definitions, dependencies,
                       #   PM questions, analogies, sources)
    glossary.ts        # 100+ glossary terms (generated from concepts + extras)
    tracks.ts           # 9 learning tracks + their modules
    questions.ts        # 85+ retrieval-drill questions, all types
    scenarios.ts        # 5 Scenario Lab simulations
    studyPlan.ts         # 21-day study plan
    militaryTranslation.ts
    readiness.ts         # Explicit readiness checklist (no fake score)
    raidCards.ts          # RAID Trainer cards
    cutoverPhases.ts       # Cutover Trainer starter phases
    interviewQuestions.ts   # Interview Prep Part A content
    mapLayout.ts             # Which concepts render on the Ecosystem Map,
                             #   and in which layer

  state/
    store.ts            # Zustand store + localStorage persistence

  lib/
    scoring.ts           # Spaced-review box logic, mastery bands, seeded
                          #   shuffle — deterministic, no fabricated precision
    mapGraph.ts            # Builds React Flow nodes/edges from concepts
    search.ts               # Global search index (Cmd/Ctrl+K)
    progress.ts               # Domain mastery / weak-concept / streak calc

  components/
    layout/               # App shell, nav rail, theme toggle, command palette
    common/                # Source badges, status tags, drawer, progress bar
    map/                    # Ecosystem map node + concept detail drawer
    knowledge/                # The 9-level "knowledge stack" building block

  views/                      # One component per top-level mode/route
```

## Updating content later

Everything factual lives in `src/content/*.ts` as plain typed data — no JSX
to hunt through. To add or correct something:

- **New/updated fact or link:** edit `src/content/sources.ts`, then reference
  its `id` from any concept, question, module, or day via `sourceIds`.
- **New concept:** add an entry to `src/content/concepts.ts`. If it should
  appear on the Ecosystem Map, also add its id to the right layer in
  `src/content/mapLayout.ts`.
- **New glossary-only term** (no full concept needed): add it to the
  `extras` array in `src/content/glossary.ts`.
- **New quiz question:** append to `src/content/questions.ts` — pick a
  `type` (see `QuestionType` in `types.ts`), and cite `sourceIds`.
- **Certification/licensing status changes:** update the relevant `Source`
  entry's `status`/`retiredDate`/`notes` in `sources.ts` — the Sources view,
  Command Center notices, and any `<SourceBadge>` pick it up automatically.

## Known limitations / TODO

- Content is conceptual and conservative by design — it does not attempt to
  cover every AZ-900/SC-900 exam objective in exhaustive depth.
- License terms, pricing, and exact product naming should always be
  re-verified against the linked Microsoft Learn / TrustedTech pages before
  being relied on in a real conversation — see the in-app "verify current
  information" notes.
- The production bundle currently ships as a single JS chunk (~790KB raw /
  ~236KB gzipped, dominated by React Flow + Framer Motion). Code-splitting
  the Scenario Lab / Ecosystem Map behind `React.lazy()` would reduce initial
  load if that becomes a priority.
- Scenario Lab timelines/sequencing reuse the standalone Cutover Trainer
  rather than embedding a second sequencing widget per scenario.

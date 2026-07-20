# CLAUDE.md — Prep.io

You (Claude) are building a **high-fidelity front-end prototype** of Prep.io — a
live streaming platform shaped like a college club fair, where verified
professionals hold drop-in "office hours" about their careers. Read this fully at
session start.

## Authoritative docs (read before building)

1. `docs/PREP_PRD.md` — **source of truth for product behavior**: personas,
   principles (§5 — non-negotiable), experience spec, screens, prototype tiers,
   acceptance criteria.
2. `docs/CONCEPT.md` — market research + decision log D1–D6. Don't re-litigate
   settled decisions (mocked prototype not real infra; scheduled-events-first;
   the funnel; the name). Conflicts → flag, don't build.

**Model split (Paul's decision):** Prep.io sessions — design and build — run on
**Fable**. Sonnet is only for mechanical data-labor chores, of which this project
has essentially none.

## THE NON-NEGOTIABLE PRINCIPLES (short form — full text PRD §5)

Violating one is a failure even if the feature works. Flag instead of building.

1. **Monetize the host's time/tools — never visibility.** Nothing in discovery
   reads a payment flag.
2. **Verified means verified.** Unverified hosts clearly marked, everywhere.
3. **No feed.** Discovery = fair floor + calendar. No algorithmic scroll.
4. **Lurking is first-class.** No signup wall on public rooms.
5. **Honest liveness — enforced in the store.** Viewer counts, chat, and queue
   derive from the crowd simulation; hardcoded inflated numbers are forbidden.
   Non-live rooms are labeled archives.
6. **Funnel ascends only by consent.** Crowd → hand → hot seat → breakout: each
   step explicit opt-in by both sides. No cold pulls on stage.
7. **No DMs / inbox.** Follow-ups are scheduled sessions or breakouts only.

## Stack & architecture

React 18 + TypeScript + Vite + Tailwind + Zustand + Framer Motion.

- **One Zustand store** (`store/usePrepStore.ts`), persisted; invariants live in
  the actions (e.g. hot-seat promotion requires a queued, consenting hand).
- **Crowd simulation engine** (`lib/crowd/`) — the prototype's technical heart:
  scripted chat personas with typing rhythms, arrivals/departures driving the real
  viewer count, hand-raise events. Optional **LLM personas** via a Vite dev proxy
  (a working scripted/LLM engine with silent fallback exists at
  `../iso-prototype/src/lib/partner/` + its `vite.config.ts` proxy — lift the
  pattern; env key only, never in browser code, no proxy on Pages = scripted there).
- **Mocked video:** no real streams — ambient looping avatar/waveform treatment
  (PRD open question 1; decide in the Tier 1 design pass).
- Base-path-safe public asset URLs via an `asset()` helper; router `basename`
  from `BASE_URL`; GitHub Pages deploy with repo-scoped base path (a working
  workflow exists at `../iso-prototype/.github/workflows/deploy.yml`).

## Design direction (PINNED — revise deliberately in `src/styles/tokens.css`)

**"Financial editorial"** (CONCEPT.md D8, replaced campus-at-night 2026-07-20):
warm paper `#FAF8F4` + ink `#191712` shell for every browse surface; the
live rooms (viewer, host, breakout) are the one dark place — the `.theater`
CSS scope flips the same tokens to warm near-black `#171512`. Exactly three
color roles, all semantic: **ink** = primary actions (black buttons),
**crimson `#B0402D`** = LIVE/on-air/end only, **green `#1C5C41` reserved for
VERIFIED** — nothing else gets color. Type: Newsreader (editorial serif
display + italic wordmark) / Inter (UI, body 15px). Overline labels via the
`.overline` class (Tailwind's `overline` utility is neutralized there).
Large type and negative space are the aesthetic — headers 24–32px serif,
whitespace over boxes. Copy voice: factual and confident, never winking;
"has the floor," not exclamation points. No emoji in UI chrome — the stroke
icon set lives in `src/components/icons.tsx`; add glyphs there. Mocked
video = ambient avatar + waveform stage (CONCEPT.md D7).

## Build order

Prototype tiers from PRD §12 — Tier 1 (fair → live room → raise hand → hot seat
loop with simulated crowd) is the demo and comes first. Plan-then-build before
each tier; confirm the plan against the PRD. The **hot-seat promotion** is the
signature motion beat — budget polish time for it.

## Commands (keep current as they materialize)

- `npm install` · `npm run dev` (+ `?debug`) · `npm run build` · `npm run preview`
- `.env` ← `.env.example` with `ANTHROPIC_API_KEY` for LLM crowd (optional,
  never committed, never in browser code).

## `?debug` panel (required, all tiers)

Force viewer surge · pick section/persona set · promote yourself to hot seat ·
toggle LLM crowd · simulate host verification states · reset state.

## Gotchas & working style

- Dev-only console handle: `window.prepStore` (the Zustand store) — drive
  any flow from the console when testing.
- Paul reviews by looking at the running app — verify visually (screenshots)
  before declaring done; he communicates in feel ("gentler," "feels cheap") —
  translate to tokenized changes, don't ask for pixel values.
- Before declaring done: `npx tsc -b`, `npm run build`, browser verification;
  keep a `VALIDATION.md` traced to PRD §13.
- The demo story is one section rich (likely Finance) + seven sparse — that's
  honest to the cold-start strategy, not a content gap to "fix."

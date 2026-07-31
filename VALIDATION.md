# VALIDATION.md — Prep.io prototype

Traced against **PRD §13 acceptance criteria**. Verified 2026-07-20 in Chrome
(mobile viewport 375×812) against the dev build; `npx tsc -b` and
`npm run build` clean.

## PRD §13 acceptance criteria

### 1. The core loop has no dead ends (mobile viewport) — PASS
Splash → "Walk the fair" → fair floor → tap a live room → lurk → raise hand
(consent sheet with a written question) → queued with visible position →
promoted by the host → **"You're up"** threshold moment → banner
"YOU'RE ON THE HOT SEAT" + ON AIR pill → answered in front of the room →
step down → back in the crowd. Verified end-to-end on 375×812.
Non-existent rooms, non-live rooms, and empty states all render a way back
to the fair — no dead ends found.

### 2. All liveness derives from the crowd simulation — PASS
- Viewer counts: seeded per session (`seedViewers`), then driven only by
  `driftFloor` (fair) and the engine's arrival/departure walk (in-room).
  Observed drifting on the fair (134→132→129…) and in-room (135→160).
- Chat, queue, and hand-raises are all engine events writing through store
  actions (`simPushChat`, `simRaiseHand`); nothing renders a literal count.
- Debug "+40 surge" visibly ramps the count over a few ticks with a system
  line in chat. Verified.
- Live room state is deliberately **not persisted** — reload never
  resurrects a stale "live" room (fake liveness on reload is impossible).

### 3. Verified vs unverified distinct on every host surface — PASS
Badge component renders on: fair cards, section cards, live room stage,
scheduled rails, host profile (plus an explicit warning callout for
unverified), VOD player byline, go-live wizard ("You'll appear as"), and the
host room header. Unverified is a persistent gray shield-question chip;
verified is the app's only green. Verified for Maya (verified-role),
Jae Hoon (verified-school), Grace/Sofia (unverified).

### 4. Nothing ranks people or reads a payment flag — PASS
- Fair ordering is the fixed floor plan (section order); live lists are
  seed-data order; hosts listed per booth. No sort by followers/score.
- No `isPlus`/payment flag exists in discovery code; breakout `rate` is read
  only inside the room (offer sheet) and the wizard. Grep-verified: `rate`
  never appears in Fair/Section list ordering.

### 5. Sessions end in a recap; archives never fake-live — PASS
- Host "End" always produces a recap (peak viewers, hands, questions
  answered, follows) and mints a chaptered VOD into "Your library."
  A hot seat interrupted by ending the session is still credited.
- VODs are labeled `Recorded · <date>` everywhere (library rows and player);
  `joinRoom` refuses non-live sessions in the store, and the room route
  renders an archive redirect card instead.

### 6. LLM crowd degrades silently — PASS
With no `ANTHROPIC_API_KEY`, the dev proxy returns 503, `llm.ts` marks the
engine dead, and chat continues from scripted pools with **zero console
errors**. On the static Pages build there is no proxy, so it is always
scripted there. Key stays server-side in the Vite proxy.

### 7. Builds clean; deployed — PASS
`npx tsc -b` clean · `npm run build` clean (≈375 kB JS, 116 kB gzip).
Deployed via GitHub Pages workflow (repo-scoped base path, SPA 404
fallback); verified live after deploy.

## Principle audit (PRD §5)

| Principle | Where enforced | Status |
|---|---|---|
| 1. Monetize time, never visibility | No discovery code reads `rate`; breakout is host-offered, viewer-accepted | PASS |
| 2. Verified means verified | Badge only set by the verification flow (or debug); unverified marked everywhere | PASS |
| 3. No feed | Discovery = fair + calendar rail only; follows → calendar entries + alerts | PASS |
| 4. Lurking first-class | No signup anywhere; rooms open for anonymous viewers | PASS |
| 5. Honest liveness | Store: counts/chat/queue only via sim actions; room state not persisted; archives labeled | PASS |
| 6. Funnel ascends by consent | `promoteHand` no-ops unless the hand is queued (raised = opt-in); breakout needs offer **and** accept | PASS |
| 7. No DMs/inbox | No message-thread state exists; composer footer says so | PASS |

## Known deferred / honest notes

- `elapsedSec` ticks via chained 1s timeouts, so under heavy animation load
  the room clock can run a few percent slow relative to wall time. Chapter
  stamps remain internally consistent. Acceptable for the prototype.
- The hot-seat "You're up" overlay lasts 2.6s and is not screen-reader
  announced; the persistent banner carries the state.
- Scheduled sessions are display labels (no real clock); "Schedule it" in
  the wizard toasts and returns — intentionally stubbed.
- Persona chat lines intentionally read casual (user-generated content);
  UI chrome itself contains no emoji, per the design rules.
- One section rich (Finance), seven sparse — intentional (cold-start story).

## V2 additions (2026-07-20, per Paul's 12-feature request; decisions D9–D14)

Verified in-browser on mobile viewport, `tsc -b` + `npm run build` clean:

- **Search** (`/search`): "BCG" surfaces the company, Elena Sorokin, her
  ticketed case jam, and recordings. Companies browsable when query empty.
- **Company pages** (`/company/:id`): people, live, events, recordings;
  add-to-goals chip; empty state honest ("No one from X hosts here yet").
- **Explore** (D10): explicit goal chips drive finite labeled shelves
  ("because you're targeting Finance, Consulting, Goldman Sachs"). No
  behavioral inference, no infinite scroll.
- **History**: joins/recordings/shorts recorded locally (cap 50), Library →
  History; clearable. Private to the browser.
- **Subscriptions & tiers** (D13): free subscribe = alerts; Supporter/Inner
  circle tiers stubbed with perks; membership unlocks that channel's
  premium recordings.
- **Ticketed events + $1 commit** (D12): capacity enforced in the store
  (full events refuse reservation); "Commit to Your Learning — $1 to hold
  your seat… refunded when you attend" verified on the networking event;
  tickets appear in Library with release option.
- **Boosts** (D9): points purchase stubbed; boosted question (200 pts)
  pinned in host view, sim host picked it first, points debited, host
  earnings tracked in recap. Promotion still flows through `promoteHand`
  (consent gate untouched). Boosted chat renders highlighted.
- **LinkedIn sync**: stubbed connect in Settings; feeds verification.
- **Video mode**: `video: true` sessions render the mocked-camera stage;
  go-live wizard has a camera toggle.
- **Shorts**: clip player with prev/next (finite, "1 / 8"), channel Shorts
  tab, shelves on Home/Explore/Search. Never an infinite feed.
- **Premium** (D11): gate verified both ways (locked pitch when off,
  unlocked player when on); AI transcript downloads a composed .txt;
  playlists create/add/reorder-by-add/delete verified ("IB prep sprint",
  3 items across a members recording, a short, and a free VOD).
- **Principle audit still holds**: live rooms never gated, counts still
  sim-driven, promotion still consent-only, no DMs, discovery reads no
  payment flags (boost pinning exists only inside the host's queue view).

## D15 additions (2026-07-20): desktop shell + plain white/black

- Palette: plain `#FFFFFF` background, `#000000` text, neutral grays; theater
  rooms neutral near-black `#0F0F0F`. Crimson LIVE + green verified unchanged.
- Desktop (lg+), verified at 1440×900: sidebar (nav, Subscriptions with live
  dots, The floor with live dots, Premium/Settings pinned), centered search
  bar, Home as a 3–4 column thumbnail grid with an events row, recordings in
  the watch layout (player left, chapters right), live rooms in the Twitch
  split (stage left, 360px chat rail right with its own composer).
- Mobile (375×812) re-verified: single column, bottom tabs, no sidebar.
- `tsc -b` + `npm run build` clean.

## V3 additions (2026-07-30): glass, motion, dark theme, Campus mode (D16–D17)

Verified with headless Playwright at 1440×950 and 400×860, both themes, both
modes; `npx tsc -b` and `npm run build` clean, zero console/page errors.

- **Dark theme** — neutral graphite, applied by the store's single writer;
  no flash on reload, `system` keeps tracking the OS after load. Verified on
  fair, campus, course channel, search, splash.
- **Liquid Glass** — top bar, floating dock, sheets, toasts, control pills.
  Content surfaces stay opaque. `prefers-reduced-transparency` falls back to
  solid in both themes.
- **Motion** — one `Pressable` carries every tap (dip / optional lift /
  magnetic / ripple); `SpotlightCard` adds pointer light and ≤5° tilt;
  `Dock` magnifies on pointer distance; `SegmentedSwitch` and the sidebar
  share a travelling `layoutId` pill; live viewer counts animate per changed
  digit. All from `lib/motion.ts` presets.
- **Campus mode** — mode switch reframes sidebar, dock, search placeholder,
  and search index. Course channel tabs (live & upcoming / recordings /
  clips / staff), Teach hub goes live to the course channel, and a course
  office-hours room reuses the live room + crowd sim + hand-raise funnel
  unchanged. Campus rooms draw student-flavored chat and questions.
- **Isolation held** — no course session appears on the fair floor or in
  careers search, and no career session appears in campus surfaces.

### Fixed during self-review (before ship)
- Ambient field was 0.16 alpha in dark and read as coloured smudges behind
  the thumbnails; dialed to 0.05–0.07.
- Glass dock at 0.58 alpha + 34px blur (0.70 went milky-grey over a dark
  thumbnail).
- Sidebar course chips truncated to "CS5"/"STA"/"EC1"; now letters-only
  (CS / STAT / EC).
- A wrapped meta line could orphan a leading "·" on This week cards.
- Campus-mode search returned careers results; now has its own index.
- Campus rooms used careers chat lines (recruiting talk in a CS50 room).
- Live-room stage capped (`max-h-[52vh]`) and chat has an empty state.

### Known, deliberate
- Entrance animations gate content visibility, so a browser pane that
  suspends rAF (occluded/background) renders text at opacity 0 until it is
  focused. Real users are unaffected; captures must use a visible renderer.
- The desktop live-room left column is sparse until hands are raised.

## Watermelon components + route-driven mode (2026-07-31)

Verified against the production build (`vite preview`), headless Chromium at
1440×900, cold storage:

- `CopyConfirm` in the CS50 channel writes
  `https://prep.io/campus/course/cs50` to the clipboard, swaps link → check,
  and morphs the label per character. Same component in Teach reads "Copy the
  class link."
- `ExpandDetails` opens and closes with the mirrored width/height
  choreography; captured mid-animation frames show the container widening
  before it grows tall. Rows resolve live data — Prof. David Chen / Fall 2026
  / 742 / 1 / 2.
- Deep-linking to `/campus/course/cs50` with `mode` persisted as `careers`
  now renders campus navigation (My courses · Library · Teach · CS50 · STAT
  110 · EC 10). Before the fix it rendered the careers sidebar around course
  content.
- No console errors or page errors in any stage. `npx tsc -b` and
  `npm run build` clean (494.62 kB JS / 143.40 kB gzip).

Note: an "invalid hook call" seen once during interactive testing was a
stale-HMR artifact from editing component files mid-session — `npm ls react`
shows a single deduped 18.3.1, and the production build is clean across
repeated runs.

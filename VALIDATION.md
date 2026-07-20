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
- VODs are labeled `ARCHIVE · <date>` everywhere (library rows and player);
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

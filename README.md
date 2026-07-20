# Prep.io — prototype

A high-fidelity, interactive front-end prototype of **Prep.io** — a live
streaming platform shaped like a college club fair, where verified
professionals hold drop-in "office hours" about their careers and viewers
move from lurking in the crowd, to the hot seat, to 1:1 help.

Everything is mocked: the crowd is a simulation (scripted personas driving
real viewer counts, chat, and hand-raises), video is an ambient
avatar-and-waveform stage, payments and verification are stubbed. The point
is the product thinking made visible in the interface — the fair, the
one-to-many-to-one funnel, honest liveness, verified context.

**Docs:** [`docs/PREP_PRD.md`](docs/PREP_PRD.md) (product spec) ·
[`docs/CONCEPT.md`](docs/CONCEPT.md) (research + decision log) ·
[`VALIDATION.md`](VALIDATION.md) (acceptance-criteria trace).

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run dev:host   # exposed on the LAN for phone testing
npm run build      # tsc -b + vite build → dist/
npm run preview    # serve the production build
```

Node 20+.

## Demo controls

Append **`?debug`** to any URL, then tap the gear (bottom-right):
force a viewer surge, fast-track yourself to the hot seat, toggle the LLM
crowd, set verification states, jump between live rooms, reset all state.

## The demo path

1. Splash → **Walk the fair** — live rooms with real (simulated) counts,
   the calendar rail, eight booths (Finance rich, the rest honestly sparse).
2. Join *"Superday week"* — lurk; chat and viewers move on their own.
3. **Raise your hand** with a question → watch the queue → the hot seat.
4. After your answer, the host may offer a **private breakout** ($, stubbed).
5. Tap **Host** → verify (stubbed review) → go-live wizard → run your own
   room: bring hands up, answer, end → **recap** → your session becomes a
   chaptered archive in your library.

## Optional: LLM-driven crowd (dev only)

```bash
cp .env.example .env   # set ANTHROPIC_API_KEY
```

The Vite dev server proxies `/api/crowd` to the Anthropic API, injecting the
key server-side — it never reaches browser code. Without a key (and always
on the static Pages build) the crowd falls back to scripted personas,
silently. Never commit a real `.env`.

## Stack

React 18 · TypeScript · Vite · Tailwind · Zustand (one store, invariants in
the actions) · Framer Motion. Deployed to GitHub Pages by
`.github/workflows/deploy.yml` on push to `main`.

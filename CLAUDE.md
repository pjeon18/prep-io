# CLAUDE.md — Prep.io

> **This document is a guide, not a lock.** When a decision here is superseded,
> edit this file as part of the change and say what changed. The product
> principles are the exception: raise a change rather than making it alone.

Prep.io is a **high-fidelity front-end prototype** of a live video platform
where **recruiters and employees host live sessions** and **people applying to
jobs** watch, chat, and ask questions. Everything is mocked. The current version
is V6 (CONCEPT D21, 2026-10-05): V5's light product (D20) rebuilt in forest
green with big type and motion.

## Paul's standing direction for this project (D20)

- Clean, corporate, **happy**. Model it on LinkedIn, with Instagram/Duolingo
  friendliness. **Never dark.**
- No AI tells: no slogans or punchy one-liners, no monospace small-caps labels,
  no "·"-joined metadata strings, no gimmick mechanics (the old "hot seat" is
  banned). Use plain sentence-case product language.
- Video/film: one thing in focus per shot, slow when it should be, no pop-ups.

## Docs

`docs/CONCEPT.md` is the decision log (D1–D21). D19, the dark "On Air" version,
was rejected; D20 set the product and D21 the current look. `docs/PREP_PRD.md` predates both, so D20 wins on
scope and look.

## Principles (short form)

1. **Honest liveness.** Every viewer count, chat line, question, and vote comes
   from `lib/sim.ts`. Never hardcode a live number.
2. **Verified means verified.** A green badge for verified hosts; unverified hosts
   get a plain note ("hasn't verified their employer yet").
3. **No feed, no ranking of people.** Home is finite; companies are alphabetical.
4. **No DMs.** Public chat and Q&A only.
5. Nothing is for sale in the prototype.

## Architecture

React 18 + TS + Vite + Tailwind + Zustand + Framer Motion. Font: Figtree.

- `store/useStore.ts` holds a single store. Only name, reminders, savedRoles,
  and following persist (key `prep-io-v5`). `window.prepStore` in dev.
- `lib/sim.ts`: the viewer-count ticker; the room engine (captions, chat, Q&A,
  upvotes, and the host taking the top question and answering it); and the
  Go-live engine.
- `data/seed.ts`: 8 companies, 14 hosts (one unverified), 7 live, 8 scheduled,
  and 6 recorded sessions.
- `components/people.tsx`: `Bust`, `Avatar`, `Room` (the illustrated home-office
  "video"), `CompanyLogo`, and `lookFor(name)`.
- `components/Stage.tsx` (the room, LIVE badge, rolling viewer count,
  captions); `Cards.tsx` (`Thumb`, `SessionCard`, `FollowButton`,
  `RemindButton`, `useCaptionLoop`); `Nav.tsx` (top bar, phone tab bar,
  ⌘K search panel, `Logo`, `Wordmark`, `pageIn`); `ui.tsx` (`Button` is the
  one home for tap physics, plus `Count`, `Words`, `Reveal`, `Segmented`,
  `Tabs`, `LiveBadge`, `Name`, `useStageNav` for the picture-to-stage
  transition).
- Screens: `Home` (featured room, then sections), `Session` (live / upcoming / recorded),
  `Companies` + `Company`, `Events`, `GoLive` (setup, console, summary).

Tokens: page `#fbfaf6`, line `#e8e5dd`, ink `#0e1c15`, brand `#0f5c3b`
(actions, selection, verified, answered), mint `#9fd8b5` (logo dot, caption
asker), live `#e5484d` (LIVE only). Type scale classes `t-display` … `t-meta`
in `styles/tokens.css`; nothing under 15px.

## Launch film

`launch/film.tsx` (V6) is a 32s, 1920×1080 composition in which every frame is a pure
function of `t`. Preview it at `/launch/` (`?t=12` to jump). Render with the dev
server running: `node launch/render.mjs http://localhost:<port> 60`, which writes
`launch/prep-io-launch.mp4`. It uses `launch/shots/home-v6.png` (a 2× capture of
the real home page, featured room = Rebecca Stein's Goldman session). The
room scene is that same session so the dive lands on the same person.
Recapture after home changes and keep the two in sync.

## Commands

`npm install` · `npm run dev` (+ `?debug`: more viewers, host answers my
question next, reset) · `npm run build`

## Gotchas

- `postcss.config.js` and `tailwind.config.js` use absolute paths. The preview
  harness can start Vite from the parent folder, and relative Tailwind paths
  then produce an unstyled page. PostCSS config is cached per server process, so
  restart the server after editing either file.
- The Claude browser pane runs occluded. Take screenshots with headless
  Playwright (`../iso-prototype/node_modules/playwright`).
- Don't run the film render in parallel with other headless tests; it
  crashed once from contention.

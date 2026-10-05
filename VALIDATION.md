# VALIDATION.md — Prep.io V5 (D20)

Checked 2026-09-30 with headless Chromium against the dev build at 1440×900 and
390×844. `npx tsc -b` is clean, and there are no console errors on any route.

- **Screens render as intended:** Home (3 columns), live session, upcoming
  session (countdown + Remind me), recording (question list), Companies,
  Company (Sessions/Jobs/People), Events, and Go live (setup, console,
  summary). Verified visually.
- **Q&A loop:** posting a question adds it with 1 vote. The host picks it up, the
  caption reads "Your question" and then the host's answer, the row shows
  "Being answered now", and then "Answered". Traced in the store: answered at
  about 26s after posting, with no debug help.
- **Honest liveness:** counts, chat, questions, and votes come only from
  `lib/sim.ts`. The Go-live audience grows from 0. Room state isn't persisted.
- **Verified vs unverified:** the blue badge appears everywhere a verified host
  appears; Rui Tanaka shows the "hasn't verified" note.
- **No feed / no ranking:** Home is finite, and companies are alphabetical.
- **Launch film:** `launch/prep-io-launch.mp4`, 1920×1080, 60fps, 32s,
  H.264. Frames spot-checked at every scene.

Not verified: physical devices, and the Pages deploy (branch not merged).

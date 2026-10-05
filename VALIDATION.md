# VALIDATION.md — Prep.io V6 (D21)

Checked 2026-10-05 with headless Chromium against the dev build at 1440×900
(2× captures) and 390×844 (3×), then against the deployed site. `npx tsc -b`
is clean, and there are no console errors on any route.

- **Screens render as intended:** Home (featured room, live now, starting
  soon, recordings, companies), live session, upcoming session (countdown +
  Remind me), recording (question list), Companies, Company
  (Sessions/Jobs/People), Schedule, Go live (setup, 3-2-1 countdown, console,
  summary), and the ⌘K search panel. Verified visually at both sizes.
- **Phones:** no horizontal scroll at 390px; the bottom tab bar replaces the top
  links; in a live room the questions sit directly under the stage.
- **Q&A loop:** posting a question adds it with 1 vote and Enter submits. The
  host takes the top question; it pins under "<host> is answering" while the
  caption shows who asked, then moves to Answered.
- **Motion:** clicking a session card morphs its picture into the room's stage
  (View Transitions, Chromium); the featured room swipes, steps with ← →, and
  auto-advances every 9s while not hovered; counts roll on a spring. Reduced
  motion turns all of it off.
- **Honest liveness:** counts, chat, questions, and votes come only from
  `lib/sim.ts`. Chat never repeats a line from the last dozen. The Go-live
  audience grows from 0. Room state isn't persisted.
- **Verified vs unverified:** the green badge appears everywhere a verified host
  appears; Rui Tanaka shows the "hasn't verified" note.
- **No feed / no ranking:** Home is finite, and companies are alphabetical.
- **Launch film:** `launch/prep-io-launch.mp4`, 1920×1080, 60fps, 32s, H.264.
  Frames spot-checked at every scene, including the question passing the
  other rows.

Not verified: physical devices, and the picture-to-stage morph in Safari and
Firefox (they fall back to a plain page transition).

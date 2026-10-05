# Prep.io

Live sessions with recruiters and employees. Watch, chat, ask questions in
Q&A, follow companies, and save the jobs they mention.

This is a front-end prototype. Everything is mocked: the audience is simulated,
and hosts are shown as illustrated people in their home offices.

**Docs:** [`docs/CONCEPT.md`](docs/CONCEPT.md) (decision log; the current version is D20) ·
[`VALIDATION.md`](VALIDATION.md)

## Run

```bash
npm install
npm run dev        # add ?debug for demo controls
npm run build
```

## Try it

1. Home shows what's live, what's coming up, and companies to follow.
2. Open *What we actually screen for in a new-grad resume*.
3. Go to Q&A, ask a question, and watch the host pick it up and answer it.
4. Open a recording and jump between the questions in it.
5. Go live: set up a session, answer viewer questions, and end it.

## Launch film

`/launch/` plays the 32-second film in the browser. To render the MP4 (needs
Playwright and ffmpeg, with the dev server running):

```bash
node launch/render.mjs http://localhost:5173 60
```

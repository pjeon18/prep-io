# Prep.io — Concept & Ideation Record

Why this product exists, what the research found, and why the big calls were made.
The PRD says *what to build*; this says *why*. Update when decisions change so
future sessions don't re-litigate.

---

## 1. Origin (Paul's pitch, 2026-07-20)

"A streaming platform like Twitch or YouTube, centered around College Office Hours"
— creators go live to teach, give career/industry insight, do interview prep, and
consult one-to-many or one-to-one. Sections by field (STEM, Finance, Art…), a feel
like a **college club fair**, streaming mechanics and layout familiar from Twitch.

## 2. Market research (2026-07-20)

- **Career coaching services:** ~$16.5B in 2025, ~8.5% CAGR
  ([Market Research Intellect](https://www.marketresearchintellect.com/product/career-coaching-service-market/)).
- **Online coaching platforms:** ~$3.5B, ~15% CAGR
  ([Global Growth Insights](https://www.globalgrowthinsights.com/market-reports/online-coaching-platforms-market-122199)).
- **Supply-side proof:** [ADPList](https://adplist.org/) sustains 40K+ verified
  mentors doing *free* 1:1 sessions — experts demonstrably want to mentor;
  [Intro.co](https://www.growthmentor.com/blog/intro-co-alternatives) sustains
  $100–$2,000/hr at the celebrity end — demand demonstrably pays.
- **Format proof:** Twitch Just Chatting sustains
  [300K+ average concurrent viewers](https://otechworld.com/twitch-in-2026-what-the-platforms-biggest-updates-mean-for-growing-your-channel/)
  — live unstructured talk retains at massive scale.
- **SOM frame:** ~19M US college students + early-career switchers.

## 3. Competitive landscape (detail behind the PRD table)

- **ADPList / MicroMentor / MentorNet** — scheduled free 1:1. No liveness, no
  browse/lurk mode, no leverage for the mentor. You must arrive already knowing
  what to ask and whom.
- **Intro.co / Superpeer / Topmate** — paid booked 1:1 (Superpeer ~15% take;
  Topmate = booking storefront). High friction, high price; exploration-hostile.
- **Twitch / YouTube Live** — the format exists but career content is buried under
  gaming taxonomy, and there's zero credential verification: anyone can claim to
  be a Goldman analyst.
- **LinkedIn** — performative by design; no drop-in live culture; candor dies there.
- **OfficeHours.com** — a different business entirely: B2B expert network (paid
  expert calls for investors/researchers), not consumer career learning.
- **Handshake / university career centers** — transactional job funnels; "events"
  are webinars with none of the ambient, wander-and-overhear quality.

**Gap statement:** mentorship platforms are *scheduled 1:1*; career content is
*recorded 1-to-millions*. Nobody owns **live, drop-in, many-to-one** — the actual
office-hours format.

## 4. The two structural bets

**Bet 1 — the one-to-many-to-one funnel.**

```
  lurk in the crowd (free, anonymous, 200 people)
        ↓ raise hand (public question, opt-in)
  the hot seat (answered in front of the room — everyone learns)
        ↓ host offers / viewer accepts (both consent)
  private breakout or booked follow-up (paid)
```

Each layer feeds the next; every competitor holds exactly one layer. Discovery is
free, engagement is social, monetization is 1:1 — and the money never touches
visibility (Principle 1).

**Bet 2 — verified context.** Credentials verified by role/employer/school. On
Twitch the host might be anyone; here the badge *is* the product. Verification is
also the B2B hook (career centers verify their own alumni).

## 5. Decision log

**D1 — This phase is a mocked front-end prototype, not real streaming infra.**
(2026-07-20) The portfolio value is the *product thinking made visible in the
interface* — the fair, the funnel, honest liveness — not WebRTC plumbing. Real
video, payments, and backend are explicitly out of scope.

**D2 — Launch shape is scheduled-events-first.** (2026-07-20) The Clubhouse
post-mortem: ambient 24/7 liveness dies without density. A calendar of scheduled
sessions ("Fireside with a Meta PM, Thu 7pm") co-equal with live-now gives density
before spontaneity. The campus wedge (one school + alumni hosts + career-center
cross-promo) concentrates both sides.

**D3 — Retention thesis = utility + compounding, not hype.** (2026-07-20)
Recruiting seasons are cyclical and urgent (utility retention), and VODs with
per-question chapter markers turn live sessions into a searchable library
(compounding) — the two things Clubhouse never had.

**D4 — The values are non-negotiable and store-enforced where possible.**
(2026-07-20) Enforced in the state layer, not decorated in the UI: honest
liveness comes from the simulation, consent gates the funnel, no feed, no DMs,
money never buys placement. PRD §5.

**D5 — Model usage.** (updated 2026-07-20, Paul) Prep.io work — strategy, design,
and the build — runs on **Fable**. Sonnet is reserved for mechanical data-labor
chores only (this project has little of that; it applies mostly elsewhere).

**D6 — Name: Prep.io.** (2026-07-20, chosen by Paul.) TODO before anything
public: domain + trademark availability check.

**D7 — Mocked-video treatment: ambient avatar + live waveform.** (2026-07-20,
Tier 1 design pass; Paul picked this option.) The live stage is a hue-keyed
gradient portrait that breathes while speaking, over a radial glow, with an
animated amber waveform — human without pretending to be real video, honest
about being a mock (PRD open question 1, resolved). The same waveform
grammar carries through the breakout room (host amber, you gray) and the VOD
player (muted gray = not live).

**D8 — Design language: "financial editorial", replacing campus-at-night.**
(2026-07-20, Paul's direction after reviewing the first build.) The navy +
amber dark UI read as generated and generic. New system: warm paper + ink
for all browse surfaces (the commercial register of Mercury/Ramp/LinkedIn —
right for a finance/STEM/corporate audience), with live rooms as the one
dark "theater" scope. Serif display (Newsreader) + Inter; three semantic
color roles only (ink actions, broadcast-crimson LIVE, racing-green
verified); large type and generous negative space; copy stripped of cute
AI-isms. The old "one confident amber" rule is superseded by "ink acts,
crimson is live, green is verified."

**D9 — Boosts raise visibility, never buy the stage.** (2026-07-20, Paul chose
the host-consent option over true super-chat.) Purchasable points can
highlight a chat message or boost a raised question. Boosted questions pin
higher in the HOST's view (and hosts naturally tend to take them), and the
points pay the host — but promotion remains the host's explicit pick and
the viewer's raised hand remains the only path on stage. Principle 1 is
amended, not repealed: money may buy the host's attention, never a place on
stage or in discovery.

**D10 — Explore is goal-driven, not a feed.** (2026-07-20) Paul asked for a
recommendations page; Principle 3 bans algorithmic feeds. Resolution: the
user explicitly states career goals (target fields + target companies);
Explore renders finite, labeled shelves matched against those goals
("because you're targeting…"). Nothing is inferred from behavior, nothing
scrolls forever.

**D11 — Premium (viewer subscription) + gated recordings.** (2026-07-20,
Paul confirmed, superseding part of D3.) New session recordings default to
the premium library; channels can publish selected recordings free (the
seeded library stays free). Premium also includes AI transcription
(downloadable notes), playlists (self-assembled mini-courses), and
exclusive/member content access. Watching LIVE stays free for everyone —
lurking is untouched (Principle 4).

**D12 — Ticketed events + the $1 commitment.** (2026-07-20) Hosts can cap
events ("meaningful engagement within capability"), first come first
served, enforced in the store. Free networking events use a $1 commitment —
explicitly not revenue: a bot filter and attendance stake, refunded on
attendance. Priced events ($5–$12 range) are the host monetizing scarce
formats.

**D13 — Channel subscriptions with paid membership tiers.** (2026-07-20)
Free subscribe = go-live alerts (the old follow). Paid tiers (Supporter /
Inner circle) buy resources, members-only recordings, and 1:1 access —
host's time and tools, never placement.

**D14 — Streaming-product surface layer.** (2026-07-20, Paul: "editorial +
streaming layer.") Companies as first-class discovery objects (search
"BCG"), a search bar, watch history, video-mode streams (mocked camera),
shorts/clips, tabbed channel pages, LinkedIn sync (stubbed), bottom tab nav
(Home / Explore / Library / Host). The paper-and-ink + theater design
language from D8 carries the new vocabulary: 16:9 mock thumbnails, shelves,
denser cards.

**D15 — Desktop shell + plain white/black.** (2026-07-20, Paul.) The palette
drops the warm paper for plain white background and black text (neutral
grays for hierarchy; crimson LIVE and racing-green verified unchanged;
theater rooms go neutral near-black). Desktop (lg+) gets the
YouTube/Twitch chrome: fixed left sidebar (nav, subscriptions with live
dots, the floor's booths), a centered top search bar, thumbnail grids
(Home 3–4 columns), the watch layout on recordings (player left, chapters
right), and the Twitch split in live rooms (stage left, chat rail right).
Mobile keeps the bottom-tab shell. The serif display and semantic color
discipline carry over — the shell is conventional, the voice stays ours.

**D16 — Liquid Glass + a spring motion system + a real dark theme.**
(2026-07-30, Paul: "use liquid glass and the new animated components and
principles... add a dark theme.") The D15 palette is KEPT (white page, black
ink, crimson live, green verified); what changes is material and physics.
Glass is chrome-only and neutral, because a video platform's thumbnails are
the content and tinted chrome fights them. Dark mode is neutral graphite for
the same reason. Every clickable now routes its tap physics through one
`Pressable` component, and all motion comes from named spring presets — the
only way 40+ screens read as one product. The reference library Paul named
(ui.watermelon.sh) is a component library, not a palette; per the UI toolbox
rule we implemented its mechanisms (dock magnification, layoutId segmented
pill, spotlight cards, odometer numbers, copy-confirm-style feedback) rather
than copying its source.

**D17 — A second audience: Campus (teachers and TAs).** (2026-07-30, Paul.)
Same platform, second world, switched by a top-bar mode toggle. Students get
"my courses"; instructors and TAs get a Teach hub that goes live to the
course channel. The wedge against the status quo is consolidation, not video:
today a course is Canvas + Zoom + a calendar + Panopto and none of them know
about each other, so a course here is one channel — what's live now, what's
this week, every past session chaptered by the question that was asked, and
clips cut from them, joinable from the web with no meeting id. The existing
consent-gated hand-raise needed no changes, because "raise your hand and get
called on" is what office hours already are. Implementation keeps campus as a
separate data island so it cannot leak into careers discovery, and campus
mode gets its own search index for the same reason.

### D18 — Two Watermelon components are used as source, not as inspiration (2026-07-31)

Everything in `src/components/ui/` up to now was watermelon-*style*: our own
implementation of the same micro-interaction ideas. Two of their components
are good enough to take directly, and they are distributed for that purpose
through a shadcn registry (`registry.watermelon.sh/r/<slug>.json`), so they
now live in `src/components/ui/watermelon/` with the install command in the
file header:

- **CopyConfirm** — the icon does a blur/scale swap and the label morphs
  per character from "Copy join link" to "Copied". Used where the join link
  IS the product argument: the course channel and the Teach hub. One address
  per course, no meeting id, so the copy affordance carries weight.
- **ExpandDetails** — width and height animate on separate springs with
  mirrored delays (widen → grow tall opening; shorten → narrow closing), and
  the content arrives blurred 0.3s behind. Reads as one object unfolding
  rather than a box being resized. Used for "Course details" so the header
  stays a headline instead of a metadata block.

Adapted, not pasted: lucide icons → our stroke set, zinc/green literals →
our tokens, their demo shells removed, and `ExpandDetails` starts closed and
takes width props (an auto-expanded disclosure on a real page is just a
card). `react-use-measure` came in as a real dependency — you cannot spring
to `height: auto`, so the inner content is measured and the outer animates
to that number.

Also fixed here, because integrating these exposed it: **mode now follows the
route** (`store/useSyncMode.ts`). Arriving at a campus URL from a careers
session — a bookmark, a shared link, the deployed root — used to render
course content inside careers navigation. Campus screens and the
careers-only screens declare their mode; Library, Search, and Settings
deliberately don't, because they belong to both.

### D19 — V4 "On Air": rebuilt around the core idea only (2026-09-30)

Paul: completely upgrade the UI/UX, keep only the core idea (a live video
platform for recruiters, employees, and people applying to jobs), make it slick
and not AI-looking, no extras. The source was rebuilt from scratch on branch
`v4-on-air`.

**Scope, cut to the core.** Two kinds of room are the whole product:
*Hiring* (a recruiter on process and what they screen for, with open roles
pinned) and *Inside* (someone doing the job). Kept: live rooms, chat,
question queue with upvotes, the consent-gated hot seat, recordings chaptered
by question, a schedule, company pages, a host Studio (go live → console →
recap), ⌘K search, `?debug`. **Removed:** Campus mode (D17), premium/membership
tiers (D11, D13), boosts/points (D9), ticketed events + $1 commitment (D12),
shorts, playlists, goal-driven Explore (D10), LinkedIn stub, light theme,
Liquid Glass (D16), the Watermelon source components (D18), and the LLM crowd
client (the dev proxy in `vite.config.ts` is still there if it comes back).
Without any monetization surface, Principle 1 is trivially held.

**Design language.** A live network, so it uses broadcast grammar: black studio
(`#090909`), white type, lower-thirds, timecode, a LIVE bug. **One hue only:**
tally red `#FF3B24`, the light on a camera that means you're on air, used for
live and the hot seat and nothing else. Verified is a mono check mark, not a
color. Company tones appear only as stage *lighting* (content, not chrome).
Type: **Archivo** variable, using its width axis. Expanded (`.wide`, 125%) for
display, condensed (`.cond`) for lower-thirds, normal for body at 15px, plus
**JetBrains Mono** for timecodes and labels. Newsreader and Inter are gone.

**The stage (replaces D7's avatar + waveform).** No fake faces. Live captions
are the picture: the host's words arrive word by word at speaking pace, with
speaker tiles showing who has the floor, a lower-third naming them, and film
grain plus company-tone lighting. It is honest about being a mock, and it reads
with the sound off, which matters for people watching career content at work.
The stage is container-query sized (`cqw`), so the same component serves the
home hero, the room, the Studio preview, and the launch film.

**Home is a channel guide**, not a feed. The hero stage flips through live
rooms with ← →, a guide list sits beside it, and a real-time "starting soon"
strip shows the next five hours with a NOW line. It is finite, with nothing
inferred.

**Launch film.** `launch/` is a second Vite page: a 24.5s, 1920×1080
composition in which every frame is a pure function of `t`, cut to a 120 BPM
grid. `launch/render.mjs` seeks it frame by frame in headless Chromium and pipes
the frames into ffmpeg, producing `launch/prep-io-launch.mp4` (60fps). It ships
silent; the cuts land on beats so a track drops in.

### D20 — V5: light, LinkedIn-style, friendly; D19's "On Air" is scrapped (2026-09-30)

Paul rejected V4 outright: the dark broadcast look, the hot seat, the slogan copy,
and the fast launch film. New direction: model the product on LinkedIn (with
Instagram/Duolingo friendliness), so it feels clean, corporate, and happy. It
should never be dark or scary, and there should be no AI tells in the UI or the
copy.

- **Look:** LinkedIn's warm grey page (`#f4f2ee`), white cards, 12px radii, and
  one friendly brand blue (`#1f5bff`) for actions and selection. Sunny yellow
  (`#ffb61e`) appears only in the logo dot. Red is used only for the LIVE badge,
  and green only for "Answered." Type is Figtree, a friendly, clean sans. The
  verified mark is the familiar blue badge.
- **Brand:** a blue rounded-square mark with a white "p" and a yellow dot, next
  to the "Prep.io" wordmark.
- **People:** flat, friendly illustrated busts (`components/people.tsx`) for
  every host and viewer. Each host has a bright home-office "room" (shelf,
  window, or wall art), which is the video stand-in, with captions like
  YouTube's. Deterministic looks come from `lookFor(name)`.
- **Mechanics:** the hot seat is gone. Viewers chat, post questions in Q&A, and
  upvote; the host reads the top question aloud (the caption shows "Question
  from Maya") and answers it; the question then shows as Answered. Other
  features are ordinary and recognizable: Follow, Remind me, Apply, Save job.
- **Structure:** a LinkedIn top nav (Home, Events, Companies, Go live, Me). Home
  has three columns: profile card, live now + recordings, and coming up +
  companies. The session page handles live, upcoming, and recorded states;
  recordings list "Questions in this video." There are company pages with
  Sessions/Jobs/People tabs, an Events list, and Go live (setup, host Q&A
  console, summary).
- **Copy:** plain, sentence-case product language. No slogans, no monospace
  small-caps labels, no "·"-joined metadata.
- **Film:** 32s, light, one focus per shot: the logo, the home page with a
  cursor clicking Watch, a seamless zoom into the live session, a question
  typed, upvoted, and answered, a quicker grid of companies with one Follow,
  and the logo again. No overlaid slogans and no pop-ups.

### D21 — V6: forest green, big type, motion (2026-10-05)

Paul liked the dark green the case study used and asked for the app itself to
feel less templated and more human: big type, positioning, motion,
transitions, responsiveness, inertia, minimal balance. V6 keeps V5's product
(D20) and rebuilds the interface around it.

- **Look:** warm white page (`#fbfaf6`) and forest green (`#0f5c3b`) for
  actions, selection and the verified badge, with mint (`#9fd8b5`) in the logo
  dot. Red stays for LIVE only. No cards around content; hierarchy comes from
  size and space. Body text is 17–18px and headings run up to 84px.
- **Home** leads with one live room at full width: a swipeable stage with the
  title rising word by word, auto-advancing every 9s with a ring on the next
  button, paused while you look at it. Then live rooms, a starting-soon list
  with big times, recordings, and companies.
- **Motion:** the clicked picture becomes the next page's stage (View
  Transitions), counts roll instead of jumping, Follow and Remind flip their
  label, tabs and segmented controls slide on springs, and live thumbnails come
  alive on hover.
- **Room:** questions first. The question being answered pins to the top with
  a speaking indicator, your own question joins the list, Enter asks. On
  phones the conversation sits right under the stage.
- **Go live:** the title is typed at headline size and appears on the preview
  as you type; going live runs a 3-2-1 countdown; the host picks a question to
  answer and it shows on stage.
- **Search** is a keyboard panel (⌘K or /).
- Removed: `Player`, `SessionCard`, `kit` (replaced by `Stage`, `Cards`, `ui`).
- **Film:** same 32s structure as D20, restyled in V6: forest logo, the V6
  home, a click on Join the room that dives into Rebecca Stein's room, a
  question typed, upvoted to the top, pinned while answered, and the company
  grid with one Follow.

## 6. Open questions

Tracked in PRD §14; raise new ones here first, promote when decided.

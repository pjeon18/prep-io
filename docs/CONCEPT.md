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

## 6. Open questions

Tracked in PRD §14; raise new ones here first, promote when decided.

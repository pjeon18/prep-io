# Prep.io — Product Requirements Document v1

**One-liner:** A live streaming platform shaped like a college club fair — verified
professionals hold drop-in "office hours" about their careers, and viewers move
from lurking in the crowd to the hot seat to 1:1 help.

**Thesis:** Twitch's format × ADPList's supply × a club fair's information
architecture. Career knowledge is stuck in recorded content (passive, unverifiable)
and booked 1:1 mentorship (high-quality, doesn't scale). The professor's-office-
hours format — one expert, whoever shows up, everyone learns from everyone's
questions — has no online home. Prep.io is that home.

**Status:** Approved direction (2026-07-20). This PRD specs the product; the
deliverable in this phase is a **high-fidelity front-end prototype** (fully
mocked) — see §12. `CONCEPT.md` holds the market research and decision log.

---

## 1. Problem

- **Recorded career content** (YouTube "day in the life," TikTok advice) is
  passive, engagement-optimized, and unverifiable — anyone can claim to be a
  Goldman analyst.
- **1:1 mentorship** (ADPList, coffee chats) is high-quality but gated by booking
  friction, calendar friction, and the social cost of asking a stranger for 30
  minutes. It also has zero leverage: one hour helps one person.
- **The explorer's problem is worst:** a sophomore who doesn't know what IB
  analysts do all day can't even form the question a 1:1 platform requires. They
  need to *wander and overhear* — the thing a club fair provides and no career
  platform does.

## 2. Insight & market

- Twitch proved people watch a live person talk for hours (Just Chatting sustains
  300K+ average concurrent viewers). Nobody has pointed that mechanic at career capital.
- Career coaching services ≈ $16.5B (2025, ~8.5% CAGR); online coaching platforms
  ≈ $3.5B (~15% CAGR). Supply-side proof: ADPList sustains 40K+ verified mentors
  working *for free*; Intro.co sustains $100–$2,000/hr at the celebrity end.
- SOM frame: ~19M US college students + early-career switchers.
- Sources and the full competitive table: `CONCEPT.md §2–3`.

## 3. Personas

**Demand (viewers)**
- **The explorer** — sophomore, doesn't know what the jobs *are*. Browses the fair
  floor, lurks, leaves without commitment. Lurking is a first-class behavior.
- **The prepper** — junior with a superday next week. Needs targeted interactive
  help *now*; will raise a hand, will pay for a breakout.
- **The switcher** — 27-year-old consultant eyeing product. Wants candid
  "what it's really like" from someone two years ahead, not a $300/hr coach.

**Supply (hosts)**
- **The young professional** — 2–6 years into finance/tech/design; wants to mentor
  with leverage (1 hour → 200 people) and a side income, without becoming a
  Content Creator™.
- **The domain personality** — recruiter, admissions consultant, portfolio
  reviewer; already sells expertise, wants a funnel.
- **The institution** — career centers and alumni offices buying branded virtual
  fairs (the B2B wedge).

## 4. Competitive gap

| Player | Format | Missing |
|---|---|---|
| ADPList, MicroMentor | Scheduled free 1:1 | Liveness, browsing, leverage |
| Intro.co, Superpeer, Topmate | Paid booked 1:1 | Affordable exploration; you must already know what you want |
| Twitch / YouTube Live | Live many-to-one | Career taxonomy, credential verification, discoverability of this content |
| LinkedIn | Network + content | Drop-in live culture; candor |
| OfficeHours.com | B2B expert network | Consumer career learning entirely |
| Handshake / career centers | Jobs + events | Ambient culture; their "events" are webinars |

**Two structural differentiators nobody has:**
1. **The one-to-many-to-one funnel.** Stream to 200 (free discovery) → raised-hand
   hot seat in front of the room (engagement) → paid private breakout / booked
   follow-up (monetization). Each layer feeds the next; competitors each hold only
   one layer.
2. **Verified context.** Hosts verified by role/employer/school. Trust is the product.

## 5. Non-negotiable product principles

Violating one is a failure even if the feature works. Flag, don't build.

1. **Monetize the host's time and tools — never viewer visibility, never
   placement.** Nothing in discovery may read a payment flag.
2. **Verified means verified.** Every credential badge is backed by a verification
   flow; unverified hosts are clearly and persistently marked.
3. **No feed.** Discovery = the fair floor (browse by section) + the calendar.
   No algorithmic engagement loop, no infinite scroll.
4. **Lurking is first-class.** Never require signup/booking to watch a public room.
5. **Honest liveness.** Viewer counts and presence are real (in the prototype:
   from the simulation, never hardcoded inflation). A room that isn't live is an
   archive, clearly labeled — no fake "23 watching."
6. **The funnel ascends only by consent.** Viewer → hand raised → hot seat →
   breakout: each step is an explicit opt-in by *both* sides. No cold pulls on stage.
7. **No DMs / inbox.** Follow-ups happen as scheduled sessions or breakouts.
   Presence-first; also the anti-harassment posture.

## 6. Core experience

### 6.1 The Fair (home)
Sections as booths — STEM · Finance · Design · Healthcare · Law · Grad School ·
Consulting · Media — rendered as a browsable floor, not a list. Live rooms surface
with real concurrent counts and topic titles ("Ex-Meta PM: breaking in without a
CS degree"). A **calendar rail** of scheduled sessions is co-equal with live-now:
the platform launches as *scheduled events with drop-in energy* (density before
spontaneity — see cold-start mitigation, §10).

### 6.2 The Live Room (viewer)
- Host video + title + verified badge + section tag.
- Chat with slow-mode defaults; question-upvoting.
- **Raise hand** → enters a visible queue with your one-line question.
- **Hot seat:** host promotes the next hand; the viewer joins on stage (audio or
  text-to-stage), asks, gets answered in front of the room, steps down. The whole
  room learns from each question — that's the office-hours magic, preserved.
- Session VODs get **chapter markers per hot-seat question** — live sessions
  compound into a searchable library instead of evaporating (the Clubhouse lesson).

### 6.3 The funnel's paid tier (stubbed in prototype)
From the hot seat (or the queue), the host may offer a **private breakout** — a
timed 1:1 room at the host's rate — or a **booked follow-up**. Payments stubbed.

### 6.4 Host side
- **Verification flow:** LinkedIn OAuth / .edu email / offer-letter review →
  badge states (verified role, verified school, unverified).
- **Go-live wizard:** section, title, scheduled vs now, hand-raise settings,
  breakout rate (optional).
- **Room controls:** promote/dismiss hands, mute, end, post-session recap
  (questions answered, follows gained, VOD chapters).

### 6.5 Follow & notify
Follow a host or a section → notified on schedule/go-live. Follows produce **no
feed** — just calendar entries and notifications. (Principle 3.)

## 7. Monetization (principle-level, post-prototype)

Breakout fees + tips + host subscriptions (rev-share), and B2B: career centers buy
branded fairs ("Harvard Alumni Office Hours Week"). Never: promoted placement,
paid discovery boosts, viewer-side paywalls on public rooms. (Principle 1.)

## 8. Success metrics

**North star: questions answered live per week** — it captures both sides' health
in one number.
Guardrails: host 4-week retention; median concurrent viewers per session; hot-seat
conversion (hands raised ÷ answered); % sessions with ≥1 question answered;
breakout attach rate (later).

## 9. Screen inventory (prototype ~15)

1. Splash / value prop
2. The Fair (floor + calendar rail)
3. Section view
4. Live Room — viewer
5. Raise-hand sheet + queue view
6. Hot-seat moment (the signature threshold beat)
7. Breakout offer + stubbed checkout
8. Host: verification flow
9. Host: go-live wizard
10. Host: live room controls
11. Host: post-session recap
12. Host profile (credentials, upcoming, VODs)
13. VOD player with question chapters
14. Follows & notifications
15. Settings + `?debug` panel

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Cold start / dead liveness** | Launch as scheduled-events-first (calendar is co-equal with live-now); campus wedge: one school + a handful of alumni hosts + career-center cross-promotion |
| **Clubhouse decay** (no reason to return) | Utility retention: recruiting cycles are cyclical and urgent; VOD/chapter library compounds |
| **Host incentives** | Money (breakouts/tips/subs), leverage (1 hr → 200 people), status (verified-host credential, the way "ADPList Top Mentor" became flexable) |
| **Advice quality / liability** | Verification, disclaimers, no regulated-advice categories at launch (no financial/legal/medical), reporting |
| **Harassment on stage** | Consent-only promotion (Principle 6), host controls, no DMs (Principle 7) |

## 11. Scope — what this phase is

This phase ships a **high-fidelity interactive front-end prototype** (portfolio
artifact): React front end, all systems mocked, deployed to GitHub Pages. It must
*demonstrate the values in the interface* — the fair, the funnel, honest
liveness — not implement streaming infrastructure.

**Explicitly out of prototype scope:** real video (WebRTC/RTMP), payments, mobile
apps, accounts/backend, discovery algorithms, moderation tooling beyond UI.

## 12. Prototype tiers

- **Tier 1 — the loop:** Fair floor → live room with **simulated crowd** (scripted
  chat personas, optionally LLM-driven via a dev proxy) → raise hand → hot seat →
  back to crowd. Mocked video treatment (ambient looping avatar/waveform). This is
  the demo: a viewer session that *feels* alive end-to-end.
- **Tier 2 — the host side:** verification flow, go-live wizard, room controls,
  post-session recap; calendar + follow/notify.
- **Tier 3 — the compounding layer:** VOD player with question chapters, breakout
  offer + stubbed checkout, host profile, polish/motion pass.
- `?debug` panel throughout: force viewer surge, pick section/persona set, promote
  yourself to hot seat, toggle LLM crowd, reset state.

## 13. Acceptance criteria (prototype)

- [ ] A first-time visitor can go splash → fair → join a live room → raise hand →
      be hot-seated → return to crowd, with no dead ends, on mobile viewport.
- [ ] Viewer counts, chat, and queue all derive from the crowd simulation — no
      hardcoded "liveness" anywhere (Principle 5); debug surge visibly moves them.
- [ ] Verified vs unverified hosts are visually distinct in every surface a host
      appears (fair, room, profile, VOD).
- [ ] Nothing anywhere ranks people or reads a payment flag for placement.
- [ ] Every session ends with a recap; every past session appears only as a
      clearly-labeled archive, never as fake-live.
- [ ] LLM crowd degrades silently to scripted personas without an API key.
- [ ] `npx tsc -b` + `npm run build` clean; deployed and verified on Pages.

## 14. Open questions

1. Mocked-video treatment: looping ambient avatar vs stylized waveform stage —
   decide in the Tier 1 design pass.
2. Does the prototype demo one section richly (Finance) or all eight thinly?
   (Leaning: one rich + seven present-but-sparse, honest to the cold-start story.)
3. Campus pilot partner for the case-study narrative (Harvard career center?).

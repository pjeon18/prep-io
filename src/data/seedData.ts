import type { CrowdPersona, Host, Section, SessionInfo } from "../lib/types";

/* ------------------------------------------------------------------ */
/* Sections — the fair floor. Finance is the rich booth; the rest are  */
/* honestly sparse (the cold-start story, not a content gap).          */
/* ------------------------------------------------------------------ */

export const SECTIONS: Section[] = [
  { id: "finance", name: "Finance", blurb: "IB, PE, markets, superday prep" },
  { id: "stem", name: "STEM", blurb: "SWE, data, research, big tech" },
  { id: "consulting", name: "Consulting", blurb: "Case prep, MBB, exits" },
  { id: "design", name: "Design", blurb: "Product, UX, portfolios" },
  { id: "healthcare", name: "Healthcare", blurb: "Pre-med, MD/PhD, nursing" },
  { id: "law", name: "Law", blurb: "LSAT, big law, clerkships" },
  { id: "gradschool", name: "Grad School", blurb: "PhD apps, funding, advisors" },
  { id: "media", name: "Media", blurb: "Journalism, film, publishing" },
];

/* ------------------------------------------------------------------ */
/* Hosts — badge states must be visually distinct everywhere.          */
/* ------------------------------------------------------------------ */

export const HOSTS: Host[] = [
  {
    id: "maya",
    name: "Maya Okafor",
    headline: "IB Analyst · Goldman Sachs",
    org: "Goldman Sachs",
    school: "Harvard '24",
    badge: "verified-role",
    sectionId: "finance",
    bio: "Two years in TMT coverage. I run open office hours on breaking in from a non-target, superday prep, and what the job is actually like at 2am.",
    rate: 40,
    hue: 24,
    initials: "MO",
    followers: 1284,
  },
  {
    id: "daniel",
    name: "Daniel Reyes",
    headline: "Growth Equity Associate · General Atlantic",
    org: "General Atlantic",
    school: "Wharton '22",
    badge: "verified-role",
    sectionId: "finance",
    bio: "IB → growth equity. Ask me about the analyst-to-buyside jump, modeling tests, and how recruiting timelines actually work.",
    rate: 55,
    hue: 210,
    initials: "DR",
    followers: 967,
  },
  {
    id: "grace",
    name: "Grace Lin",
    headline: "Equity Research (self-reported)",
    org: "—",
    school: "—",
    badge: "unverified",
    sectionId: "finance",
    bio: "Covering industrials. Verification pending — treat my takes accordingly.",
    hue: 300,
    initials: "GL",
    followers: 88,
  },
  {
    id: "priya",
    name: "Priya Natarajan",
    headline: "SWE II · Stripe",
    org: "Stripe",
    school: "MIT '23",
    badge: "verified-role",
    sectionId: "stem",
    bio: "Payments infra. Office hours on new-grad interviews, internship conversion, and picking a first team.",
    rate: 35,
    hue: 160,
    initials: "PN",
    followers: 2101,
  },
  {
    id: "tom",
    name: "Tom Whitfield",
    headline: "Consultant · Bain (Boston)",
    org: "Bain & Company",
    school: "Dartmouth '23",
    badge: "verified-role",
    sectionId: "consulting",
    bio: "Case interview drills, live. I take a raised hand, we run the case together in front of the room.",
    rate: 45,
    hue: 350,
    initials: "TW",
    followers: 743,
  },
  {
    id: "amara",
    name: "Amara Diallo",
    headline: "Product Designer · Figma",
    org: "Figma",
    school: "RISD '21",
    badge: "verified-role",
    sectionId: "design",
    bio: "Portfolio reviews in public — bring a link, get it torn apart kindly.",
    rate: 30,
    hue: 265,
    initials: "AD",
    followers: 1567,
  },
  {
    id: "jhoon",
    name: "Jae Hoon Kim",
    headline: "MD-PhD Candidate · Johns Hopkins",
    org: "Johns Hopkins",
    school: "Verified school only",
    badge: "verified-school",
    sectionId: "healthcare",
    bio: "The MD/PhD path, honestly: timelines, funding, burnout, and whether you actually need it.",
    hue: 190,
    initials: "JK",
    followers: 412,
  },
  {
    id: "sofia",
    name: "Sofia Marchetti",
    headline: "Associate · Cravath (self-reported)",
    org: "—",
    school: "—",
    badge: "unverified",
    sectionId: "law",
    bio: "Big law survival guide. Working on getting my badge sorted.",
    hue: 40,
    initials: "SM",
    followers: 156,
  },
  {
    id: "nathan",
    name: "Nathan Cole",
    headline: "PhD Student · Berkeley EECS",
    org: "UC Berkeley",
    school: "Verified school",
    badge: "verified-school",
    sectionId: "gradschool",
    bio: "Grad-school applications from the trenches: statements, advisor-picking, funding math.",
    hue: 120,
    initials: "NC",
    followers: 534,
  },
  {
    id: "leila",
    name: "Leila Haddad",
    headline: "Producer · NPR",
    org: "NPR",
    school: "Northwestern '20",
    badge: "verified-role",
    sectionId: "media",
    bio: "Audio journalism careers — pitching, fellowships, and the freelance-to-staff path.",
    rate: 25,
    hue: 15,
    initials: "LH",
    followers: 689,
  },
];

/* ------------------------------------------------------------------ */
/* Sessions. seedViewers is the crowd simulation's STARTING PARAMETER; */
/* it evolves live and is never rendered raw (Principle 5).            */
/* ------------------------------------------------------------------ */

export const SESSIONS: SessionInfo[] = [
  // ---- Finance: the rich booth ----
  {
    id: "maya-live",
    hostId: "maya",
    sectionId: "finance",
    title: "Superday week: ask me anything about IB interviews",
    kind: "live",
    seedViewers: 134,
  },
  {
    id: "daniel-live",
    hostId: "daniel",
    sectionId: "finance",
    title: "IB → buyside: how the jump actually works",
    kind: "live",
    seedViewers: 61,
  },
  {
    id: "grace-live",
    hostId: "grace",
    sectionId: "finance",
    title: "Equity research week in review",
    kind: "live",
    seedViewers: 9,
  },
  {
    id: "maya-sched-1",
    hostId: "maya",
    sectionId: "finance",
    title: "Technicals bootcamp: DCF questions they actually ask",
    kind: "scheduled",
    when: "Thu 7:00 PM",
  },
  {
    id: "daniel-sched-1",
    hostId: "daniel",
    sectionId: "finance",
    title: "Fireside: a first year in growth equity",
    kind: "scheduled",
    when: "Fri 6:30 PM",
  },
  {
    id: "maya-sched-2",
    hostId: "maya",
    sectionId: "finance",
    title: "Non-target to Wall Street: the networking playbook",
    kind: "scheduled",
    when: "Sat 2:00 PM",
  },
  {
    id: "maya-vod-1",
    hostId: "maya",
    sectionId: "finance",
    title: "Behavioral round: the 6 stories you need",
    kind: "vod",
    vod: {
      recordedOn: "Jul 14",
      views: 3120,
      durationLabel: "58 min",
      chapters: [
        { t: "02:11", question: "How do I talk about a failed internship?", askedBy: "Jordan" },
        { t: "09:47", question: "Walk me through 'tell me about yourself'?", askedBy: "Aisha" },
        { t: "18:02", question: "Do GPA cutoffs actually exist?", askedBy: "Sam" },
        { t: "27:30", question: "How honest should I be about other offers?", askedBy: "Diego" },
        { t: "39:15", question: "What impressed you most as an interviewer?", askedBy: "Mei" },
        { t: "50:08", question: "How do I follow up after a superday?", askedBy: "Tyler" },
      ],
    },
  },
  {
    id: "daniel-vod-1",
    hostId: "daniel",
    sectionId: "finance",
    title: "Modeling test walkthrough (LBO from scratch)",
    kind: "vod",
    vod: {
      recordedOn: "Jul 9",
      views: 1854,
      durationLabel: "72 min",
      chapters: [
        { t: "04:40", question: "Which assumptions matter most in an LBO?", askedBy: "Priyanka" },
        { t: "16:22", question: "How fast do I need to be in Excel?", askedBy: "Chris" },
        { t: "31:05", question: "Debt schedules — how deep do they go?", askedBy: "Hannah" },
        { t: "49:50", question: "What kills a modeling test attempt?", askedBy: "Marcus" },
      ],
    },
  },

  // ---- The other seven booths: honestly sparse ----
  {
    id: "priya-live",
    hostId: "priya",
    sectionId: "stem",
    title: "New-grad SWE interviews: what changed this year",
    kind: "live",
    seedViewers: 88,
  },
  {
    id: "priya-sched-1",
    hostId: "priya",
    sectionId: "stem",
    title: "Internship → return offer: the conversion game",
    kind: "scheduled",
    when: "Wed 8:00 PM",
  },
  {
    id: "tom-sched-1",
    hostId: "tom",
    sectionId: "consulting",
    title: "Live case drill: market sizing with a volunteer",
    kind: "scheduled",
    when: "Thu 8:00 PM",
  },
  {
    id: "amara-live",
    hostId: "amara",
    sectionId: "design",
    title: "Public portfolio reviews — drop your link",
    kind: "live",
    seedViewers: 42,
  },
  {
    id: "amara-vod-1",
    hostId: "amara",
    sectionId: "design",
    title: "What a Figma portfolio screen looks for",
    kind: "vod",
    vod: {
      recordedOn: "Jul 11",
      views: 980,
      durationLabel: "44 min",
      chapters: [
        { t: "03:18", question: "How many case studies is too many?", askedBy: "Noor" },
        { t: "15:44", question: "Do side projects count without users?", askedBy: "Ben" },
        { t: "33:02", question: "Process pages or polished shots?", askedBy: "Lena" },
      ],
    },
  },
  {
    id: "jhoon-sched-1",
    hostId: "jhoon",
    sectionId: "healthcare",
    title: "MD/PhD office hours: is the dual degree worth it?",
    kind: "scheduled",
    when: "Sun 4:00 PM",
  },
  {
    id: "sofia-sched-1",
    hostId: "sofia",
    sectionId: "law",
    title: "First year in big law — the honest version",
    kind: "scheduled",
    when: "Mon 7:30 PM",
  },
  {
    id: "nathan-sched-1",
    hostId: "nathan",
    sectionId: "gradschool",
    title: "Statement of purpose workshop (bring drafts)",
    kind: "scheduled",
    when: "Tue 6:00 PM",
  },
  {
    id: "leila-sched-1",
    hostId: "leila",
    sectionId: "media",
    title: "Breaking into audio journalism without connections",
    kind: "scheduled",
    when: "Wed 6:30 PM",
  },
];

/* ------------------------------------------------------------------ */
/* Crowd personas — the simulated room. Names read like a campus.      */
/* ------------------------------------------------------------------ */

export const PERSONAS: CrowdPersona[] = [
  { id: "p1", name: "jordan_k", hue: 200, style: "chatty" },
  { id: "p2", name: "aisha.m", hue: 330, style: "asker" },
  { id: "p3", name: "sam_chen", hue: 90, style: "chatty" },
  { id: "p4", name: "diegov", hue: 40, style: "lurker" },
  { id: "p5", name: "mei_zhao", hue: 260, style: "asker" },
  { id: "p6", name: "tyler.b", hue: 150, style: "chatty" },
  { id: "p7", name: "hannah_l", hue: 10, style: "lurker" },
  { id: "p8", name: "marcus_j", hue: 220, style: "asker" },
  { id: "p9", name: "priyanka", hue: 300, style: "chatty" },
  { id: "p10", name: "chris_oh", hue: 120, style: "lurker" },
  { id: "p11", name: "noor.s", hue: 180, style: "chatty" },
  { id: "p12", name: "lena_w", hue: 60, style: "asker" },
];

/** Generic room chatter — believable, low-stakes, no emoji in UI chrome
 *  (these are user-generated chat lines, which may read casual). */
export const CHAT_LINES: string[] = [
  "this is exactly what I needed this week",
  "wait can you repeat the last part",
  "the queue is moving fast today",
  "lurking from my dorm, hi everyone",
  "took notes on that, thank you",
  "real question honestly",
  "she answered my question last week, changed my prep completely",
  "is there a VOD if I have to leave early",
  "^^ same question",
  "this beats every youtube video on this topic",
  "first time here, this format is great",
  "the hot seat takes courage lol",
  "good answer wow",
  "can everyone hear ok? audio's clean for me",
  "brb class in 10 but staying till then",
  "that chapter marker thing saved me last time",
  "raising my hand after this one",
  "solid advice, screenshotting my notes",
];

/** Finance-flavored chatter used when the section is finance. */
export const CHAT_LINES_FINANCE: string[] = [
  "superday on friday, absolutely terrified",
  "is TMT really that different from healthcare coverage",
  "the DCF question got me last time",
  "networking calls feel so awkward, glad she covered this",
  "non-target gang where you at",
  "do returns matter more than the pitch?",
  "she's so right about the 2am part",
  "accelerated timelines are brutal this year",
];

/** Questions personas raise hands with, per section flavor. */
export const PERSONA_QUESTIONS: Record<string, string[]> = {
  finance: [
    "How do I explain a low GPA without making excuses?",
    "What's the honest difference between GS and a boutique for exits?",
    "How many networking calls before it's actually enough?",
    "Walk me through how you'd answer 'why this bank'?",
    "Is it too late to recruit if I'm a junior in October?",
    "What did the people who got return offers do differently?",
  ],
  generic: [
    "What would you do differently in your first year?",
    "How did you decide this path was right for you?",
    "What's the most overrated advice in this field?",
    "How do I stand out with no connections?",
    "What does a bad week honestly look like?",
    "What skill should I build this summer?",
  ],
};

/** Host answer scripts — streamed into chat while answering a hot seat. */
export const HOST_ANSWER_LINES: string[][] = [
  [
    "Great question — let me be really honest about this.",
    "The short version: nobody expects perfection, they expect ownership.",
    "When I was interviewing, the people who stood out told specific stories, not polished ones.",
    "So take the thing you're worried about and make it the center of your answer, not the thing you hide.",
    "Does that help? Feel free to hop back in the queue if you want to go deeper.",
  ],
  [
    "Okay, I get asked this a lot and the real answer is less glamorous.",
    "It comes down to reps. The first ten times are rough for everyone.",
    "What worked for me: I kept a doc of every question I fumbled and drilled just those.",
    "Two weeks of that beats two months of passive watching.",
    "Good luck — you're asking the right things already.",
  ],
  [
    "Love this one. So, two parts.",
    "First: the thing you think disqualifies you usually doesn't — it just needs a frame.",
    "Second: the people evaluating you remember energy and clarity more than credentials.",
    "I've seen candidates with perfect resumes lose to people who were just... present and prepared.",
    "That's the whole game honestly.",
  ],
];

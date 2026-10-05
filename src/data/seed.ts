/* ------------------------------------------------------------------ */
/* Seed world. Fictional people, real employers (it's a prototype).    */
/* Two kinds of session, which is the whole product in one field:      */
/*   hiring — a recruiter on process and what they screen for          */
/*   inside — someone doing the job, on what it's actually like        */
/* ------------------------------------------------------------------ */

export type Kind = "hiring" | "inside";
export type Field = "engineering" | "product" | "design" | "data" | "finance" | "consulting";

export const FIELDS: { id: Field; label: string }[] = [
  { id: "engineering", label: "Engineering" },
  { id: "product", label: "Product" },
  { id: "design", label: "Design" },
  { id: "data", label: "Data" },
  { id: "finance", label: "Finance" },
  { id: "consulting", label: "Consulting" },
];

export interface Role {
  id: string;
  title: string;
  team: string;
  location: string;
  closes?: string;
}

export interface Company {
  id: string;
  name: string;
  /** Stage lighting only — content, never chrome. */
  tone: string;
  about: string;
  hq: string;
  size: string;
  roles: Role[];
}

export interface Host {
  id: string;
  name: string;
  title: string;
  companyId: string;
  kind: "recruiter" | "employee";
  verified: boolean;
  /** How the credential was checked; shown next to the mark. */
  via?: string;
  since: string;
  bio: string;
}

export interface Chapter {
  /** seconds into the recording */
  t: number;
  q: string;
  asker: string;
  a: string[];
}

export interface Session {
  id: string;
  hostId: string;
  kind: Kind;
  field: Field;
  title: string;
  status: "live" | "scheduled" | "recorded";
  /** live: minutes since start, scheduled: minutes until start */
  offsetMin: number;
  durationMin: number;
  /** live: where the crowd sim starts. Never displayed directly. */
  crowdSeed?: number;
  /** recorded: archive views, labeled as such */
  views?: number;
  /** recorded: days ago */
  daysAgo?: number;
  roleIds?: string[];
  captions: string[];
  questions: string[];
  chapters?: Chapter[];
}

export const COMPANIES: Company[] = [
  {
    id: "stripe",
    name: "Stripe",
    tone: "#5b54e8",
    hq: "South San Francisco",
    size: "8,000+",
    about: "Payments infrastructure for the internet. Hires new grads into most engineering teams every fall.",
    roles: [
      { id: "stripe-ng", title: "Software Engineer, New Grad 2027", team: "Engineering", location: "SF, Seattle, NYC", closes: "Nov 30" },
      { id: "stripe-intern", title: "Software Engineering Intern, Summer 2027", team: "Engineering", location: "SF, Seattle", closes: "Nov 15" },
      { id: "stripe-infra", title: "Infrastructure Engineer", team: "Infrastructure", location: "Remote (US)" },
    ],
  },
  {
    id: "janestreet",
    name: "Jane Street",
    tone: "#2f7d6a",
    hq: "New York",
    size: "3,000+",
    about: "Quantitative trading firm. Hires traders, researchers, and developers from every major.",
    roles: [
      { id: "js-trader", title: "Quantitative Trader, Full-Time", team: "Trading", location: "New York, London" },
      { id: "js-intern", title: "Trading Intern, Summer 2027", team: "Trading", location: "New York", closes: "Oct 31" },
    ],
  },
  {
    id: "figma",
    name: "Figma",
    tone: "#c2553a",
    hq: "San Francisco",
    size: "1,700+",
    about: "The collaborative design tool. Design team reviews every portfolio by hand.",
    roles: [
      { id: "figma-pd", title: "Product Designer, Early Career", team: "Design", location: "SF, NYC" },
      { id: "figma-intern", title: "Product Design Intern, Summer 2027", team: "Design", location: "SF", closes: "Dec 1" },
    ],
  },
  {
    id: "mckinsey",
    name: "McKinsey",
    tone: "#3a5fa8",
    hq: "New York",
    size: "45,000+",
    about: "Management consulting. Case interviews for every generalist track.",
    roles: [
      { id: "mck-ba", title: "Business Analyst", team: "Generalist", location: "All US offices", closes: "Oct 20" },
      { id: "mck-sba", title: "Summer Business Analyst", team: "Generalist", location: "All US offices", closes: "Jan 12" },
    ],
  },
  {
    id: "ramp",
    name: "Ramp",
    tone: "#b39a2a",
    hq: "New York",
    size: "1,000+",
    about: "Corporate cards and spend software. Small teams, high ownership, fast promotion.",
    roles: [
      { id: "ramp-apm", title: "Associate Product Manager", team: "Product", location: "New York" },
      { id: "ramp-swe", title: "Software Engineer, New Grad", team: "Engineering", location: "New York, SF" },
    ],
  },
  {
    id: "goldman",
    name: "Goldman Sachs",
    tone: "#6f86a8",
    hq: "New York",
    size: "45,000+",
    about: "Investment banking, markets, and asset management. Summer analyst classes drive full-time hiring.",
    roles: [
      { id: "gs-sa", title: "Summer Analyst, Investment Banking 2027", team: "IBD", location: "New York", closes: "Nov 3" },
      { id: "gs-possibilities", title: "Possibilities Summit (Sophomores)", team: "Early Insight", location: "Virtual", closes: "Oct 25" },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    tone: "#8a8a86",
    hq: "San Francisco",
    size: "800+",
    about: "The connected workspace. Data science sits inside product teams.",
    roles: [
      { id: "notion-ds", title: "Data Scientist, Product", team: "Data", location: "SF, NYC" },
    ],
  },
  {
    id: "airbnb",
    name: "Airbnb",
    tone: "#c43d5a",
    hq: "San Francisco",
    size: "6,000+",
    about: "Travel marketplace. Hires engineers from nontraditional backgrounds into its apprenticeship.",
    roles: [
      { id: "abnb-connect", title: "Connect Engineering Apprenticeship", team: "Engineering", location: "Remote (US)", closes: "Nov 8" },
      { id: "abnb-swe", title: "Software Engineer, Early Career", team: "Engineering", location: "SF, Remote" },
    ],
  },
];

export const HOSTS: Host[] = [
  { id: "priya", name: "Priya Raman", title: "University Recruiting Lead", companyId: "stripe", kind: "recruiter", verified: true, via: "Work email", since: "2019", bio: "Runs new-grad and intern hiring for Stripe engineering. Reads roughly 4,000 resumes a season." },
  { id: "oliver", name: "Oliver Grant", title: "Software Engineer, Payments", companyId: "stripe", kind: "employee", verified: true, via: "Work email", since: "2023", bio: "Joined from the 2023 new-grad class. Works on card authorization." },
  { id: "marcus", name: "Marcus Oyelaran", title: "Trader", companyId: "janestreet", kind: "employee", verified: true, via: "Work email", since: "2022", bio: "Physics undergrad, interned on the desk in 2022, returned full-time." },
  { id: "lena", name: "Lena Park", title: "Senior Product Designer", companyId: "figma", kind: "employee", verified: true, via: "Work email", since: "2020", bio: "Designs FigJam. Sits on the design hiring committee." },
  { id: "jordan", name: "Jordan Hale", title: "Design Recruiter", companyId: "figma", kind: "recruiter", verified: true, via: "Work email", since: "2021", bio: "Recruits product designers and design interns." },
  { id: "daniel", name: "Daniel Cho", title: "Recruiting Manager", companyId: "mckinsey", kind: "recruiter", verified: true, via: "Work email", since: "2017", bio: "Leads undergraduate recruiting for the Northeast offices." },
  { id: "ife", name: "Ife Adeyemi", title: "Associate", companyId: "mckinsey", kind: "employee", verified: true, via: "Work email", since: "2024", bio: "Chemistry PhD, joined through the advanced-degree track." },
  { id: "aisha", name: "Aisha Bello", title: "Product Manager, Bill Pay", companyId: "ramp", kind: "employee", verified: true, via: "Work email", since: "2022", bio: "Moved from customer support to product in eighteen months." },
  { id: "kevin", name: "Kevin Tran", title: "Technical Recruiter", companyId: "ramp", kind: "recruiter", verified: true, via: "Work email", since: "2023", bio: "Recruits engineers and APMs. Formerly at a staffing agency." },
  { id: "rebecca", name: "Rebecca Stein", title: "Campus Recruiting Lead", companyId: "goldman", kind: "recruiter", verified: true, via: "Work email", since: "2016", bio: "Runs the IBD summer analyst program on the East Coast." },
  { id: "sam", name: "Sam Whitfield", title: "Investment Banking Analyst", companyId: "goldman", kind: "employee", verified: true, via: "Offer letter", since: "2025", bio: "First-year analyst in TMT. Summer analyst in 2024." },
  { id: "tomas", name: "Tomás Ferreira", title: "Data Scientist", companyId: "notion", kind: "employee", verified: true, via: "Work email", since: "2021", bio: "Owns activation metrics. Previously an economist." },
  { id: "rui", name: "Rui Tanaka", title: "Former Data Intern", companyId: "notion", kind: "employee", verified: false, since: "2025", bio: "Interned on the growth data team in summer 2025. Verification pending." },
  { id: "nina", name: "Nina Alvarez", title: "Software Engineer", companyId: "airbnb", kind: "employee", verified: true, via: "Work email", since: "2022", bio: "Bootcamp graduate, came in through the Connect apprenticeship." },
];

const GENERIC_Q = [
  "Does where I went to school matter for this?",
  "How early should I apply?",
  "What's one thing that makes an application stand out?",
  "Is a referral worth asking for if I barely know the person?",
  "What does the first year actually look like?",
];

export const SESSIONS: Session[] = [
  /* ---------------- live ---------------- */
  {
    id: "stripe-resumes",
    hostId: "priya",
    kind: "hiring",
    field: "engineering",
    title: "What we actually screen for in a new-grad resume",
    status: "live",
    offsetMin: 24,
    durationMin: 60,
    crowdSeed: 1180,
    roleIds: ["stripe-ng", "stripe-intern"],
    captions: [
      "So the first pass on a new-grad resume takes about ninety seconds.",
      "I'm not reading every line. I'm looking for one thing you built that someone used.",
      "A class project is fine. Tell me what broke, and what you changed.",
      "GPA matters less than people think. It's a tiebreaker, not a filter.",
      "The mistake I see most is a skills section with twenty languages.",
      "Pick three you'd be comfortable being interviewed in.",
      "Referrals help you get read. They don't get you through the loop.",
      "Our new-grad loop is four conversations, and one of them is debugging.",
      "Nobody expects you to know our stack. We expect good questions about it.",
      "Applications for the 2027 class close November 30th. The roles are pinned.",
    ],
    questions: [
      "Do you read cover letters for new grad?",
      "Is it bad to have only one internship?",
      "Should I list hackathons if I didn't win?",
      "How long after applying do you usually reply?",
      "Does a gap semester hurt?",
    ],
  },
  {
    id: "js-desk",
    hostId: "marcus",
    kind: "inside",
    field: "finance",
    title: "A day on the trading desk at Jane Street",
    status: "live",
    offsetMin: 41,
    durationMin: 75,
    crowdSeed: 860,
    captions: [
      "The desk is quiet at 7:40. Most of the morning is reading what changed overnight.",
      "People picture shouting. It's mostly people thinking out loud to each other.",
      "We make a lot of small decisions, and we write down why.",
      "The interview has mental math, but the job is estimation under pressure.",
      "I studied physics. About half my desk didn't study finance.",
      "If you're wrong, the fastest way out is saying so in the first minute.",
      "Board game night is real. It's also quietly a probability seminar.",
      "Ask me anything about the internship. I did it in 2022.",
    ],
    questions: [
      "How much coding do traders actually do?",
      "What did you study to prep for the math rounds?",
      "Is the hours thing exaggerated?",
      "Can you switch from trading to research later?",
    ],
  },
  {
    id: "figma-portfolios",
    hostId: "lena",
    kind: "inside",
    field: "design",
    title: "Live portfolio reviews for design students",
    status: "live",
    offsetMin: 12,
    durationMin: 90,
    crowdSeed: 640,
    captions: [
      "Okay, next portfolio. First thing: I can't tell what you did on this project.",
      "Lead with the decision, then show the screens that prove it.",
      "Three case studies is plenty. One great one beats five fine ones.",
      "Show me the version you threw away. That's where the judgment is.",
      "Hiring managers skim. Your headings should tell the whole story.",
      "Put the outcome near the top, even if it's a small one.",
      "This one's strong. Cut the process diagram, keep the before and after.",
    ],
    questions: [
      "Is it okay if my case studies are all school projects?",
      "Should I include visual design or only product work?",
      "How long should a case study be?",
      "Do you look at Dribbble at all?",
    ],
  },
  {
    id: "mck-case",
    hostId: "daniel",
    kind: "hiring",
    field: "consulting",
    title: "How to start a case interview",
    status: "live",
    offsetMin: 33,
    durationMin: 60,
    crowdSeed: 720,
    roleIds: ["mck-ba", "mck-sba"],
    captions: [
      "Most cases are decided in the first five minutes.",
      "Repeat the question back. It sounds basic. Almost nobody does it.",
      "Ask for thirty seconds to structure. We expect you to.",
      "A framework is a starting point, not a script. We can tell when it's memorized.",
      "Do your math out loud, so I can help if you drift.",
      "End with a recommendation, even if you're not sure. Especially then.",
    ],
    questions: [
      "How many practice cases is enough?",
      "Do non-target schools get first rounds?",
      "What's the PEI actually testing?",
      "Is it okay to use a calculator in the online assessment?",
    ],
  },
  {
    id: "ramp-pm",
    hostId: "aisha",
    kind: "inside",
    field: "product",
    title: "Becoming a product manager without an MBA",
    status: "live",
    offsetMin: 18,
    durationMin: 45,
    crowdSeed: 410,
    captions: [
      "I started in customer support. That's not a joke, it's the whole story.",
      "Support taught me which problems customers actually pay to fix.",
      "I wrote specs nobody asked for, and eventually someone read one.",
      "APM programs are rare. Most PMs I know switched in from somewhere else.",
      "A PM interview here is mostly: walk me through something you shipped.",
      "Bring numbers. Rough ones are fine, especially ones you measured yourself.",
    ],
    questions: [
      "How did you ask for the switch?",
      "Do you need to be technical to PM at Ramp?",
      "What would you do differently as a new grad?",
    ],
  },
  {
    id: "gs-timeline",
    hostId: "rebecca",
    kind: "hiring",
    field: "finance",
    title: "Summer analyst 2027: timeline and what to expect",
    status: "live",
    offsetMin: 52,
    durationMin: 60,
    crowdSeed: 1340,
    roleIds: ["gs-sa", "gs-possibilities"],
    captions: [
      "Here's the honest timeline. Most of our summer class is set by February.",
      "The application is the easy part. The video interview is where people lose points.",
      "We read every cover letter. Keep it to what you want and why here.",
      "Networking helps you understand a division. It isn't a back door.",
      "Superdays are four interviews back to back. Pace yourself.",
      "If you're a sophomore, the program to watch is pinned on the right.",
    ],
    questions: [
      "Does the division you pick on the application lock you in?",
      "Is it too late if I haven't networked at all?",
      "What technicals come up in the first round?",
      "How much does the HireVue actually count?",
    ],
  },
  {
    id: "notion-ds",
    hostId: "tomas",
    kind: "inside",
    field: "data",
    title: "What a data scientist at Notion actually does",
    status: "live",
    offsetMin: 7,
    durationMin: 45,
    crowdSeed: 290,
    captions: [
      "Most of my week is making sure a number means what people think it means.",
      "Modeling is maybe a fifth of the job. Definitions are the rest.",
      "SQL matters more than anything else on your resume.",
      "The best interview answers start with 'it depends', and then say on what.",
      "If you can explain a p-value to a designer, you'll do fine here.",
    ],
    questions: [
      "How much ML do you actually use?",
      "Is a master's necessary for DS roles?",
      "What does the take-home look like?",
    ],
  },

  /* ---------------- scheduled ---------------- */
  { id: "stripe-loop", hostId: "oliver", kind: "inside", field: "engineering", title: "My new-grad loop at Stripe, round by round", status: "scheduled", offsetMin: 22, durationMin: 45, captions: [], questions: GENERIC_Q },
  { id: "figma-recruit", hostId: "jordan", kind: "hiring", field: "design", title: "Design internships 2027: what opens when", status: "scheduled", offsetMin: 68, durationMin: 45, roleIds: ["figma-intern"], captions: [], questions: GENERIC_Q },
  { id: "ramp-offers", hostId: "kevin", kind: "hiring", field: "engineering", title: "How Ramp levels new-grad engineers", status: "scheduled", offsetMin: 135, durationMin: 30, roleIds: ["ramp-swe"], captions: [], questions: GENERIC_Q },
  { id: "gs-first-year", hostId: "sam", kind: "inside", field: "finance", title: "First year in banking, hour by hour", status: "scheduled", offsetMin: 210, durationMin: 60, captions: [], questions: GENERIC_Q },
  { id: "mck-phd", hostId: "ife", kind: "inside", field: "consulting", title: "Consulting after a PhD", status: "scheduled", offsetMin: 60 * 18 + 40, durationMin: 45, captions: [], questions: GENERIC_Q },
  { id: "abnb-connect", hostId: "nina", kind: "inside", field: "engineering", title: "Bootcamp to Airbnb through the apprenticeship", status: "scheduled", offsetMin: 60 * 23 + 10, durationMin: 60, roleIds: ["abnb-connect"], captions: [], questions: GENERIC_Q },
  { id: "notion-intern", hostId: "rui", kind: "inside", field: "data", title: "What my data internship was actually like", status: "scheduled", offsetMin: 60 * 26, durationMin: 30, captions: [], questions: GENERIC_Q },
  { id: "stripe-intern-q", hostId: "priya", kind: "hiring", field: "engineering", title: "Intern applications: open questions, answered", status: "scheduled", offsetMin: 60 * 49 + 30, durationMin: 60, roleIds: ["stripe-intern"], captions: [], questions: GENERIC_Q },

  /* ---------------- recorded ---------------- */
  {
    id: "abnb-bootcamp",
    hostId: "nina",
    kind: "inside",
    field: "engineering",
    title: "From coding bootcamp to Airbnb",
    status: "recorded",
    offsetMin: 0,
    durationMin: 58,
    views: 4120,
    daysAgo: 2,
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["I did a twelve-week bootcamp at twenty-six, after four years in restaurants.", "Nothing about my path was fast. That's the part I want to talk about."] },
      { t: 312, q: "How many applications did you send?", asker: "Maya, Michigan", a: ["Two hundred and ten over seven months. Four got past a phone screen.", "The apprenticeship was the only one that read the portfolio first."] },
      { t: 804, q: "Did you feel behind CS grads once you started?", asker: "Devon, UT Austin", a: ["For about six months, yes. Then it stopped mattering.", "Everyone is learning the codebase. Nobody arrives knowing it."] },
      { t: 1390, q: "What did your portfolio have on it?", asker: "Sofia, Rutgers", a: ["Two projects. One was a tool my old restaurant still uses for scheduling.", "Real users beat a clean README every time."] },
      { t: 2105, q: "How do you get past the resume filter without a degree?", asker: "James, self-taught", a: ["Apprenticeships and referrals. The general pipeline mostly filters on degrees.", "Target the programs built to read you differently."] },
      { t: 2870, q: "Would you do the bootcamp again?", asker: "Priyanka, career switcher", a: ["Yes, but I'd start building in public the first week, not the last."] },
    ],
  },
  {
    id: "stripe-intern-rec",
    hostId: "priya",
    kind: "hiring",
    field: "engineering",
    title: "Internship interviews, question by question",
    status: "recorded",
    offsetMin: 0,
    durationMin: 62,
    views: 9870,
    daysAgo: 6,
    roleIds: ["stripe-intern"],
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["Today is the intern loop, start to finish.", "I'll take questions as we go and chapter every one."] },
      { t: 240, q: "Which language should I interview in?", asker: "Alex, Georgia Tech", a: ["The one you think in. We have interviewers for all the common ones.", "Switching languages to impress us costs you more than it earns."] },
      { t: 915, q: "What happens if I don't finish the problem?", asker: "Hana, UCLA", a: ["It happens constantly. We score how you got there.", "A clear partial solution beats a silent full one."] },
      { t: 1620, q: "Do you ask LeetCode hards?", asker: "Ben, Waterloo", a: ["No. Our problems are closer to real work, with more reading and less trickery."] },
      { t: 2400, q: "How are interns matched to teams?", asker: "Grace, NYU", a: ["After the offer, from a short survey and a call with two or three managers."] },
      { t: 3120, q: "Can interns get return offers every year?", asker: "Omar, Purdue", a: ["Most of our new-grad class comes from last summer's interns.", "Return offers aren't guaranteed, but they're the default outcome."] },
    ],
  },
  {
    id: "gs-ibd-rec",
    hostId: "sam",
    kind: "inside",
    field: "finance",
    title: "My first year in investment banking",
    status: "recorded",
    offsetMin: 0,
    durationMin: 48,
    views: 6230,
    daysAgo: 9,
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["I'm a first-year in TMT. I'll be honest about the hours and the work."] },
      { t: 410, q: "What are the real hours?", asker: "Chris, Wharton", a: ["Seventy to eighty on a normal week. Live deals are worse, and you'll know when."] },
      { t: 1050, q: "How much of the job is Excel vs PowerPoint?", asker: "Leah, BC", a: ["Early on, more PowerPoint than anyone admits. Modeling grows into it."] },
      { t: 1780, q: "Do analysts ever talk to clients?", asker: "Nikhil, Duke", a: ["On calls, yes. Leading them, rarely, and not in year one."] },
      { t: 2460, q: "Is it worth it?", asker: "Emma, Georgetown", a: ["For two years, for me, yes. I'd tell you if it weren't."] },
    ],
  },
  {
    id: "figma-first",
    hostId: "jordan",
    kind: "hiring",
    field: "design",
    title: "What design recruiters see first",
    status: "recorded",
    offsetMin: 0,
    durationMin: 40,
    views: 3510,
    daysAgo: 13,
    roleIds: ["figma-pd"],
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["I'll walk through what I see in the first thirty seconds of a portfolio."] },
      { t: 280, q: "Password-protected portfolios: yes or no?", asker: "Iris, RISD", a: ["Fine for NDA work. Put the password in the application, not in an email."] },
      { t: 900, q: "Do you care about the site itself?", asker: "Tom, CMU", a: ["A little. A clean template beats a clever site that's slow to load."] },
      { t: 1600, q: "How many case studies before I apply?", asker: "Ana, SCAD", a: ["Two finished ones. Don't wait for a third."] },
    ],
  },
  {
    id: "mck-phd-rec",
    hostId: "ife",
    kind: "inside",
    field: "consulting",
    title: "Moving from a PhD into consulting",
    status: "recorded",
    offsetMin: 0,
    durationMin: 44,
    views: 2140,
    daysAgo: 16,
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["Five years of chemistry, then consulting. Here's what carried over."] },
      { t: 360, q: "Did the PhD help in case interviews?", asker: "Wei, MIT", a: ["Structuring, yes. Business intuition, no. I practiced that separately."] },
      { t: 1180, q: "Do PhDs start at a higher level?", asker: "Laura, Stanford", a: ["Usually at associate, the same level as post-MBA hires."] },
      { t: 1990, q: "Do you miss research?", asker: "Kofi, Penn", a: ["The depth, sometimes. The pace of learning here is faster."] },
    ],
  },
  {
    id: "ramp-negotiate",
    hostId: "kevin",
    kind: "hiring",
    field: "product",
    title: "How to negotiate your first job offer",
    status: "recorded",
    offsetMin: 0,
    durationMin: 35,
    views: 7780,
    daysAgo: 20,
    captions: [],
    questions: [],
    chapters: [
      { t: 0, q: "Intro", asker: "", a: ["I make offers for a living. Here's what's movable and what isn't."] },
      { t: 220, q: "Can new grads negotiate at all?", asker: "Jess, Cornell", a: ["Yes, politely and once. Equity and start date move more than base."] },
      { t: 760, q: "Should I share competing offers?", asker: "Raj, Berkeley", a: ["If they're real, yes. Numbers help me make the case internally."] },
      { t: 1400, q: "Does negotiating ever get an offer pulled?", asker: "Mia, Northwestern", a: ["Almost never, if you're respectful. I've seen it once, and it wasn't the ask."] },
    ],
  },
];

/* Generic answer lines when the host takes a question from Q&A. */
export const ANSWER_LINES = [
  "Good question. I get some version of it every session.",
  "Honestly, it depends on the team, but here's the pattern I see.",
  "Start with what you've already done, and make it easy to find.",
  "Don't wait until you feel ready. Nobody on my team did.",
  "Short answer: yes, but not the way people usually do it.",
  "Thanks for asking it out loud. Half the chat was wondering the same thing.",
  "If you remember one thing: be specific. Specific beats impressive.",
];

export const CHAT_HANDLES = [
  "maya.k", "devon", "sofia_r", "jt2027", "ananya", "ben.w", "grace", "omar.h", "hana", "leo",
  "priyanka", "chris.m", "nikhil", "emma.g", "iris", "wei", "laura", "kofi", "jess", "raj.p",
  "mia", "alex.t", "tom", "ana.s", "noah", "zara", "eli", "ruby", "kai", "nora",
];

export const CHAT_LINES = [
  "this is so helpful",
  "taking notes",
  "joining from the library",
  "hi from Chicago",
  "hello from Toronto",
  "this is my first session on here",
  "can you say more about that",
  "wish my career center said this",
  "that's the opposite of what I was told",
  "writing that down",
  "good to hear that honestly",
  "this is making me rethink my resume",
  "same question here",
  "is this being recorded?",
  "yes it gets chaptered",
  "late, what did I miss",
  "love how direct this is",
  "first time on here, this is great",
  "the recording is in the library after",
  "that's really reassuring",
  "okay that makes sense",
  "sophomore here, is it too early",
  "switching careers, this is useful",
  "someone asked that last week too",
  "can you share the link to the roles",
  "they're pinned in the roles tab",
  "thank you for doing these",
];

export const findHost = (id: string) => HOSTS.find((h) => h.id === id)!;
export const findCompany = (id: string) => COMPANIES.find((c) => c.id === id)!;
export const findSession = (id: string) => SESSIONS.find((s) => s.id === id);
export const companyOf = (s: Session) => findCompany(findHost(s.hostId).companyId);
export const rolesFor = (s: Session): Role[] => {
  const c = companyOf(s);
  return (s.roleIds ?? []).map((id) => c.roles.find((r) => r.id === id)).filter(Boolean) as Role[];
};

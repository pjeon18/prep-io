import type { Clip, Host, SessionInfo } from "../lib/types";

/* ------------------------------------------------------------------ */
/* CAMPUS — the second audience (D17).                                 */
/*                                                                     */
/* Teachers and TAs running live office hours, section, and review      */
/* sessions for a course. The thesis: today this is a mix of Canvas +   */
/* Zoom + a calendar + Panopto, and none of those know about each       */
/* other. A course here is ONE channel: what's live now, what's this    */
/* week, every past session as a chaptered recording, and clips cut     */
/* from them. One click to join from the web, real chat, and the same   */
/* consent-gated hand-raise the careers side uses — because "raise your */
/* hand and get called on" is literally what office hours are.          */
/*                                                                     */
/* Deliberately a SEPARATE data island from the careers seed. Sharing   */
/* the SESSIONS array would leak course sessions into the fair floor    */
/* and search, so campus surfaces read these arrays and the lookups in  */
/* lib/campus.ts resolve across both.                                   */
/* ------------------------------------------------------------------ */

export type CampusKind = "lecture" | "office-hours" | "section" | "review";

export interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  /** staff id of the instructor of record */
  instructorId: string;
  taIds: string[];
  enrolled: number;
  hue: number;
  /** shown on the course channel header */
  blurb: string;
}

/** Course staff. Host-shaped so every existing avatar, badge, and channel
 *  component works unchanged; `badge` here means verified course staff. */
export const STAFF: Host[] = [
  {
    id: "s-chen",
    name: "Prof. David Chen",
    headline: "Instructor · CS50",
    org: "Harvard SEAS",
    school: "Faculty",
    badge: "verified-role",
    sectionId: "stem",
    bio: "I teach CS50. Office hours are for the questions you were too embarrassed to ask in lecture, which are usually the important ones.",
    hue: 214,
    initials: "DC",
    followers: 1840,
  },
  {
    id: "s-aisha",
    name: "Aisha Rahman",
    headline: "Head TF · CS50",
    org: "Harvard SEAS",
    school: "Verified course staff",
    badge: "verified-school",
    sectionId: "stem",
    bio: "Head teaching fellow. I run the evening office hours and the problem-set walkthroughs.",
    hue: 330,
    initials: "AR",
    followers: 612,
  },
  {
    id: "s-vasquez",
    name: "Prof. Elena Vasquez",
    headline: "Instructor · STAT 110",
    org: "Harvard Statistics",
    school: "Faculty",
    badge: "verified-role",
    sectionId: "stem",
    bio: "Probability, taught by working problems live rather than by watching me work them.",
    hue: 268,
    initials: "EV",
    followers: 1320,
  },
  {
    id: "s-webb",
    name: "Marcus Webb",
    headline: "TF · STAT 110",
    org: "Harvard Statistics",
    school: "Verified course staff",
    badge: "verified-school",
    sectionId: "stem",
    bio: "Section leader. Bring the problem you're stuck on and we'll do it on the board.",
    hue: 150,
    initials: "MW",
    followers: 288,
  },
  {
    id: "s-osei",
    name: "Prof. Nadia Osei",
    headline: "Instructor · EC 10",
    org: "Harvard Economics",
    school: "Faculty",
    badge: "verified-role",
    sectionId: "finance",
    bio: "Principles of economics for 900 students, which means office hours have to scale.",
    hue: 26,
    initials: "NO",
    followers: 2210,
  },
];

export const COURSES: Course[] = [
  {
    id: "cs50",
    code: "CS50",
    title: "Introduction to Computer Science",
    term: "Fall 2026",
    instructorId: "s-chen",
    taIds: ["s-aisha"],
    enrolled: 742,
    hue: 214,
    blurb: "Lectures, evening office hours, and problem-set walkthroughs. Everything is recorded and chaptered by question.",
  },
  {
    id: "stat110",
    code: "STAT 110",
    title: "Introduction to Probability",
    term: "Fall 2026",
    instructorId: "s-vasquez",
    taIds: ["s-webb"],
    enrolled: 410,
    hue: 268,
    blurb: "Problem-solving sessions and exam reviews. We work the problems live, on the board.",
  },
  {
    id: "ec10",
    code: "EC 10",
    title: "Principles of Economics",
    term: "Fall 2026",
    instructorId: "s-osei",
    taIds: [],
    enrolled: 903,
    hue: 26,
    blurb: "One instructor, nine hundred students. Office hours run as a live room so an answer reaches everyone at once.",
  },
];

/** Course sessions. Same shape as career sessions, so the live room, the
 *  crowd simulation, the hand-raise funnel, and the recording player all
 *  work on them with no special cases. */
export interface CourseSession extends SessionInfo {
  courseId: string;
  campusKind: CampusKind;
}

export const COURSE_SESSIONS: CourseSession[] = [
  // ---- live right now ----
  {
    id: "cs50-oh-live",
    courseId: "cs50",
    campusKind: "office-hours",
    hostId: "s-aisha",
    sectionId: "stem",
    title: "CS50 evening office hours: Problem Set 4",
    kind: "live",
    seedViewers: 63,
    video: true,
  },
  {
    id: "ec10-oh-live",
    courseId: "ec10",
    campusKind: "office-hours",
    hostId: "s-osei",
    sectionId: "finance",
    title: "EC 10 office hours: elasticity and the midterm",
    kind: "live",
    seedViewers: 128,
  },

  // ---- this week ----
  {
    id: "cs50-lec-1",
    courseId: "cs50",
    campusKind: "lecture",
    hostId: "s-chen",
    sectionId: "stem",
    title: "Lecture 8: Dynamic memory and pointers",
    kind: "scheduled",
    when: "Mon 10:00 AM",
    video: true,
  },
  {
    id: "stat110-review-1",
    courseId: "stat110",
    campusKind: "review",
    hostId: "s-vasquez",
    sectionId: "stem",
    title: "Midterm review: joint distributions, start to finish",
    kind: "scheduled",
    when: "Wed 7:00 PM",
    video: true,
  },
  {
    id: "stat110-sec-1",
    courseId: "stat110",
    campusKind: "section",
    hostId: "s-webb",
    sectionId: "stem",
    title: "Section 4: conditional expectation problems",
    kind: "scheduled",
    when: "Thu 3:00 PM",
  },
  {
    id: "cs50-oh-2",
    courseId: "cs50",
    campusKind: "office-hours",
    hostId: "s-chen",
    sectionId: "stem",
    title: "Instructor office hours (open agenda)",
    kind: "scheduled",
    when: "Fri 2:00 PM",
  },

  // ---- recordings: the course library ----
  {
    id: "cs50-vod-1",
    courseId: "cs50",
    campusKind: "lecture",
    hostId: "s-chen",
    sectionId: "stem",
    title: "Lecture 7: Arrays, strings, and command-line arguments",
    kind: "vod",
    vod: {
      recordedOn: "Last Mon",
      views: 688,
      durationLabel: "74 min",
      chapters: [
        { t: "05:20", question: "Why is a string just an array of chars?", askedBy: "Priya" },
        { t: "22:41", question: "When does argv actually matter?", askedBy: "Jonah" },
        { t: "41:08", question: "How do I debug a segfault I can't see?", askedBy: "Mei" },
        { t: "58:30", question: "Is malloc ever the wrong answer?", askedBy: "Sam" },
      ],
    },
  },
  {
    id: "cs50-vod-2",
    courseId: "cs50",
    campusKind: "office-hours",
    hostId: "s-aisha",
    sectionId: "stem",
    title: "Office hours: Problem Set 3 walkthrough",
    kind: "vod",
    vod: {
      recordedOn: "Last Thu",
      views: 401,
      durationLabel: "52 min",
      chapters: [
        { t: "03:12", question: "My sort works but times out. Why?", askedBy: "Andre" },
        { t: "19:55", question: "How do I read the spec's edge cases?", askedBy: "Ruth" },
        { t: "36:44", question: "Can we see a clean recursion example?", askedBy: "Kai" },
      ],
    },
  },
  {
    id: "stat110-vod-1",
    courseId: "stat110",
    campusKind: "section",
    hostId: "s-webb",
    sectionId: "stem",
    title: "Section 3: expectation, variance, and the tricky ones",
    kind: "vod",
    vod: {
      recordedOn: "Last Thu",
      views: 356,
      durationLabel: "48 min",
      chapters: [
        { t: "04:02", question: "Why does LOTUS work?", askedBy: "Dani" },
        { t: "21:30", question: "Variance of a sum, without expanding?", askedBy: "Omar" },
        { t: "38:15", question: "Which distribution do I reach for first?", askedBy: "Lin" },
      ],
    },
  },
  {
    id: "ec10-vod-1",
    courseId: "ec10",
    campusKind: "lecture",
    hostId: "s-osei",
    sectionId: "finance",
    title: "Lecture 6: Taxes, subsidies, and deadweight loss",
    kind: "vod",
    vod: {
      recordedOn: "Last Wed",
      views: 1204,
      durationLabel: "66 min",
      chapters: [
        { t: "08:44", question: "Who actually pays the tax?", askedBy: "Chloe" },
        { t: "27:19", question: "Is deadweight loss ever worth it?", askedBy: "Ben" },
        { t: "49:02", question: "How does this show up on the exam?", askedBy: "Ivy" },
      ],
    },
  },
];

/** Clips cut from course recordings — the "I just need the one bit" case
 *  that sends students scrubbing through a 74-minute Panopto video today. */
export const COURSE_CLIPS: Clip[] = [
  { id: "cc-1", hostId: "s-aisha", title: "The pointer diagram that makes it click", views: 2140, durationLabel: "1:12", hue: 330 },
  { id: "cc-2", hostId: "s-chen", title: "Segfault: how to find it in 60 seconds", views: 1806, durationLabel: "0:58", hue: 214 },
  { id: "cc-3", hostId: "s-webb", title: "LOTUS in one worked example", views: 1420, durationLabel: "1:04", hue: 150 },
  { id: "cc-4", hostId: "s-vasquez", title: "Which distribution to reach for", views: 1268, durationLabel: "0:49", hue: 268 },
  { id: "cc-5", hostId: "s-osei", title: "Tax incidence, drawn once and for all", views: 2402, durationLabel: "1:08", hue: 26 },
];

/** Courses the signed-in student is enrolled in (demo default). */
export const MY_COURSE_IDS = ["cs50", "stat110", "ec10"];

/** The course the demo user is a TA for, used by the Teach hub. */
export const TEACHING_COURSE_ID = "cs50";

export const CAMPUS_KIND_LABEL: Record<CampusKind, string> = {
  lecture: "Lecture",
  "office-hours": "Office hours",
  section: "Section",
  review: "Review session",
};

/** What a class actually says in an office-hours chat. The careers pools
 *  talk about recruiting; a CS50 room does not. */
export const CAMPUS_CHAT_LINES: string[] = [
  "is this going to be on the exam",
  "can you go back one slide",
  "wait can you re-explain that part",
  "oh THAT is what it was doing",
  "thank you, that unblocked me",
  "joining late, what did I miss",
  "same question honestly",
  "^^ this",
  "does the deadline move if we use a late day",
  "my code compiles now, no idea why",
  "screenshotting this",
  "can you show the whole function once more",
  "audio is fine on my end",
  "is section recorded too",
  "this made more sense than the textbook",
  "office hours >>> reading the spec alone",
];

/** Questions students raise a hand with. */
export const CAMPUS_QUESTIONS: string[] = [
  "Can you walk through the first part of the problem set slowly?",
  "Why does that recursion terminate?",
  "How much of this do we need for the exam?",
  "I get a segfault only on the large input. Where do I start?",
  "Could you do one more example from scratch?",
  "What is the difference between the two approaches you showed?",
  "Is there a cleaner way to write what I have?",
  "How should I check my answer if I have no solutions?",
];

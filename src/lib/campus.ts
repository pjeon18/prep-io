import { CLIPS, HOSTS, SESSIONS } from "../data/seedData";
import {
  COURSES,
  COURSE_CLIPS,
  COURSE_SESSIONS,
  MY_COURSE_IDS,
  STAFF,
} from "../data/campusData";
import type { Course, CourseSession } from "../data/campusData";
import type { Clip, Host, SessionInfo } from "./types";

/* Cross-island lookups.
 *
 * Careers and campus keep separate seed arrays so neither leaks into the
 * other's discovery surfaces. Anything that resolves an id — the live room,
 * the recording player, the store's joinRoom — has to look in both, so it
 * goes through these helpers rather than reaching for SESSIONS/HOSTS. */

export const ALL_SESSIONS: SessionInfo[] = [...SESSIONS, ...COURSE_SESSIONS];
export const ALL_PEOPLE: Host[] = [...HOSTS, ...STAFF];
export const ALL_CLIPS: Clip[] = [...CLIPS, ...COURSE_CLIPS];

export const findSession = (id?: string) =>
  id ? ALL_SESSIONS.find((s) => s.id === id) : undefined;

export const findPerson = (id?: string) =>
  id ? ALL_PEOPLE.find((p) => p.id === id) : undefined;

export const findClip = (id?: string) =>
  id ? ALL_CLIPS.find((c) => c.id === id) : undefined;

export const findCourse = (id?: string) =>
  id ? COURSES.find((c) => c.id === id) : undefined;

/** True when a session belongs to the campus side — used to route back to a
 *  course channel instead of the fair when a room ends. */
export const isCourseSession = (id?: string): boolean =>
  !!id && COURSE_SESSIONS.some((s) => s.id === id);

export const courseOf = (sessionId?: string): Course | undefined => {
  const s = COURSE_SESSIONS.find((x) => x.id === sessionId);
  return s ? findCourse(s.courseId) : undefined;
};

export const courseSessions = (courseId: string): CourseSession[] =>
  COURSE_SESSIONS.filter((s) => s.courseId === courseId);

export const courseStaff = (course: Course): Host[] =>
  [course.instructorId, ...course.taIds].map(findPerson).filter(Boolean) as Host[];

export const courseClips = (course: Course): Clip[] => {
  const staff = new Set([course.instructorId, ...course.taIds]);
  return COURSE_CLIPS.filter((c) => staff.has(c.hostId));
};

export const myCourses = (): Course[] =>
  MY_COURSE_IDS.map(findCourse).filter(Boolean) as Course[];

/** Live campus sessions across every enrolled course. */
export const campusLiveNow = (): CourseSession[] =>
  COURSE_SESSIONS.filter((s) => s.kind === "live");

/** Upcoming campus sessions, in seed order (the week's schedule). */
export const campusUpcoming = (): CourseSession[] =>
  COURSE_SESSIONS.filter((s) => s.kind === "scheduled");

/** Every campus recording, newest-seeded first. */
export const campusRecordings = (): CourseSession[] =>
  COURSE_SESSIONS.filter((s) => s.kind === "vod");

/* ---------------- campus search ----------------
 * Campus mode needs its own index: a student searching "office hours" or
 * "CS50" must not get Goldman Sachs back. Same plain-substring approach as
 * lib/search.ts, over the campus island. */

export interface CampusResults {
  courses: Course[];
  staff: Host[];
  live: CourseSession[];
  upcoming: CourseSession[];
  recordings: CourseSession[];
  clips: Clip[];
}

export function searchCampus(query: string): CampusResults {
  const q = query.trim().toLowerCase();
  const empty: CampusResults = {
    courses: [], staff: [], live: [], upcoming: [], recordings: [], clips: [],
  };
  if (q.length < 2) return empty;
  const has = (s: string) => s.toLowerCase().includes(q);

  const courses = COURSES.filter(
    (c) => has(c.code) || has(c.title) || has(c.blurb) || has(c.term),
  );
  const staff = STAFF.filter((p) => has(p.name) || has(p.headline) || has(p.org));

  const courseIds = new Set(courses.map((c) => c.id));
  const staffIds = new Set(staff.map((p) => p.id));
  const sessions = COURSE_SESSIONS.filter(
    (s) => has(s.title) || courseIds.has(s.courseId) || staffIds.has(s.hostId),
  );

  return {
    courses,
    staff,
    live: sessions.filter((s) => s.kind === "live"),
    upcoming: sessions.filter((s) => s.kind === "scheduled"),
    recordings: sessions.filter((s) => s.kind === "vod"),
    clips: COURSE_CLIPS.filter((c) => has(c.title) || staffIds.has(c.hostId)),
  };
}

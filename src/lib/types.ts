export type SectionId =
  | "finance"
  | "stem"
  | "design"
  | "healthcare"
  | "law"
  | "gradschool"
  | "consulting"
  | "media";

export interface Section {
  id: SectionId;
  name: string;
  blurb: string;
}

/** Verification is the product. Unverified must be clearly marked everywhere. */
export type BadgeState = "verified-role" | "verified-school" | "unverified";

export interface Host {
  id: string;
  name: string;
  /** e.g. "IB Analyst · Goldman Sachs" */
  headline: string;
  org: string;
  school: string;
  badge: BadgeState;
  sectionId: SectionId;
  bio: string;
  /** breakout rate in $ per 15 min; undefined = breakouts off */
  rate?: number;
  /** hue for the generated gradient avatar */
  hue: number;
  initials: string;
  followers: number;
}

export type SessionKind = "live" | "scheduled" | "vod";

export interface VodChapter {
  /** display timestamp, e.g. "04:12" */
  t: string;
  question: string;
  askedBy: string;
}

export interface SessionInfo {
  id: string;
  hostId: string;
  sectionId: SectionId;
  title: string;
  kind: SessionKind;
  /** scheduled sessions: display label like "Thu 7:00 PM" */
  when?: string;
  /** live sessions: seed for the crowd simulation (evolves; never rendered raw) */
  seedViewers?: number;
  vod?: {
    chapters: VodChapter[];
    views: number;
    recordedOn: string;
    durationLabel: string;
  };
}

export interface ChatMsg {
  id: string;
  author: string;
  authorHue: number;
  text: string;
  /** host messages render distinctly */
  isHost?: boolean;
  isYou?: boolean;
  /** system lines: joins, promotions */
  isSystem?: boolean;
}

export type HandStatus = "queued" | "hotseat" | "answered" | "dismissed";

export interface Hand {
  id: string;
  /** persona id, or "you" */
  who: string;
  name: string;
  hue: number;
  question: string;
  status: HandStatus;
}

export interface AnsweredQ {
  question: string;
  askedBy: string;
  /** sim seconds into the session when answered — becomes the VOD chapter */
  atSec: number;
}

export interface CrowdPersona {
  id: string;
  name: string;
  hue: number;
  /** lurkers rarely chat; chatty often; askers raise hands */
  style: "lurker" | "chatty" | "asker";
}

export interface Recap {
  sessionTitle: string;
  sectionId: SectionId;
  durationLabel: string;
  peakViewers: number;
  questionsAnswered: AnsweredQ[];
  handsRaised: number;
  followsGained: number;
  /** the recap's promise: the session compounds into the library */
  vodId: string;
}

export interface Notification {
  id: string;
  text: string;
  /** route to open */
  to: string;
  when: string;
}

export interface GoLiveDraft {
  sectionId: SectionId | null;
  title: string;
  mode: "now" | "scheduled";
  when: string;
  handRaise: boolean;
  slowMode: boolean;
  rate: number | null;
}

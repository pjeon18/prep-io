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

/** Companies are first-class discovery objects: search "BCG" and find its
 *  people, streams, and events. */
export interface Company {
  id: string;
  name: string;
  blurb: string;
  initials: string;
  hue: number;
  sectionIds: SectionId[];
}

/** Verification is the product. Unverified must be clearly marked everywhere. */
export type BadgeState = "verified-role" | "verified-school" | "unverified";

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
}

export interface Host {
  id: string;
  name: string;
  /** e.g. "IB Analyst · Goldman Sachs" */
  headline: string;
  org: string;
  companyId?: string;
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
  /** paid membership tiers (channel subscriptions); optional */
  tiers?: MembershipTier[];
}

export type SessionKind = "live" | "scheduled" | "vod";

export interface VodChapter {
  /** display timestamp, e.g. "04:12" */
  t: string;
  question: string;
  askedBy: string;
}

/** Capacity-limited event config. price=null + commit → the $1 commitment
 *  model (not revenue: bot filter + attendance stake, refunded on show-up). */
export interface TicketConfig {
  capacity: number;
  /** seed for simulated seats already taken */
  seedTaken: number;
  price: number | null;
  commit: boolean;
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
  /** camera stream vs audio-only office hours */
  video?: boolean;
  ticket?: TicketConfig;
  vod?: {
    chapters: VodChapter[];
    views: number;
    recordedOn: string;
    durationLabel: string;
    /** premium-gated recording (channel chose not to publish it free) */
    premium?: boolean;
  };
}

/** Shorts / clips — vertical moments a channel publishes. */
export interface Clip {
  id: string;
  hostId: string;
  title: string;
  views: number;
  durationLabel: string;
  hue: number;
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
  /** points attached — highlighted "boosted" chat */
  boost?: number;
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
  /** points attached. Boost raises VISIBILITY to the host (pinned shelf) —
   *  it never buys the stage; promotion stays the host's choice. */
  boost?: number;
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
  /** points earned from boosts this session */
  boostPoints: number;
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
  video: boolean;
}

/** Watch history entry (local, private). */
export interface HistoryEntry {
  id: string;
  kind: "live" | "vod" | "clip";
  title: string;
  hostId: string;
  when: string;
}

export interface Ticket {
  sessionId: string;
  /** paid amount; 1 = the commitment dollar (refundable on attendance) */
  paid: number;
  status: "reserved";
}

/** Premium playlists: string recordings and shorts into a mini-course. */
export interface Playlist {
  id: string;
  name: string;
  /** vod ids and clip ids, ordered */
  items: string[];
}

export interface CareerGoals {
  sections: SectionId[];
  companyIds: string[];
}

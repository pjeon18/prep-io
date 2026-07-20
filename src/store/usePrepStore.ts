import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnsweredQ,
  BadgeState,
  ChatMsg,
  GoLiveDraft,
  Hand,
  Notification,
  Recap,
  SectionId,
  SessionInfo,
} from "../lib/types";
import { HOSTS, SESSIONS } from "../data/seedData";

/* ------------------------------------------------------------------ */
/* THE STORE — invariants are enforced HERE, not in the UI.            */
/*  - You are in at most ONE room (viewer or host).                    */
/*  - The funnel ascends only by consent: a hot seat can only come     */
/*    from a queued hand (raised = consent given); promotion of a      */
/*    non-queued person is a no-op. No cold pulls on stage.            */
/*  - Liveness is honest: viewer counts/chat/queue only change via     */
/*    simulation actions; nothing renders a hardcoded count.           */
/*  - No DMs, no feed: there is no message-thread state, and follows   */
/*    produce only calendar entries + notifications.                   */
/* ------------------------------------------------------------------ */

export interface RoomState {
  sessionId: string;
  role: "viewer" | "host";
  hostId: string; // "you" when hosting
  title: string;
  sectionId: SectionId;
  viewers: number;
  peakViewers: number;
  elapsedSec: number;
  chat: ChatMsg[];
  queue: Hand[];
  hotSeat: Hand | null;
  hostAnswering: boolean;
  answered: AnsweredQ[];
  handsRaisedTotal: number;
  slowMode: boolean;
  handRaiseOn: boolean;
  rate: number | null;
  /** viewer side: a breakout the host has offered YOU (consent pending) */
  breakoutOffer: { rate: number } | null;
  ended: boolean;
}

export interface BreakoutState {
  hostId: string;
  hostName: string;
  rate: number;
  minutes: number;
  paid: boolean;
}

interface Toast {
  id: number;
  text: string;
}

interface DebugState {
  llmCrowd: boolean;
  /** viewers the engine should add over the next ticks (debug surge) */
  surgePending: number;
  /** demo control: sim host promotes your hand next, skipping the queue */
  fastTrackYou: boolean;
}

interface PrepState {
  seenSplash: boolean;
  follows: { hosts: string[]; sections: SectionId[] };
  notifications: Notification[];
  verification: { state: "none" | "pending" | BadgeState; method: string | null };
  /** sessions you hosted that compounded into the library */
  userVods: SessionInfo[];
  room: RoomState | null;
  recap: Recap | null;
  breakout: BreakoutState | null;
  hostDraft: GoLiveDraft;
  /** sim-driven live counts for the fair floor, keyed by session id */
  floorCounts: Record<string, number>;
  toasts: Toast[];
  debug: DebugState;

  // navigation-ish
  markSplashSeen: () => void;

  // toasts
  toast: (text: string) => void;
  dismissToast: (id: number) => void;

  // fair floor sim
  initFloor: () => void;
  driftFloor: () => void;

  // room lifecycle
  joinRoom: (sessionId: string) => boolean;
  leaveRoom: () => void;
  endRoom: () => void;
  clearRecap: () => void;

  // crowd-sim writes (engine only)
  simSetViewers: (n: number) => void;
  simPushChat: (msg: Omit<ChatMsg, "id">) => void;
  simTick: () => void;
  simRaiseHand: (hand: Omit<Hand, "id" | "status">) => void;
  simSetAnswering: (on: boolean) => void;

  // the funnel (consent-gated)
  raiseHand: (question: string) => boolean;
  lowerHand: () => void;
  promoteHand: (handId: string) => boolean;
  finishHotSeat: () => void;
  dismissHand: (handId: string) => void;
  sendChat: (text: string) => void;

  // breakout (both sides consent)
  simOfferBreakout: (rate: number) => void;
  acceptBreakout: () => void;
  declineBreakout: () => void;
  payBreakout: () => void;
  closeBreakout: () => void;

  // follows & notifications (no feed)
  toggleFollowHost: (hostId: string) => void;
  toggleFollowSection: (sectionId: SectionId) => void;
  clearNotification: (id: string) => void;

  // host side
  setHostDraft: (patch: Partial<GoLiveDraft>) => void;
  startVerification: (method: string) => void;
  completeVerification: (badge: BadgeState) => void;
  goLive: () => boolean;

  // debug
  setLlmCrowd: (on: boolean) => void;
  forceSurge: () => void;
  fastTrackYou: () => void;
  resetAll: () => void;
}

let idCounter = 1;
const uid = () => `${Date.now().toString(36)}-${idCounter++}`;

const emptyDraft: GoLiveDraft = {
  sectionId: null,
  title: "",
  mode: "now",
  when: "Thu 7:00 PM",
  handRaise: true,
  slowMode: true,
  rate: null,
};

export const usePrepStore = create<PrepState>()(
  persist(
    (set, get) => ({
      seenSplash: false,
      follows: { hosts: [], sections: [] },
      notifications: [],
      verification: { state: "none", method: null },
      userVods: [],
      room: null,
      recap: null,
      breakout: null,
      hostDraft: { ...emptyDraft },
      floorCounts: {},
      toasts: [],
      debug: { llmCrowd: false, surgePending: 0, fastTrackYou: false },

      markSplashSeen: () => set({ seenSplash: true }),

      toast: (text) => {
        const id = ++idCounter;
        set((s) => ({ toasts: [...s.toasts, { id, text }] }));
        setTimeout(
          () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
          3200,
        );
      },
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      initFloor: () => {
        const counts = { ...get().floorCounts };
        for (const sesh of SESSIONS) {
          if (sesh.kind === "live" && counts[sesh.id] === undefined) {
            counts[sesh.id] = sesh.seedViewers ?? 10;
          }
        }
        set({ floorCounts: counts });
      },

      driftFloor: () => {
        const { floorCounts, room } = get();
        const next: Record<string, number> = {};
        for (const [id, n] of Object.entries(floorCounts)) {
          // the room you're in is driven by the full engine, not the drift
          if (room && room.sessionId === id) {
            next[id] = room.viewers;
            continue;
          }
          const delta = Math.round((Math.random() - 0.45) * 4);
          next[id] = Math.max(3, n + delta);
        }
        set({ floorCounts: next });
      },

      joinRoom: (sessionId) => {
        const { room } = get();
        if (room) return room.sessionId === sessionId; // already somewhere
        const sesh = SESSIONS.find((x) => x.id === sessionId);
        if (!sesh || sesh.kind !== "live") return false; // archives never open live
        const host = HOSTS.find((h) => h.id === sesh.hostId)!;
        const seed = get().floorCounts[sessionId] ?? sesh.seedViewers ?? 10;
        set({
          room: {
            sessionId,
            role: "viewer",
            hostId: host.id,
            title: sesh.title,
            sectionId: sesh.sectionId,
            viewers: seed,
            peakViewers: seed,
            elapsedSec: 0,
            chat: [],
            queue: [],
            hotSeat: null,
            hostAnswering: false,
            answered: [],
            handsRaisedTotal: 0,
            slowMode: true,
            handRaiseOn: true,
            rate: host.rate ?? null,
            breakoutOffer: null,
            ended: false,
          },
        });
        return true;
      },

      leaveRoom: () => set({ room: null }),

      endRoom: () => {
        const { room } = get();
        if (!room) return;
        // a hot seat interrupted by the end of the session still counts —
        // the question was asked and answered in front of the room
        const answered = room.hotSeat
          ? [
              ...room.answered,
              {
                question: room.hotSeat.question,
                askedBy: room.hotSeat.name,
                atSec: room.elapsedSec,
              },
            ]
          : room.answered;
        const mins = Math.max(1, Math.round(room.elapsedSec / 60));
        const vodId = `you-vod-${uid()}`;
        const recap: Recap = {
          sessionTitle: room.title,
          sectionId: room.sectionId,
          durationLabel: `${mins} min`,
          peakViewers: room.peakViewers,
          questionsAnswered: answered,
          handsRaised: room.handsRaisedTotal,
          followsGained: Math.max(1, Math.round(room.peakViewers * 0.08)),
          vodId,
        };
        const vod: SessionInfo = {
          id: vodId,
          hostId: "you",
          sectionId: room.sectionId,
          title: room.title,
          kind: "vod",
          vod: {
            recordedOn: "Today",
            views: 0,
            durationLabel: `${mins} min`,
            chapters: answered.map((a) => ({
              t: fmtClock(a.atSec),
              question: a.question,
              askedBy: a.askedBy,
            })),
          },
        };
        set((s) => ({
          room: null,
          recap,
          userVods: room.role === "host" ? [vod, ...s.userVods] : s.userVods,
        }));
      },

      clearRecap: () => set({ recap: null }),

      simSetViewers: (n) =>
        set((s) =>
          s.room
            ? {
                room: {
                  ...s.room,
                  viewers: n,
                  peakViewers: Math.max(s.room.peakViewers, n),
                },
              }
            : {},
        ),

      simPushChat: (msg) =>
        set((s) =>
          s.room
            ? {
                room: {
                  ...s.room,
                  chat: [...s.room.chat.slice(-79), { ...msg, id: uid() }],
                },
              }
            : {},
        ),

      simTick: () =>
        set((s) =>
          s.room
            ? { room: { ...s.room, elapsedSec: s.room.elapsedSec + 1 } }
            : {},
        ),

      simRaiseHand: (hand) =>
        set((s) =>
          s.room
            ? {
                room: {
                  ...s.room,
                  queue: [...s.room.queue, { ...hand, id: uid(), status: "queued" }],
                  handsRaisedTotal: s.room.handsRaisedTotal + 1,
                },
              }
            : {},
        ),

      simSetAnswering: (on) =>
        set((s) => (s.room ? { room: { ...s.room, hostAnswering: on } } : {})),

      raiseHand: (question) => {
        const { room, toast } = get();
        if (!room || room.ended) return false;
        if (!room.handRaiseOn) {
          toast("Hand raise is off for this session");
          return false;
        }
        const already =
          room.queue.some((h) => h.who === "you") || room.hotSeat?.who === "you";
        if (already) {
          toast("Your hand is already up");
          return false;
        }
        const q = question.trim();
        if (!q) return false;
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                queue: [
                  ...s.room.queue,
                  { id: uid(), who: "you", name: "you", hue: 36, question: q, status: "queued" },
                ],
                handsRaisedTotal: s.room.handsRaisedTotal + 1,
              }
            : null,
        }));
        return true;
      },

      lowerHand: () =>
        set((s) =>
          s.room
            ? {
                room: {
                  ...s.room,
                  queue: s.room.queue.filter((h) => h.who !== "you"),
                },
              }
            : {},
        ),

      // Consent gate: only a QUEUED hand can reach the stage. A raised hand
      // is the viewer's explicit opt-in; there is no path that puts someone
      // on stage without one (Principle 6).
      promoteHand: (handId) => {
        const { room } = get();
        if (!room || room.hotSeat) return false;
        const hand = room.queue.find((h) => h.id === handId && h.status === "queued");
        if (!hand) return false;
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                queue: s.room.queue.filter((h) => h.id !== handId),
                hotSeat: { ...hand, status: "hotseat" },
              }
            : null,
        }));
        return true;
      },

      finishHotSeat: () => {
        const { room } = get();
        if (!room || !room.hotSeat) return;
        const seat = room.hotSeat;
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                hotSeat: null,
                hostAnswering: false,
                answered: [
                  ...s.room.answered,
                  { question: seat.question, askedBy: seat.name, atSec: s.room.elapsedSec },
                ],
              }
            : null,
        }));
      },

      dismissHand: (handId) =>
        set((s) =>
          s.room
            ? {
                room: {
                  ...s.room,
                  queue: s.room.queue.filter((h) => h.id !== handId),
                },
              }
            : {},
        ),

      sendChat: (text) => {
        const t = text.trim();
        if (!t || !get().room) return;
        get().simPushChat({ author: "you", authorHue: 36, text: t, isYou: true });
      },

      simOfferBreakout: (rate) =>
        set((s) => (s.room ? { room: { ...s.room, breakoutOffer: { rate } } } : {})),

      acceptBreakout: () => {
        const { room } = get();
        if (!room || !room.breakoutOffer) return; // no offer, no breakout
        const host = HOSTS.find((h) => h.id === room.hostId);
        set({
          breakout: {
            hostId: room.hostId,
            hostName: host?.name ?? "Host",
            rate: room.breakoutOffer.rate,
            minutes: 15,
            paid: false,
          },
          room: { ...room, breakoutOffer: null },
        });
      },

      declineBreakout: () =>
        set((s) => (s.room ? { room: { ...s.room, breakoutOffer: null } } : {})),

      payBreakout: () =>
        set((s) => (s.breakout ? { breakout: { ...s.breakout, paid: true } } : {})),

      closeBreakout: () => set({ breakout: null }),

      toggleFollowHost: (hostId) => {
        const { follows, notifications, toast } = get();
        const on = follows.hosts.includes(hostId);
        const host = HOSTS.find((h) => h.id === hostId);
        let notes = notifications;
        if (!on && host) {
          const sched = SESSIONS.find(
            (x) => x.hostId === hostId && x.kind === "scheduled",
          );
          if (sched) {
            notes = [
              {
                id: uid(),
                text: `${host.name} goes live ${sched.when}: "${sched.title}"`,
                to: `/section/${sched.sectionId}`,
                when: sched.when ?? "",
              },
              ...notifications,
            ];
          }
          toast(`Following ${host.name} — you'll be notified when they go live`);
        }
        set({
          follows: {
            ...follows,
            hosts: on
              ? follows.hosts.filter((x) => x !== hostId)
              : [...follows.hosts, hostId],
          },
          notifications: notes,
        });
      },

      toggleFollowSection: (sectionId) => {
        const { follows } = get();
        const on = follows.sections.includes(sectionId);
        set({
          follows: {
            ...follows,
            sections: on
              ? follows.sections.filter((x) => x !== sectionId)
              : [...follows.sections, sectionId],
          },
        });
      },

      clearNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      setHostDraft: (patch) =>
        set((s) => ({ hostDraft: { ...s.hostDraft, ...patch } })),

      startVerification: (method) =>
        set({ verification: { state: "pending", method } }),

      completeVerification: (badge) =>
        set((s) => ({ verification: { state: badge, method: s.verification.method } })),

      goLive: () => {
        const { room, hostDraft, toast } = get();
        if (room) {
          toast("You're already in a room");
          return false;
        }
        if (!hostDraft.sectionId || !hostDraft.title.trim()) return false;
        set({
          room: {
            sessionId: `you-live-${uid()}`,
            role: "host",
            hostId: "you",
            title: hostDraft.title.trim(),
            sectionId: hostDraft.sectionId,
            viewers: 1,
            peakViewers: 1,
            elapsedSec: 0,
            chat: [],
            queue: [],
            hotSeat: null,
            hostAnswering: false,
            answered: [],
            handsRaisedTotal: 0,
            slowMode: hostDraft.slowMode,
            handRaiseOn: hostDraft.handRaise,
            rate: hostDraft.rate,
            breakoutOffer: null,
            ended: false,
          },
        });
        return true;
      },

      setLlmCrowd: (on) =>
        set((s) => ({ debug: { ...s.debug, llmCrowd: on } })),

      forceSurge: () =>
        set((s) => ({ debug: { ...s.debug, surgePending: s.debug.surgePending + 40 } })),

      fastTrackYou: () =>
        set((s) => ({ debug: { ...s.debug, fastTrackYou: true } })),

      resetAll: () => {
        localStorage.removeItem("prep-io");
        location.reload();
      },
    }),
    {
      name: "prep-io",
      // Live room state is ephemeral by design — persisting a "live" room
      // would resurrect fake liveness on reload (Principle 5).
      partialize: (s) => ({
        seenSplash: s.seenSplash,
        follows: s.follows,
        notifications: s.notifications,
        verification: s.verification,
        userVods: s.userVods,
        debug: { ...s.debug, surgePending: 0, fastTrackYou: false },
      }),
    },
  ),
);

// Dev-only handle for debugging/driving the store from the console.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).prepStore = usePrepStore;
}

export function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fmtCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

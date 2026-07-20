import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnsweredQ,
  BadgeState,
  CareerGoals,
  ChatMsg,
  GoLiveDraft,
  Hand,
  HistoryEntry,
  Notification,
  Playlist,
  Recap,
  SectionId,
  SessionInfo,
  Ticket,
} from "../lib/types";
import { HOSTS, SESSIONS } from "../data/seedData";

/* ------------------------------------------------------------------ */
/* THE STORE — invariants are enforced HERE, not in the UI.            */
/*  - You are in at most ONE room (viewer or host).                    */
/*  - The funnel ascends only by consent: a hot seat can only come     */
/*    from a queued hand (raised = consent given). Boosts raise a      */
/*    question's VISIBILITY to the host — promotion of a non-queued    */
/*    person is a no-op and boosts never force stage time (D9).        */
/*  - Liveness is honest: viewer counts/chat/queue only change via     */
/*    simulation actions; nothing renders a hardcoded count.           */
/*  - No DMs, no feed: no message-thread state; follows/subscriptions  */
/*    produce only calendar entries + notifications; explore is        */
/*    goal-driven and finite (D10).                                    */
/* ------------------------------------------------------------------ */

export interface RoomState {
  sessionId: string;
  role: "viewer" | "host";
  hostId: string; // "you" when hosting
  title: string;
  sectionId: SectionId;
  video: boolean;
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
  /** points attached to boosts this session (host earnings) */
  boostEarned: number;
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
  surgePending: number;
  fastTrackYou: boolean;
}

interface PrepState {
  seenSplash: boolean;
  follows: { hosts: string[]; sections: SectionId[] };
  notifications: Notification[];
  verification: { state: "none" | "pending" | BadgeState; method: string | null };
  userVods: SessionInfo[];
  room: RoomState | null;
  recap: Recap | null;
  breakout: BreakoutState | null;
  hostDraft: GoLiveDraft;
  floorCounts: Record<string, number>;
  toasts: Toast[];
  debug: DebugState;

  // v2
  premium: boolean;
  points: number;
  likes: { sessions: string[]; clips: string[] };
  memberships: Record<string, string>; // hostId -> tierId
  history: HistoryEntry[];
  playlists: Playlist[];
  tickets: Record<string, Ticket>;
  goals: CareerGoals;
  linkedin: { connected: boolean };

  markSplashSeen: () => void;
  toast: (text: string) => void;
  dismissToast: (id: number) => void;

  initFloor: () => void;
  driftFloor: () => void;

  joinRoom: (sessionId: string) => boolean;
  leaveRoom: () => void;
  endRoom: () => void;
  clearRecap: () => void;

  simSetViewers: (n: number) => void;
  simPushChat: (msg: Omit<ChatMsg, "id">) => void;
  simTick: () => void;
  simRaiseHand: (hand: Omit<Hand, "id" | "status">) => void;
  simSetAnswering: (on: boolean) => void;

  raiseHand: (question: string, boost?: number) => boolean;
  lowerHand: () => void;
  promoteHand: (handId: string) => boolean;
  finishHotSeat: () => void;
  dismissHand: (handId: string) => void;
  sendChat: (text: string, boost?: number) => void;
  boostYourHand: (points: number) => boolean;

  simOfferBreakout: (rate: number) => void;
  acceptBreakout: () => void;
  declineBreakout: () => void;
  payBreakout: () => void;
  closeBreakout: () => void;

  toggleFollowHost: (hostId: string) => void;
  toggleFollowSection: (sectionId: SectionId) => void;
  clearNotification: (id: string) => void;

  setHostDraft: (patch: Partial<GoLiveDraft>) => void;
  startVerification: (method: string) => void;
  completeVerification: (badge: BadgeState) => void;
  goLive: () => boolean;

  // v2 actions
  upgradePremium: () => void;
  cancelPremium: () => void;
  buyPoints: (n: number) => void;
  spendPoints: (n: number) => boolean;
  toggleLike: (kind: "sessions" | "clips", id: string) => void;
  joinMembership: (hostId: string, tierId: string) => void;
  leaveMembership: (hostId: string) => void;
  recordHistory: (entry: Omit<HistoryEntry, "when">) => void;
  clearHistory: () => void;
  createPlaylist: (name: string) => string | null;
  addToPlaylist: (playlistId: string, itemId: string) => void;
  removeFromPlaylist: (playlistId: string, itemId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  reserveTicket: (sessionId: string) => boolean;
  releaseTicket: (sessionId: string) => void;
  setGoals: (goals: Partial<CareerGoals>) => void;
  connectLinkedIn: () => void;

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
  video: false,
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

      premium: false,
      points: 0,
      likes: { sessions: [], clips: [] },
      memberships: {},
      history: [],
      playlists: [],
      tickets: {},
      goals: { sections: [], companyIds: [] },
      linkedin: { connected: false },

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
        if (room) return room.sessionId === sessionId;
        const sesh = SESSIONS.find((x) => x.id === sessionId);
        if (!sesh || sesh.kind !== "live") return false; // recordings never open live
        const host = HOSTS.find((h) => h.id === sesh.hostId)!;
        const seed = get().floorCounts[sessionId] ?? sesh.seedViewers ?? 10;
        get().recordHistory({
          id: sessionId,
          kind: "live",
          title: sesh.title,
          hostId: host.id,
        });
        set({
          room: {
            sessionId,
            role: "viewer",
            hostId: host.id,
            title: sesh.title,
            sectionId: sesh.sectionId,
            video: !!sesh.video,
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
            boostEarned: 0,
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
          boostPoints: room.boostEarned,
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
            // new recordings default to the premium library (D11);
            // channels can publish selected ones free
            premium: true,
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
                  boostEarned: s.room.boostEarned + (hand.boost ?? 0),
                },
              }
            : {},
        ),

      simSetAnswering: (on) =>
        set((s) => (s.room ? { room: { ...s.room, hostAnswering: on } } : {})),

      raiseHand: (question, boost) => {
        const { room, toast, spendPoints } = get();
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
        let attached = 0;
        if (boost && boost > 0) {
          if (spendPoints(boost)) attached = boost;
          else toast("Not enough points — hand raised without a boost");
        }
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                queue: [
                  ...s.room.queue,
                  {
                    id: uid(),
                    who: "you",
                    name: "you",
                    hue: 36,
                    question: q,
                    status: "queued",
                    boost: attached || undefined,
                  },
                ],
                handsRaisedTotal: s.room.handsRaisedTotal + 1,
                boostEarned: s.room.boostEarned + attached,
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
      // on stage without one (Principle 6). Boosts don't change this.
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

      sendChat: (text, boost) => {
        const t = text.trim();
        if (!t || !get().room) return;
        let attached = 0;
        if (boost && boost > 0 && get().spendPoints(boost)) {
          attached = boost;
          set((s) =>
            s.room ? { room: { ...s.room, boostEarned: s.room.boostEarned + boost } } : {},
          );
        }
        get().simPushChat({
          author: "you",
          authorHue: 36,
          text: t,
          isYou: true,
          boost: attached || undefined,
        });
      },

      boostYourHand: (points) => {
        const { room, spendPoints, toast } = get();
        if (!room || points <= 0) return false;
        const mine = room.queue.find((h) => h.who === "you");
        if (!mine) return false;
        if (!spendPoints(points)) {
          toast("Not enough points");
          return false;
        }
        set((s) => ({
          room: s.room
            ? {
                ...s.room,
                boostEarned: s.room.boostEarned + points,
                queue: s.room.queue.map((h) =>
                  h.who === "you" ? { ...h, boost: (h.boost ?? 0) + points } : h,
                ),
              }
            : null,
        }));
        return true;
      },

      simOfferBreakout: (rate) =>
        set((s) => (s.room ? { room: { ...s.room, breakoutOffer: { rate } } } : {})),

      acceptBreakout: () => {
        const { room } = get();
        if (!room || !room.breakoutOffer) return;
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
          toast(`Subscribed to ${host.name} — you'll get go-live alerts`);
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
            video: hostDraft.video,
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
            boostEarned: 0,
            breakoutOffer: null,
            ended: false,
          },
        });
        return true;
      },

      /* ---------------- v2 actions ---------------- */

      upgradePremium: () => {
        set({ premium: true });
        get().toast("Premium is on — recordings, transcripts, and playlists unlocked");
      },
      cancelPremium: () => set({ premium: false }),

      buyPoints: (n) => {
        set((s) => ({ points: s.points + n }));
        get().toast(`Added ${n} points (stubbed purchase)`);
      },

      spendPoints: (n) => {
        if (get().points < n) return false;
        set((s) => ({ points: s.points - n }));
        return true;
      },

      toggleLike: (kind, id) =>
        set((s) => {
          const list = s.likes[kind];
          return {
            likes: {
              ...s.likes,
              [kind]: list.includes(id)
                ? list.filter((x) => x !== id)
                : [...list, id],
            },
          };
        }),

      joinMembership: (hostId, tierId) => {
        const host = HOSTS.find((h) => h.id === hostId);
        const tier = host?.tiers?.find((t) => t.id === tierId);
        if (!host || !tier) return;
        set((s) => ({ memberships: { ...s.memberships, [hostId]: tierId } }));
        get().toast(`You're a ${tier.name} of ${host.name} (stubbed billing)`);
      },

      leaveMembership: (hostId) =>
        set((s) => {
          const next = { ...s.memberships };
          delete next[hostId];
          return { memberships: next };
        }),

      recordHistory: (entry) =>
        set((s) => ({
          history: [
            { ...entry, when: "Today" },
            ...s.history.filter((h) => h.id !== entry.id),
          ].slice(0, 50),
        })),

      clearHistory: () => set({ history: [] }),

      // Playlists are a premium tool (D11): string recordings and shorts
      // into a mini-course.
      createPlaylist: (name) => {
        if (!get().premium) {
          get().toast("Playlists are a Premium tool");
          return null;
        }
        const n = name.trim();
        if (!n) return null;
        const id = `pl-${uid()}`;
        set((s) => ({ playlists: [...s.playlists, { id, name: n, items: [] }] }));
        return id;
      },

      addToPlaylist: (playlistId, itemId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId && !p.items.includes(itemId)
              ? { ...p, items: [...p.items, itemId] }
              : p,
          ),
        })),

      removeFromPlaylist: (playlistId, itemId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, items: p.items.filter((x) => x !== itemId) }
              : p,
          ),
        })),

      deletePlaylist: (playlistId) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== playlistId) })),

      // Capacity is enforced here: a full event cannot be reserved.
      reserveTicket: (sessionId) => {
        const sesh = SESSIONS.find((x) => x.id === sessionId);
        if (!sesh?.ticket || get().tickets[sessionId]) return false;
        const taken = sesh.ticket.seedTaken + 1; // sim; yours would be +1
        if (taken > sesh.ticket.capacity) {
          get().toast("This event is full");
          return false;
        }
        const paid = sesh.ticket.price ?? (sesh.ticket.commit ? 1 : 0);
        set((s) => ({
          tickets: {
            ...s.tickets,
            [sessionId]: { sessionId, paid, status: "reserved" },
          },
        }));
        return true;
      },

      releaseTicket: (sessionId) =>
        set((s) => {
          const next = { ...s.tickets };
          delete next[sessionId];
          return { tickets: next };
        }),

      setGoals: (goals) =>
        set((s) => ({ goals: { ...s.goals, ...goals } })),

      connectLinkedIn: () => {
        set({ linkedin: { connected: true } });
        get().toast("LinkedIn connected — role and school imported (stubbed)");
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
        premium: s.premium,
        points: s.points,
        likes: s.likes,
        memberships: s.memberships,
        history: s.history,
        playlists: s.playlists,
        tickets: s.tickets,
        goals: s.goals,
        linkedin: s.linkedin,
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

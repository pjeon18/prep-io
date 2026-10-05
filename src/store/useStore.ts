import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SESSIONS, type Kind } from "../data/seed";

/* One store. Every live number is written here by lib/sim.ts; no
   component invents a viewer count. Only preferences persist, so a
   live session is never resurrected on reload. */

export interface ChatMsg {
  id: number;
  who: string;
  text: string;
  me?: boolean;
}

export interface Question {
  id: number;
  who: string;
  text: string;
  votes: number;
  voted?: boolean;
  me?: boolean;
  answered?: boolean;
}

export interface Caption {
  key: number;
  text: string;
  /** set while the host reads a viewer's question aloud */
  asker?: string;
}

export interface Room {
  sessionId: string;
  chat: ChatMsg[];
  questions: Question[];
  caption: Caption | null;
  answering: number | null;
}

export interface Studio {
  phase: "setup" | "live" | "ended";
  title: string;
  kind: Kind;
  roleIds: string[];
  startedAt: number;
  viewers: number;
  peak: number;
  chat: ChatMsg[];
  questions: Question[];
}

interface State {
  epoch: number;
  viewers: Record<string, number>;
  room: Room | null;
  studio: Studio | null;

  name: string;
  reminders: string[];
  savedRoles: string[];
  following: string[];

  joinRoom: (id: string) => void;
  leaveRoom: () => void;
  sendChat: (text: string) => void;
  ask: (text: string) => void;
  upvote: (qid: number) => void;

  toggleReminder: (id: string) => void;
  toggleSavedRole: (id: string) => void;
  toggleFollow: (id: string) => void;

  studioSetup: (patch: Partial<Studio>) => void;
  goLive: () => void;
  markAnswered: (qid: number) => void;
  endStudio: () => void;
  closeStudio: () => void;

  reset: () => void;
}

let seq = 1;
export const nextId = () => seq++;

const initialViewers = () =>
  Object.fromEntries(SESSIONS.filter((s) => s.status === "live").map((s) => [s.id, s.crowdSeed ?? 100]));

const blankStudio = (): Studio => ({
  phase: "setup",
  title: "",
  kind: "hiring",
  roleIds: [],
  startedAt: 0,
  viewers: 0,
  peak: 0,
  chat: [],
  questions: [],
});

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      epoch: Date.now(),
      viewers: initialViewers(),
      room: null,
      studio: null,

      name: "Alex",
      reminders: ["figma-recruit"],
      savedRoles: [],
      following: ["stripe", "figma"],

      joinRoom: (id) => {
        if (get().room?.sessionId === id) return;
        set({ room: { sessionId: id, chat: [], questions: [], caption: null, answering: null } });
      },
      leaveRoom: () => set({ room: null }),

      sendChat: (text) => {
        const r = get().room;
        const t = text.trim();
        if (!r || !t) return;
        set({ room: { ...r, chat: [...r.chat, { id: nextId(), who: get().name, text: t, me: true }].slice(-120) } });
      },

      ask: (text) => {
        const r = get().room;
        const t = text.trim();
        if (!r || !t) return;
        set({ room: { ...r, questions: [...r.questions, { id: nextId(), who: get().name, text: t, votes: 1, voted: true, me: true }] } });
      },

      upvote: (qid) => {
        const r = get().room;
        if (!r) return;
        set({
          room: {
            ...r,
            questions: r.questions.map((q) => (q.id === qid && !q.me && !q.answered ? { ...q, voted: !q.voted, votes: q.votes + (q.voted ? -1 : 1) } : q)),
          },
        });
      },

      toggleReminder: (id) => set({ reminders: toggle(get().reminders, id) }),
      toggleSavedRole: (id) => set({ savedRoles: toggle(get().savedRoles, id) }),
      toggleFollow: (id) => set({ following: toggle(get().following, id) }),

      studioSetup: (patch) => set({ studio: { ...(get().studio ?? blankStudio()), ...patch } }),
      goLive: () => {
        const s = get().studio ?? blankStudio();
        if (!s.title.trim()) return;
        set({ studio: { ...s, phase: "live", startedAt: Date.now(), viewers: 0, peak: 0, chat: [], questions: [] } });
      },
      markAnswered: (qid) => {
        const s = get().studio;
        if (!s) return;
        set({ studio: { ...s, questions: s.questions.map((q) => (q.id === qid ? { ...q, answered: true } : q)) } });
      },
      endStudio: () => {
        const s = get().studio;
        if (s) set({ studio: { ...s, phase: "ended" } });
      },
      closeStudio: () => set({ studio: null }),

      reset: () => {
        localStorage.removeItem("prep-io-v5");
        location.reload();
      },
    }),
    {
      name: "prep-io-v5",
      partialize: (s) => ({ name: s.name, reminders: s.reminders, savedRoles: s.savedRoles, following: s.following }),
    },
  ),
);

if (import.meta.env.DEV) (window as unknown as { prepStore: typeof useStore }).prepStore = useStore;

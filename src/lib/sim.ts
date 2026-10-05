import { useStore, nextId, type Question } from "../store/useStore";
import { ANSWER_LINES, CHAT_HANDLES, CHAT_LINES, SESSIONS, findSession } from "../data/seed";

/* The crowd simulation. Viewer counts, chat, questions, votes, and the
   host working through Q&A all come from here. */

const S = () => useStore.getState();
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
export const readMs = (text: string) => 1300 + text.split(" ").length * 300;
const cap = (h: string) => h.charAt(0).toUpperCase() + h.slice(1).split(/[._]/)[0];

/* ---------------- every live session's viewer count ---------------- */

let floorTimer: ReturnType<typeof setInterval> | null = null;
let surge = 0;

export function startFloor() {
  if (floorTimer) return;
  floorTimer = setInterval(() => {
    const t = Date.now() / 1000;
    const next = { ...S().viewers };
    for (const s of SESSIONS) {
      if (s.status !== "live") continue;
      const base = s.crowdSeed ?? 100;
      const target = base * (1 + 0.08 * Math.sin(t / 40 + base)) * (1 + surge);
      const cur = next[s.id] ?? base;
      next[s.id] = Math.max(3, Math.round(cur + (target - cur) * 0.18 + rand(-0.012, 0.014) * base));
    }
    surge *= 0.9;
    useStore.setState({ viewers: next });
  }, 1600);
}
export const debugSurge = () => (surge = 0.9);

/* ---------------- a live session ---------------- */

let timers: ReturnType<typeof setTimeout>[] = [];
let running: string | null = null;
let speakTimer: ReturnType<typeof setTimeout> | undefined;
let script: { text: string; asker?: string; qid?: number }[] = [];
let hostLine = 0;
let used = new Set<string>();

const room = () => S().room;
const patch = (p: object) => {
  const r = room();
  if (r) useStore.setState({ room: { ...r, ...p } });
};
function later(ms: number, fn: () => void) {
  const id = running;
  timers.push(setTimeout(() => running === id && fn(), ms));
}
function loop(lo: number, hi: number, fn: () => void) {
  const go = () => later(rand(lo, hi), () => (fn(), go()));
  go();
}

function speakNext() {
  const r = room();
  if (!r) return;
  const session = findSession(r.sessionId)!;
  let line = script.shift();
  if (!line) {
    if (r.answering !== null) {
      const qid = r.answering;
      patch({ answering: null, questions: r.questions.map((q) => (q.id === qid ? { ...q, answered: true } : q)) });
    }
    line = { text: session.captions[hostLine++ % session.captions.length] };
  }
  if (line.qid !== undefined) patch({ answering: line.qid });
  patch({ caption: { key: nextId(), text: line.text, asker: line.asker } });
  const id = running;
  speakTimer = setTimeout(() => running === id && speakNext(), readMs(line.text));
}

function crowdQuestion(): Question | null {
  const r = room();
  if (!r) return null;
  const pool = findSession(r.sessionId)!.questions.filter((q) => !used.has(q));
  if (!pool.length) return null;
  const text = pick(pool);
  used.add(text);
  return { id: nextId(), who: cap(pick(CHAT_HANDLES)), text, votes: Math.round(rand(2, 12)) };
}

/** The host takes the most-upvoted open question and answers it on stream. */
function takeQuestion(preferMine = false) {
  const r = room();
  if (!r || r.answering !== null || script.length) return;
  const open = r.questions.filter((q) => !q.answered);
  if (!open.length) return;
  const mine = open.find((q) => q.me);
  const q = preferMine && mine ? mine : [...open].sort((a, b) => b.votes - a.votes)[0];
  const answers = [...ANSWER_LINES].sort(() => Math.random() - 0.5).slice(0, 2);
  script = [{ text: q.text, asker: q.me ? "you" : q.who, qid: q.id }, ...answers.map((text) => ({ text }))];
}

export function startRoom(sessionId: string) {
  stopRoom();
  const session = findSession(sessionId);
  if (!session || session.status !== "live") return;
  running = sessionId;
  hostLine = Math.floor(Math.random() * session.captions.length);
  script = [];
  used = new Set();

  patch({
    chat: Array.from({ length: 12 }, () => ({ id: nextId(), who: cap(pick(CHAT_HANDLES)), text: pick(CHAT_LINES) })),
    questions: [crowdQuestion(), crowdQuestion()].filter(Boolean),
  });

  speakNext();
  loop(1200, 3200, () => {
    const r = room();
    if (r) patch({ chat: [...r.chat, { id: nextId(), who: cap(pick(CHAT_HANDLES)), text: pick(CHAT_LINES) }].slice(-120) });
  });
  loop(9000, 15000, () => {
    const q = crowdQuestion();
    const r = room();
    if (q && r) patch({ questions: [...r.questions, q] });
  });
  loop(1500, 3200, () => {
    const r = room();
    const open = r?.questions.filter((q) => !q.answered && !q.me) ?? [];
    if (!r || !open.length) return;
    const t = pick(open);
    patch({ questions: r.questions.map((q) => (q.id === t.id ? { ...q, votes: q.votes + 1 } : q)) });
  });
  // the host checks Q&A every so often; your question gets picked up soon
  loop(10000, 16000, () => {
    const mine = room()?.questions.some((q) => q.me && !q.answered);
    if (mine || Math.random() < 0.5) takeQuestion(mine);
  });
}

export function stopRoom() {
  running = null;
  clearTimeout(speakTimer);
  timers.forEach(clearTimeout);
  timers = [];
}

export function debugAnswerMine() {
  takeQuestion(true);
}

/* ---------------- your own session (Go live) ---------------- */

let studioTimers: ReturnType<typeof setTimeout>[] = [];
let studioOn = false;

const HOST_QS = [
  "What's the biggest red flag on an application?",
  "How many interview rounds are there?",
  "Do you sponsor visas for new grads?",
  "Is it okay to apply to more than one team?",
  "What made the last person you hired stand out?",
  "How technical is the first screen?",
  "Should I follow up after applying?",
  "Do you hire from schools you don't recruit at?",
];

export function startStudio() {
  stopStudio();
  studioOn = true;
  const qs = [...HOST_QS].sort(() => Math.random() - 0.5);
  const st = () => S().studio;
  const set = (p: object) => st() && useStore.setState({ studio: { ...st()!, ...p } });
  const tick = (lo: number, hi: number, fn: () => void) => {
    const go = () => studioTimers.push(setTimeout(() => studioOn && (fn(), go()), rand(lo, hi)));
    go();
  };
  tick(900, 1600, () => {
    const s = st();
    if (!s || s.phase !== "live") return;
    const age = (Date.now() - s.startedAt) / 1000;
    const target = Math.min(540, 12 + age * 8);
    const v = Math.max(0, Math.round(s.viewers + (target - s.viewers) * 0.25 + rand(-2, 3)));
    set({ viewers: v, peak: Math.max(s.peak, v) });
  });
  tick(1200, 3000, () => {
    const s = st();
    if (s?.phase === "live" && s.viewers > 3) set({ chat: [...s.chat, { id: nextId(), who: cap(pick(CHAT_HANDLES)), text: pick(CHAT_LINES) }].slice(-80) });
  });
  tick(4000, 8000, () => {
    const s = st();
    const text = qs.shift();
    if (s?.phase === "live" && text) set({ questions: [...s.questions, { id: nextId(), who: cap(pick(CHAT_HANDLES)), text, votes: Math.round(rand(1, 6)) }] });
  });
  tick(1500, 3000, () => {
    const s = st();
    const open = s?.questions.filter((q) => !q.answered) ?? [];
    if (!s || !open.length) return;
    const t = pick(open);
    set({ questions: s.questions.map((q) => (q.id === t.id ? { ...q, votes: q.votes + 1 } : q)) });
  });
}

export function stopStudio() {
  studioOn = false;
  studioTimers.forEach(clearTimeout);
  studioTimers = [];
}

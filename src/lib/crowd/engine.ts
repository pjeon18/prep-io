import {
  CHAT_LINES,
  CHAT_LINES_FINANCE,
  HOSTS,
  HOST_ANSWER_LINES,
  PERSONAS,
  PERSONA_QUESTIONS,
} from "../../data/seedData";
import { usePrepStore } from "../../store/usePrepStore";
import { fetchCrowdLines } from "./llm";

/* ------------------------------------------------------------------ */
/* The crowd simulation — the prototype's technical heart.             */
/* Everything "live" in a room (viewer count, chat, hand raises, the   */
/* sim host's promote/answer loop) is produced HERE and written through */
/* store actions. Nothing in the UI invents liveness (Principle 5).    */
/*                                                                     */
/* Started/stopped by the room screens' mount effects. One room at a   */
/* time, matching the store's single-room invariant.                   */
/* ------------------------------------------------------------------ */

type Role = "viewer" | "host";

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

let timers: ReturnType<typeof setTimeout>[] = [];
let running = false;
let llmBuffer: string[] = [];
let usedQuestions = new Set<string>();

function later(ms: number, fn: () => void) {
  const t = setTimeout(() => {
    if (running) fn();
  }, ms);
  timers.push(t);
  return t;
}

function every(msLo: number, msHi: number, fn: () => void) {
  const loop = () => {
    later(rand(msLo, msHi), () => {
      fn();
      loop();
    });
  };
  loop();
}

const store = () => usePrepStore.getState();

export function startCrowd(role: Role) {
  stopCrowd();
  running = true;
  usedQuestions = new Set();
  llmBuffer = [];

  const room = store().room;
  if (!room) return;

  const host = HOSTS.find((h) => h.id === room.hostId);
  const finance = room.sectionId === "finance";
  const linePool = finance ? [...CHAT_LINES, ...CHAT_LINES_FINANCE] : CHAT_LINES;
  const questionPool =
    PERSONA_QUESTIONS[finance ? "finance" : "generic"] ?? PERSONA_QUESTIONS.generic;

  // Optional LLM chatter: prefetch a buffer; silent fallback to scripted.
  if (store().debug.llmCrowd) {
    fetchCrowdLines(room.title, host?.headline ?? "a host", 24).then((lines) => {
      if (lines && running) llmBuffer = lines;
    });
  }

  // 1s clock — powers chapter timestamps and the header timer.
  every(1000, 1000, () => store().simTick());

  // Arrivals & departures — an honest random walk, plus the debug surge.
  every(2200, 4200, () => {
    const r = store().room;
    if (!r) return;
    const s = store();
    let delta = Math.round(rand(-2, 3.4));
    if (s.debug.surgePending > 0) {
      const chunk = Math.min(s.debug.surgePending, Math.round(rand(7, 13)));
      delta += chunk;
      usePrepStore.setState((st) => ({
        debug: { ...st.debug, surgePending: st.debug.surgePending - chunk },
      }));
      if (Math.random() < 0.5) {
        s.simPushChat({
          author: "prep.io",
          authorHue: 36,
          text: "a wave of viewers just joined",
          isSystem: true,
        });
      }
    }
    // hosting: the room grows from 1 as the "fair" notices you
    if (r.role === "host" && r.viewers < 12) delta = Math.max(delta, 1);
    s.simSetViewers(Math.max(role === "host" ? 1 : 3, r.viewers + delta));
  });

  // Crowd chatter — personas weighted by style; slow-mode paced.
  every(2000, 4600, () => {
    const r = store().room;
    if (!r) return;
    const persona = pick(PERSONAS);
    if (persona.style === "lurker" && Math.random() < 0.72) return; // lurkers lurk
    const text = llmBuffer.length > 4 && Math.random() < 0.6
      ? llmBuffer.splice(Math.floor(Math.random() * llmBuffer.length), 1)[0]
      : pick(linePool);
    store().simPushChat({ author: persona.name, authorHue: persona.hue, text });
    if (store().debug.llmCrowd && llmBuffer.length === 4) {
      fetchCrowdLines(r.title, host?.headline ?? "a host", 20).then((lines) => {
        if (lines && running) llmBuffer.push(...lines);
      });
    }
  });

  // Persona hand-raises — askers join the queue with real questions.
  every(14000, 26000, () => {
    const r = store().room;
    if (!r || !r.handRaiseOn || r.queue.length >= 4) return;
    const asker = pick(PERSONAS.filter((p) => p.style === "asker"));
    if (r.queue.some((h) => h.who === asker.id) || r.hotSeat?.who === asker.id) return;
    const remaining = questionPool.filter((q) => !usedQuestions.has(q));
    if (remaining.length === 0) return;
    const q = pick(remaining);
    usedQuestions.add(q);
    store().simRaiseHand({ who: asker.id, name: asker.name, hue: asker.hue, question: q });
  });

  // Viewer mode only: the sim host runs the room — promotes queued hands
  // (through the same consent-gated store action) and streams answers.
  if (role === "viewer") {
    const hostLoop = () => {
      later(rand(5000, 9000), () => {
        const r = store().room;
        if (!r) return;
        if (!r.hotSeat && r.queue.length > 0) {
          const s = store();
          // debug fast-track: your hand jumps the line (still a raised hand)
          const yours = r.queue.find((h) => h.who === "you");
          const next = s.debug.fastTrackYou && yours ? yours : r.queue[0];
          if (s.debug.fastTrackYou && yours) {
            usePrepStore.setState((st) => ({
              debug: { ...st.debug, fastTrackYou: false },
            }));
          }
          if (s.promoteHand(next.id)) {
            s.simPushChat({
              author: "prep.io",
              authorHue: 36,
              text:
                next.who === "you"
                  ? "you're on the hot seat"
                  : `${next.name} is on the hot seat`,
              isSystem: true,
            });
            answerSequence(next.name, next.who === "you");
          }
        }
        hostLoop();
      });
    };
    hostLoop();
  }

  // Hosting: light crowd reactions while YOU are answering a hot seat.
  if (role === "host") {
    every(6000, 11000, () => {
      const r = store().room;
      if (!r || !r.hotSeat) return;
      const persona = pick(PERSONAS.filter((p) => p.style !== "lurker"));
      store().simPushChat({
        author: persona.name,
        authorHue: persona.hue,
        text: pick(["good question honestly", "needed this answer too", "taking notes", "^^ this"]),
      });
    });
  }
}

/** The sim host answers the current hot seat, line by line, then releases it. */
function answerSequence(askerName: string, isYou: boolean) {
  const r = store().room;
  if (!r) return;
  const host = HOSTS.find((h) => h.id === r.hostId);
  const script = pick(HOST_ANSWER_LINES);
  store().simSetAnswering(true);
  script.forEach((line, i) => {
    later(1800 + i * rand(2400, 3200), () => {
      const rr = store().room;
      if (!rr || !rr.hotSeat) return;
      store().simPushChat({
        author: host?.name ?? "Host",
        authorHue: host?.hue ?? 30,
        text: line,
        isHost: true,
      });
    });
  });
  later(1800 + script.length * 3200 + 1200, () => {
    const rr = store().room;
    if (!rr || !rr.hotSeat) return;
    store().finishHotSeat();
    store().simPushChat({
      author: "prep.io",
      authorHue: 36,
      text: isYou
        ? "you step down — thanks for asking"
        : `${askerName} steps down — thanks for asking`,
      isSystem: true,
    });
    // After YOUR hot seat, a host with a rate may offer a breakout.
    // The offer is consent side one; accepting is consent side two.
    if (isYou && rr.rate) {
      later(2600, () => {
        if (store().room) store().simOfferBreakout(rr.rate!);
      });
    }
  });
}

export function stopCrowd() {
  running = false;
  timers.forEach(clearTimeout);
  timers = [];
}

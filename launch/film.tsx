import { useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";
import "@fontsource-variable/figtree";
import "../src/styles/tokens.css";
import { Room, Avatar, CompanyLogo, LOOKS } from "../src/components/people";
import { Captions, Check, Expand, Eye, Pause, Plus, Up, Volume, VerifiedBadge } from "../src/components/icons";
import { COMPANIES } from "../src/data/seed";
import homeShot from "./shots/home.png";

/* ------------------------------------------------------------------ */
/* Prep.io launch film, V5 (CONCEPT D20). 1920×1080, 32s.              */
/* One thing in focus per shot. Slow where it should be slow, a little */
/* quicker only for the company grid. No overlaid slogans or pop-ups:  */
/* the product carries it, and it ends on the logo.                    */
/* Every frame is a pure function of t, so render.mjs can seek it.     */
/* ------------------------------------------------------------------ */

export const DURATION = 32;
const W = 1920;
const H = 1080;
const PAGE = "#f4f2ee";

const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const p = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const out3 = (x: number) => 1 - Math.pow(1 - x, 3);
const inOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const pop = (s: number) => (s <= 0 ? 0 : 1 - Math.exp(-7 * s) * Math.cos(10 * s));
const within = (t: number, a: number, b: number) => t >= a && t < b;

/** Puts page coordinate (fx, fy) at the center of the frame, at zoom z. */
function Cam({ fx, fy, z, children, w, h }: { fx: number; fy: number; z: number; children: ReactNode; w: number; h: number }) {
  return (
    <div className="absolute left-0 top-0" style={{ width: w, height: h, transformOrigin: "0 0", transform: `translate(${W / 2 - fx * z}px, ${H / 2 - fy * z}px) scale(${z})` }}>
      {children}
    </div>
  );
}

function Cursor({ x, y, press }: { x: number; y: number; press: number }) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" className="absolute" style={{ left: x, top: y, transform: `scale(${1 - press * 0.14})`, transformOrigin: "4px 3px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,.25))" }}>
      <path d="M4 3 L4 19 L8.4 14.8 L11.2 21 L14 19.8 L11.2 13.8 L17.4 13.6 Z" fill="#1d1d1f" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- A · the logo ---------------- */
function Brand({ t, t0 }: { t: number; t0: number }) {
  const a = out3(p(t, t0, t0 + 0.9));
  const slide = inOut(p(t, t0 + 1.0, t0 + 1.8));
  const wa = out3(p(t, t0 + 1.25, t0 + 2.1));
  const dot = pop(t - (t0 + 0.55));
  const size = 150;
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center" style={{ transform: `translateX(${lerp(252, 0, slide)}px)` }}>
        <div style={{ opacity: a, transform: `scale(${lerp(0.9, 1, a)})` }}>
          <div className="relative grid place-items-center font-extrabold text-white" style={{ width: size, height: size, borderRadius: size * 0.26, background: "#1f5bff", fontSize: size * 0.62, lineHeight: 1 }}>
            <span style={{ transform: `translate(-${size * 0.08}px, -${size * 0.06}px)` }}>p</span>
            <span className="absolute rounded-full bg-sun" style={{ width: size * 0.17, height: size * 0.17, right: size * 0.13, bottom: size * 0.24, transform: `scale(${dot})` }} />
          </div>
        </div>
        <span className="ml-9 font-extrabold tracking-[-0.035em] text-ink" style={{ fontSize: 124, opacity: wa, transform: `translateX(${(1 - wa) * -24}px)`, clipPath: `inset(0 ${(1 - wa) * 100}% 0 0)` }}>
          Prep.io
        </span>
      </div>
    </div>
  );
}

/* ---------------- B · the home page, then a click on the featured session ---------------- */
const BAR = 46;
function Browser({ children, w, h }: { children: ReactNode; w: number; h: number }) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white" style={{ width: w, height: h + BAR, boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 40px 90px -30px rgba(40,30,10,.3)" }}>
      <div className="flex items-center gap-2 border-b border-[#ebe8e2] px-5" style={{ height: BAR }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
        <span className="mx-auto rounded-md bg-[#f1efeb] px-24 py-1 text-[14px] text-ink-2">prep.io</span>
      </div>
      {children}
    </div>
  );
}

function HomeShot({ t }: { t: number }) {
  const enter = out3(p(t, 3.2, 4.4));
  const push = inOut(p(t, 4.2, 8.6));
  const dive = inOut(p(t, 8.75, 9.7));
  let z = lerp(0.8, 0.9, push);
  let fx = lerp(720, 700, push);
  let fy = lerp(BAR + 450, BAR + 400, push);
  // into the featured player (x 391–979, y 135–466 on the page)
  // end framing matches the live scene's player exactly, so the dissolve is seamless
  z = lerp(z, 2.47, dive);
  fx = lerp(fx, 685, dive);
  fy = lerp(fy, BAR + 327, dive);
  const cur = inOut(p(t, 6.4, 8.0));
  const cx = lerp(1500, 918, cur);
  const cy = lerp(1060, BAR + 486, cur);
  const press = within(t, 8.2, 8.45) ? 1 : 0;
  return (
    <div className="absolute inset-0" style={{ opacity: enter * (1 - p(t, 9.35, 9.75)) }}>
      <Cam fx={fx} fy={fy} z={z} w={1440} h={900 + BAR}>
        <div style={{ transform: `translateY(${(1 - enter) * 60}px)` }}>
          <Browser w={1440} h={900}>
            <div className="relative" style={{ width: 1440, height: 900 }}>
              <img src={homeShot} width={1440} height={900} alt="" className="block" />
              {press > 0 && (
                <div className="absolute grid place-items-center rounded-full bg-[#1748d1] text-[15px] font-semibold text-white" style={{ left: 894, top: 482, width: 69, height: 32 }}>Watch</div>
              )}
            </div>
          </Browser>
          {t > 6.3 && <Cursor x={cx} y={cy} press={press} />}
        </div>
      </Cam>
    </div>
  );
}

/* ---------------- C + D · the live session, then asking a question ---------------- */
const LINES = [
  { at: 10.1, end: 12.9, text: "So the first pass on a new-grad resume takes about ninety seconds." },
  { at: 13.0, end: 15.7, text: "I'm looking for one thing you built that someone used." },
  { at: 22.6, end: 24.5, text: "Do side projects count as much as internships?", asker: true },
  { at: 24.6, end: 27, text: "They can. What matters is that people used it, and that you can explain it." },
];
const QUESTION = "Do side projects count as much as internships?";

function FilmPlayer({ t, w }: { t: number; w: number }) {
  const h = (w * 9) / 16;
  const line = LINES.find((l) => within(t, l.at, l.end + 0.1));
  const speaking = !!line && !line.asker;
  const bob = speaking ? Math.sin(t * 5.2) * 0.35 + Math.sin(t * 2.1) * 0.2 : 0;
  const la = line ? out3(p(t, line.at, line.at + 0.35)) * (1 - p(t, line.end - 0.2, line.end + 0.1)) : 0;
  const viewers = Math.round(1180 + Math.sin(t * 0.7) * 9 + t * 1.2);
  return (
    <div className="relative overflow-hidden" style={{ width: w, height: h }}>
      <Room look={LOOKS.priya} bob={bob} sway={Math.sin(t * 0.8) * 2} />
      <div className="absolute left-[2.2%] top-[3.5%] flex items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-[8px] bg-live px-3 py-1.5 text-[17px] font-bold text-white"><span className="live-dot" style={{ width: 8, height: 8 }} />LIVE</span>
        <span className="inline-flex items-center gap-2 rounded-[8px] bg-black/55 px-3 py-1.5 text-[17px] font-semibold text-white"><Eye size={19} /> {viewers.toLocaleString()}</span>
      </div>
      {line && (
        <div className="absolute inset-x-0 flex justify-center" style={{ bottom: h * 0.14, opacity: la, transform: `translateY(${(1 - la) * 8}px)` }}>
          <div className="max-w-[78%] rounded-xl bg-black/70 px-6 py-3 text-center text-[30px] leading-snug text-white">
            {line.asker && <span className="block pb-1 text-[22px] font-semibold text-[#ffd479]">Your question</span>}
            {line.text}
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-6 bg-gradient-to-t from-black/45 to-transparent px-7 pb-5 pt-14 text-white">
        <Pause size={26} /> <Volume size={26} /> <span className="text-[18px] font-semibold">Live</span>
        <span className="ml-auto flex gap-6"><Captions size={26} /> <Expand size={24} /></span>
      </div>
    </div>
  );
}

type Row = { id: string; text: string; who: string; votes: number };

function QARow({ r, y, me, state }: { r: Row; y: number; me?: boolean; state?: "answering" | "answered" }) {
  return (
    <div className="absolute inset-x-3 flex gap-4 rounded-xl px-3 py-4" style={{ top: y, background: state === "answering" ? "#e9efff" : "transparent" }}>
      <span className={`flex h-[62px] w-[56px] shrink-0 flex-col items-center justify-center rounded-xl border text-[17px] font-semibold ${me ? "border-brand bg-brand text-white" : "border-line text-ink-2"}`}>
        <Up size={19} />
        {r.votes}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[19px] leading-snug text-ink">{r.text}</p>
        <p className="mt-1 flex items-center gap-2.5 text-[16px] text-ink-3">
          {me ? "You" : r.who}
          {state === "answering" && <span className="font-semibold text-brand">Being answered now</span>}
          {state === "answered" && <span className="inline-flex items-center gap-1 font-semibold text-ok"><Check size={18} /> Answered</span>}
        </p>
      </div>
    </div>
  );
}

function QAPanel({ t }: { t: number }) {
  const typed = QUESTION.slice(0, Math.floor(p(t, 17.6, 19.4) * QUESTION.length));
  const posted = t >= 19.95;
  const press = within(t, 19.7, 19.9);
  const mineVotes = Math.round(lerp(1, 14, inOut(p(t, 20.4, 21.9))));
  const rows: Row[] = [
    { id: "a", text: "Do you read cover letters for new grad?", who: "Omar", votes: 9 },
    { id: "b", text: "Is it bad to have only one internship?", who: "Chris", votes: 7 },
  ];
  const rowH = 100;
  const swap = inOut(p(t, 21.2, 21.8));
  const appear = out3(p(t, 19.95, 20.4));
  const state = t >= 26.8 ? "answered" : t >= 22.4 ? "answering" : undefined;
  const focus = t > 17.4 && !posted;
  return (
    <div className="card overflow-hidden" style={{ width: 520, height: 862 }}>
      <div className="flex border-b border-line px-3 text-[19px] font-semibold">
        <span className="px-4 py-4 text-ink-2">Chat</span>
        <span className="relative px-4 py-4 text-brand">
          Q&A <span className="text-ink-3">{posted ? 3 : 2}</span>
          <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-brand" />
        </span>
      </div>
      <div className="border-b border-line p-5">
        <div className="field !min-h-[84px] !text-[19px]" style={{ borderColor: focus ? "#1f5bff" : undefined, boxShadow: focus ? "0 0 0 3px #e9efff" : undefined }}>
          {!posted && typed ? typed : <span className="text-ink-3">Ask the host a question</span>}
          {focus && <span className="ml-0.5 inline-block h-[22px] w-[2px] translate-y-[4px] bg-ink" style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }} />}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[16px] text-ink-3">The host answers the most upvoted questions.</span>
          <span className="rounded-full px-6 py-2.5 text-[17px] font-semibold text-white" style={{ background: press ? "#1748d1" : "#1f5bff", opacity: typed.length > 3 && !posted ? 1 : 0.4, transform: `scale(${press ? 0.95 : 1})` }}>Ask</span>
        </div>
      </div>
      <div className="relative" style={{ height: 500 }}>
        {rows.map((r, i) => <QARow key={r.id} r={r} y={8 + (i + (posted ? swap : 0)) * rowH} />)}
        {posted && (
          <div style={{ opacity: appear }}>
            <QARow r={{ id: "me", text: QUESTION, who: "You", votes: mineVotes }} me y={8 + lerp(2, 0, swap) * rowH + (1 - appear) * 20} state={state} />
          </div>
        )}
      </div>
    </div>
  );
}

function SessionScene({ t }: { t: number }) {
  // page coords: player card at x 0–1320, Q&A card at x 1344–1864, both 862 tall
  const enter = out3(p(t, 9.35, 10.1));
  const toQA = inOut(p(t, 16.0, 17.3));
  const back = inOut(p(t, 22.2, 23.4));
  let fx = 660;
  let z = lerp(1.1, 1.14, p(t, 9.4, 16));
  fx = lerp(fx, 1604, toQA);
  z = lerp(z, 1.18, toQA);
  fx = lerp(fx, 932, back);
  z = lerp(z, 0.98, back);
  const dimPlayer = toQA * (1 - back) * 0.55;
  const qaIn = out3(p(t, 16.0, 16.8));
  return (
    <div className="absolute inset-0" style={{ opacity: enter * (1 - p(t, 27.4, 27.9)) }}>
      <Cam fx={fx} fy={431} z={z} w={1864} h={862}>
        <div className="card absolute overflow-hidden" style={{ left: 0, top: 0, width: 1320, height: 862 }}>
          <FilmPlayer t={t} w={1320} />
          <div className="flex items-center gap-4 px-7 py-5">
            <Avatar who="priya" size={62} />
            <div>
              <p className="text-[26px] font-bold text-ink">What we actually screen for in a new-grad resume</p>
              <p className="flex items-center gap-2 text-[19px] text-ink-2">
                <span className="font-semibold text-ink">Priya Raman</span> <VerifiedBadge size={19} /> <span className="text-ink-3">University Recruiting Lead at Stripe</span>
              </p>
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: PAGE, opacity: dimPlayer }} />
        </div>
        <div className="absolute" style={{ left: 1344, top: 0, opacity: qaIn, transform: `translateX(${(1 - qaIn) * 40}px)` }}>
          <QAPanel t={t} />
        </div>
      </Cam>
    </div>
  );
}

/* ---------------- E · companies, a slightly quicker beat ---------------- */
function CompaniesScene({ t }: { t: number }) {
  const enter = out3(p(t, 27.6, 28.2));
  const list = [...COMPANIES].sort((a, b) => a.name.localeCompare(b.name));
  const followAt = 29.9;
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ opacity: enter * (1 - p(t, 30.4, 30.8)) }}>
      <div className="grid grid-cols-4 gap-6" style={{ transform: `scale(${lerp(1, 1.035, p(t, 27.6, 30.8))})` }}>
        {list.map((c, i) => {
          const a = pop(t - (27.8 + i * 0.13));
          const on = c.id === "janestreet" && t >= followAt;
          return (
            <div key={c.id} className="card w-[330px] overflow-hidden" style={{ opacity: cl(a * 1.6), transform: `translateY(${(1 - a) * 30}px)` }}>
              <div className="h-[70px]" style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${c.tone} 28%, white), color-mix(in srgb, ${c.tone} 10%, white))` }} />
              <div className="-mt-9 px-6 pb-6">
                <div className="inline-block rounded-[16px] border-[3px] border-white"><CompanyLogo c={c} size={72} /></div>
                <p className="mt-3 text-[24px] font-bold text-ink">{c.name}</p>
                <p className="text-[16px] text-ink-3">{c.roles.length} open roles</p>
                <span className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[17px] font-semibold ${on ? "border border-line text-ink-2" : "bg-brand text-white"}`} style={{ transform: `scale(${within(t, followAt - 0.15, followAt) ? 0.94 : 1})` }}>
                  {on ? <Check size={18} /> : <Plus size={18} />} {on ? "Following" : "Follow"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */

export function Film({ t }: { t: number }) {
  return (
    <div className="relative overflow-hidden" style={{ width: W, height: H, background: PAGE }}>
      {t < 3.6 && (
        <div className="absolute inset-0" style={{ opacity: 1 - p(t, 2.9, 3.5), transform: `scale(${lerp(1, 0.97, p(t, 2.9, 3.5))})` }}>
          <Brand t={t} t0={0.2} />
        </div>
      )}
      {within(t, 3.2, 9.8) && <HomeShot t={t} />}
      {within(t, 9.35, 28) && <SessionScene t={t} />}
      {within(t, 27.6, 30.9) && <CompaniesScene t={t} />}
      {t >= 30.5 && (
        <div className="absolute inset-0">
          <Brand t={t} t0={30.5} />
          <div className="absolute inset-0" style={{ background: PAGE, opacity: p(t, DURATION - 0.4, DURATION) }} />
        </div>
      )}
    </div>
  );
}

function Player() {
  const qs = new URLSearchParams(location.search);
  const render = qs.has("render");
  const [t, setT] = useState(Number(qs.get("t") ?? 0));
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (render) {
      (window as unknown as { __seek: (x: number) => void }).__seek = (x) => flushSync(() => setT(x));
      (window as unknown as { __ready: boolean }).__ready = true;
      return;
    }
    const fit = () => setScale(Math.min(innerWidth / W, innerHeight / H));
    fit();
    addEventListener("resize", fit);
    let raf = 0;
    let start = performance.now() - Number(qs.get("t") ?? 0) * 1000;
    const tick = (now: number) => {
      let x = (now - start) / 1000;
      if (x > DURATION + 1) (start = now), (x = 0);
      setT(x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => (cancelAnimationFrame(raf), removeEventListener("resize", fit));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (render) return <Film t={t} />;
  return (
    <div className="grid h-screen w-screen place-items-center overflow-hidden" style={{ background: PAGE }}>
      <div style={{ width: W * scale, height: H * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          <Film t={Math.min(t, DURATION)} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("film")!).render(<Player />);

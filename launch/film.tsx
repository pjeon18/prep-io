import { useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";
import "@fontsource-variable/figtree";
import "../src/styles/tokens.css";
import { Room, Avatar, CompanyLogo, LOOKS } from "../src/components/people";
import { Check, Eye, Plus, Up, VerifiedBadge } from "../src/components/icons";
import { COMPANIES } from "../src/data/seed";
import homeShot from "./shots/home-v6.png";

/* ------------------------------------------------------------------ */
/* Prep.io launch film, V6 (CONCEPT D21). 1920×1080, 32s.              */
/* One thing in focus per shot. Slow where it should be slow, a little */
/* quicker only for the company grid. No overlaid slogans or pop-ups:  */
/* the product carries it, and it ends on the logo.                    */
/* Every frame is a pure function of t, so render.mjs can seek it.     */
/* ------------------------------------------------------------------ */

export const DURATION = 32;
const W = 1920;
const H = 1080;
const PAGE = "#fbfaf6";
const FOREST = "#0f5c3b";
const MINT = "#9fd8b5";
const SOFT = "#e6f1ea";

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
      <path d="M4 3 L4 19 L8.4 14.8 L11.2 21 L14 19.8 L11.2 13.8 L17.4 13.6 Z" fill="#0e1c15" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
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
      <div className="flex items-center" style={{ transform: `translateX(${lerp(246, 0, slide)}px)` }}>
        <div style={{ opacity: a, transform: `scale(${lerp(0.9, 1, a)})` }}>
          <div className="relative grid place-items-center font-extrabold text-white" style={{ width: size, height: size, borderRadius: size * 0.3, background: FOREST, fontSize: size * 0.62, lineHeight: 1 }}>
            <span style={{ transform: `translate(-${size * 0.07}px, -${size * 0.06}px)` }}>p</span>
            <span className="absolute rounded-full" style={{ background: MINT, width: size * 0.17, height: size * 0.17, right: size * 0.14, bottom: size * 0.24, transform: `scale(${dot})` }} />
          </div>
        </div>
        <span className="ml-9 font-bold tracking-[-0.035em] text-ink" style={{ fontSize: 120, opacity: wa, transform: `translateX(${(1 - wa) * -24}px)`, clipPath: `inset(0 ${(1 - wa) * 100}% 0 0)` }}>
          Prep.io
        </span>
      </div>
    </div>
  );
}

/* ---------------- B · the home page, then Join the room ---------------- */
const BAR = 46;
function Browser({ children, w, h }: { children: ReactNode; w: number; h: number }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white" style={{ width: w, height: h + BAR, boxShadow: "0 1px 2px rgba(14,28,21,.05), 0 40px 90px -30px rgba(14,28,21,.3)" }}>
      <div className="flex items-center gap-2 border-b border-line px-5" style={{ height: BAR }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
        <span className="mx-auto rounded-md bg-[#f1efe9] px-24 py-1 text-[14px] text-ink-2">prep.io</span>
      </div>
      {children}
    </div>
  );
}

// on the 1440×900 home page: the featured stage spans x 120–766, y 134–497,
// and "Join the room" sits at x 830–1000, y 459–515
function HomeShot({ t }: { t: number }) {
  const enter = out3(p(t, 3.2, 4.4));
  const push = inOut(p(t, 4.2, 8.6));
  const dive = inOut(p(t, 8.7, 9.8));
  let z = lerp(0.82, 0.92, push);
  let fx = lerp(720, 700, push);
  let fy = lerp(BAR + 450, BAR + 400, push);
  z = lerp(z, 2.6, dive);
  fx = lerp(fx, 443, dive);
  fy = lerp(fy, BAR + 316, dive);
  const cur = inOut(p(t, 6.3, 7.9));
  const cx = lerp(1500, 905, cur);
  const cy = lerp(1060, BAR + 480, cur);
  const press = within(t, 8.1, 8.4) ? 1 : 0;
  return (
    <div className="absolute inset-0" style={{ opacity: enter * (1 - p(t, 9.4, 9.85)) }}>
      <Cam fx={fx} fy={fy} z={z} w={1440} h={900 + BAR}>
        <div style={{ transform: `translateY(${(1 - enter) * 60}px)` }}>
          <Browser w={1440} h={900}>
            <div className="relative" style={{ width: 1440, height: 900 }}>
              <img src={homeShot} width={1440} height={900} alt="" className="block" />
              {press > 0 && <div className="absolute rounded-full bg-black/15" style={{ left: 830, top: 459, width: 170, height: 56 }} />}
            </div>
          </Browser>
          {t > 6.2 && <Cursor x={cx} y={cy} press={press} />}
        </div>
      </Cam>
    </div>
  );
}

/* ---------------- C + D · the room, then asking a question ---------------- */
const LINES = [
  { at: 10.1, end: 12.9, text: "Here's the honest timeline. Most of our summer class is set by February." },
  { at: 13.0, end: 15.7, text: "The application is the easy part. The video interview is where people lose points." },
  { at: 22.6, end: 24.5, text: "How early should I start networking for 2027?", asker: true },
  { at: 24.6, end: 27, text: "This fall. A few real conversations beat fifty cold emails." },
];
const QUESTION = "How early should I start networking for 2027?";

function FilmStage({ t, w }: { t: number; w: number }) {
  const h = (w * 9) / 16;
  const line = LINES.find((l) => within(t, l.at, l.end + 0.1));
  const speaking = !!line && !line.asker;
  const bob = speaking ? Math.sin(t * 5.2) * 0.35 + Math.sin(t * 2.1) * 0.2 : 0;
  const la = line ? out3(p(t, line.at, line.at + 0.45)) * (1 - p(t, line.end - 0.2, line.end + 0.1)) : 0;
  const viewers = Math.round(1180 + Math.sin(t * 0.7) * 9 + t * 1.2);
  return (
    <div className="relative overflow-hidden rounded-[32px]" style={{ width: w, height: h, boxShadow: "0 30px 60px -30px rgba(14,28,21,.35)" }}>
      <Room look={LOOKS.rebecca} bob={bob} sway={Math.sin(t * 0.8) * 2} />
      <div className="absolute left-[3%] top-[5%] flex items-center gap-2.5">
        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-live px-4 text-[18px] font-bold text-white"><span className="live-dot" style={{ width: 8, height: 8 }} />LIVE</span>
        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-ink/55 px-4 text-[18px] font-semibold text-white"><Eye size={20} /> {viewers.toLocaleString()}</span>
      </div>
      {line && (
        <div className="absolute inset-x-0 flex justify-center" style={{ bottom: h * 0.09, opacity: la, transform: `translateY(${(1 - la) * 10}px)`, filter: `blur(${(1 - la) * 5}px)` }}>
          <div className="max-w-[84%] rounded-[22px] bg-ink/80 px-8 py-4 text-center text-[32px] font-medium leading-snug text-white">
            {line.asker && <span className="block pb-1 text-[22px] font-semibold" style={{ color: MINT }}>Your question</span>}
            {line.text}
          </div>
        </div>
      )}
    </div>
  );
}

type Row = { id: string; text: string; who: string; votes: number };

function Vote({ n, on }: { n: number; on?: boolean }) {
  return (
    <span className="flex h-[70px] w-[62px] shrink-0 flex-col items-center justify-center rounded-[18px] text-[19px] font-bold" style={{ background: on ? FOREST : "rgba(14,28,21,.05)", color: on ? "#fff" : "#0e1c15" }}>
      <Up size={20} />
      {n}
    </span>
  );
}

function Rail({ t }: { t: number }) {
  const typed = QUESTION.slice(0, Math.floor(p(t, 17.6, 19.4) * QUESTION.length));
  const posted = t >= 19.95;
  const press = within(t, 19.7, 19.9);
  const mineVotes = Math.round(lerp(1, 14, inOut(p(t, 20.4, 21.9))));
  const rows: Row[] = [
    { id: "a", text: "What does the video interview look for?", who: "Omar", votes: 9 },
    { id: "b", text: "Is a superday all on one day?", who: "Chris", votes: 7 },
  ];
  const rowH = 112;
  const swap = inOut(p(t, 21.2, 21.8));
  const appear = out3(p(t, 19.95, 20.4));
  const pin = inOut(p(t, 22.3, 22.9));
  const done = t >= 26.8;
  const focus = t > 17.4 && !posted;
  const open = posted ? 3 - (done ? 1 : 0) : 2;
  // rows sit below the pinned card once it opens
  const top = lerp(0, 196, pin * (done ? 1 - p(t, 26.8, 27.3) : 1));
  return (
    <div className="relative" style={{ width: 500, height: 960 }}>
      <div className="inline-flex rounded-full p-1.5" style={{ background: "rgba(14,28,21,.06)" }}>
        <span className="rounded-full bg-white px-6 py-2.5 text-[19px] font-semibold text-ink shadow-lift">Questions <span className="text-ink-3">{open}</span></span>
        <span className="px-6 py-2.5 text-[19px] font-semibold text-ink-2">Chat</span>
      </div>

      {/* the question being answered, pinned */}
      {posted && pin > 0 && !done && (
        <div className="absolute inset-x-0 rounded-[26px] p-6" style={{ top: 86, background: SOFT, opacity: pin, transform: `translateY(${(1 - pin) * -12}px)` }}>
          <p className="flex items-center gap-3 text-[18px] font-semibold" style={{ color: FOREST }}>
            <span className="inline-flex h-4 items-end gap-[3px]">{[0, 1, 2, 3].map((i) => <span key={i} className="w-[3px] rounded-full" style={{ background: FOREST, height: `${40 + 60 * Math.abs(Math.sin(t * 5 + i))}%` }} />)}</span>
            Rebecca is answering
          </p>
          <p className="mt-3 text-[24px] font-semibold leading-snug text-ink">{QUESTION}</p>
          <p className="mt-2 text-[17px] text-ink-2">Asked by you</p>
        </div>
      )}

      <div className="absolute inset-x-0" style={{ top: 96 + top }}>
        {rows.map((r, i) => (
          <div key={r.id} className="absolute inset-x-0 flex gap-5" style={{ top: (i + (posted ? swap * (1 - pin) : 0)) * rowH }}>
            <Vote n={r.votes} />
            <div className="pt-1"><p className="text-[21px] leading-snug text-ink">{r.text}</p><p className="mt-1.5 text-[17px] text-ink-3">{r.who}</p></div>
          </div>
        ))}
        {posted && pin < 1 && (
          <div className="absolute -inset-x-3 z-10 flex gap-5 rounded-[22px] px-3 py-2" style={{ top: lerp(2, 0, swap) * rowH + (1 - appear) * 22 - 8, opacity: appear * (1 - pin), background: PAGE, boxShadow: `0 14px 34px -14px rgba(14,28,21,${0.35 * Math.sin(Math.PI * swap)})` }}>
            <Vote n={mineVotes} on />
            <div className="pt-1"><p className="text-[21px] leading-snug text-ink">{QUESTION}</p><p className="mt-1.5 text-[17px] text-ink-3">Your question</p></div>
          </div>
        )}
      </div>

      {done && (
        <div className="absolute inset-x-0 border-t border-line pt-5" style={{ top: 360, opacity: out3(p(t, 26.9, 27.3)) }}>
          <p className="text-[18px] font-semibold text-ink-2">Answered</p>
          <p className="mt-3 flex gap-3 text-[19px] leading-snug text-ink-2"><span style={{ color: FOREST }}><Check size={22} /></span>{QUESTION}</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 border-t border-line pt-5">
        <div className="flex items-end gap-3">
          <div className="field !min-h-[96px] !text-[20px]" style={{ borderColor: focus ? FOREST : undefined, boxShadow: focus ? `0 0 0 4px ${SOFT}` : undefined }}>
            {!posted && typed ? typed : <span className="text-ink-3">Ask Rebecca a question</span>}
            {focus && <span className="ml-0.5 inline-block h-[24px] w-[2px] translate-y-[4px] bg-ink" style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }} />}
          </div>
          <span className="grid h-14 shrink-0 place-items-center rounded-full px-7 text-[19px] font-semibold text-white" style={{ background: FOREST, opacity: typed.length > 3 && !posted ? 1 : 0.4, transform: `scale(${press ? 0.95 : 1})` }}>Ask</span>
        </div>
        <p className="mt-3 text-[17px] text-ink-3">The most upvoted questions get answered first.</p>
      </div>
    </div>
  );
}

function SessionScene({ t }: { t: number }) {
  // page coords: stage at x 0–1300, the rail at x 1364–1864, 960 tall
  const enter = out3(p(t, 9.4, 10.2));
  const toQA = inOut(p(t, 16.0, 17.3));
  const back = inOut(p(t, 22.2, 23.4));
  let fx = 650;
  let z = lerp(1.12, 1.18, p(t, 9.4, 16));
  let fy = 380;
  fx = lerp(fx, 1614, toQA);
  z = lerp(z, 1.0, toQA);
  fy = lerp(fy, 520, toQA);
  fx = lerp(fx, 932, back);
  z = lerp(z, 0.9, back);
  fy = lerp(fy, 480, back);
  const dim = toQA * (1 - back) * 0.6;
  const railIn = out3(p(t, 16.0, 16.8));
  return (
    <div className="absolute inset-0" style={{ opacity: enter * (1 - p(t, 27.4, 27.9)), transform: `scale(${lerp(1.04, 1, enter)})` }}>
      <Cam fx={fx} fy={fy} z={z} w={1864} h={960}>
        <div className="absolute" style={{ left: 0, top: 0, width: 1300 }}>
          <FilmStage t={t} w={1300} />
          <div className="mt-10">
            <p className="text-[20px] font-semibold text-ink-2">Live for 52 minutes</p>
            <p className="mt-3 text-[52px] font-[650] leading-[1.05] tracking-[-0.03em] text-ink">Summer analyst 2027: timeline and what to expect</p>
            <div className="mt-7 flex items-center gap-5">
              <Avatar who="rebecca" size={68} />
              <p className="text-[23px] text-ink-2"><span className="inline-flex items-center gap-2 font-semibold text-ink">Rebecca Stein <VerifiedBadge size={22} /></span><br />Campus Recruiting Lead at Goldman Sachs</p>
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: PAGE, opacity: dim }} />
        </div>
        <div className="absolute" style={{ left: 1364, top: 0, opacity: railIn, transform: `translateX(${(1 - railIn) * 40}px)` }}>
          <Rail t={t} />
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
          const flip = out3(p(t, followAt, followAt + 0.3));
          return (
            <div key={c.id} className="w-[340px] rounded-[30px] border-[1.5px] border-line bg-white p-8" style={{ opacity: cl(a * 1.6), transform: `translateY(${(1 - a) * 30}px)` }}>
              <CompanyLogo c={c} size={72} />
              <p className="mt-7 text-[30px] font-[650] tracking-[-0.025em] text-ink">{c.name}</p>
              <p className="mt-1 text-[18px] text-ink-2">{c.roles.length} open roles</p>
              <span
                className="mt-7 inline-flex h-12 items-center gap-2 overflow-hidden rounded-full px-6 text-[18px] font-semibold"
                style={on ? { border: "1.5px solid var(--line)", color: "#0e1c15" } : { background: FOREST, color: "#fff", transform: `scale(${within(t, followAt - 0.15, followAt) ? 0.94 : 1})` }}
              >
                <span className="inline-flex items-center gap-2" style={{ transform: on ? `translateY(${(1 - flip) * 14}px)` : undefined, opacity: on ? flip : 1 }}>
                  {on ? <Check size={20} /> : <Plus size={20} />} {on ? "Following" : "Follow"}
                </span>
              </span>
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
      {within(t, 3.2, 9.9) && <HomeShot t={t} />}
      {within(t, 9.4, 28) && <SessionScene t={t} />}
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

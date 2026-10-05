import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SESSIONS, findCompany, findHost } from "../data/seed";
import { useStore, type Caption } from "../store/useStore";
import { startStudio, stopStudio } from "../lib/sim";
import { Stage } from "../components/Stage";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Count, Name, Words } from "../components/ui";
import { pageIn } from "../components/Nav";
import { Check, Up } from "../components/icons";
import { timecode, useNow } from "../lib/format";
import { ease, spring } from "../lib/motion";

/* The demo host: a verified Stripe recruiter. */
const ME = findHost("priya");
const CO = findCompany(ME.companyId);

function useMySession(title?: string) {
  return useMemo(() => ({ ...SESSIONS[0], id: "mine", status: "live" as const, title: title || "Your session" }), [title]);
}

/** The title as it will look on the stage. */
function LowerThird({ title }: { title: string }) {
  return (
    <div className="absolute inset-x-[4%] bottom-[7%] flex items-center gap-4 rounded-[20px] bg-white/92 p-4 shadow-lift backdrop-blur-md" style={{ fontSize: "clamp(12px, 2cqw, 18px)" }}>
      <Avatar who={ME.id} size={44} />
      <div className="min-w-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p key={title || "empty"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={`truncate font-semibold ${title ? "text-ink" : "text-ink-3"}`} style={{ fontSize: "1.15em" }}>
            {title || "Your title shows here"}
          </motion.p>
        </AnimatePresence>
        <p className="truncate text-ink-2">{ME.name} at {CO.name}</p>
      </div>
    </div>
  );
}

/* ---------------- 3, 2, 1 ---------------- */

function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) { const t = setTimeout(onDone, 350); return () => clearTimeout(t); }
    const t = setTimeout(() => setN(n - 1), 800);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={n}
          className="text-[min(42vw,360px)] font-[650] leading-none tracking-[-0.06em] text-white tabular-nums"
          initial={{ scale: 0.4, opacity: 0, filter: "blur(12px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 1.6, opacity: 0, filter: "blur(10px)" }}
          transition={spring.ui}
        >
          {n === 0 ? "Live" : n}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- setup ---------------- */

function Setup() {
  const st = useStore((s) => s.studio);
  const patch = useStore((s) => s.studioSetup);
  const goLive = useStore((s) => s.goLive);
  const [counting, setCounting] = useState(false);
  const title = st?.title ?? "";
  const roleIds = st?.roleIds ?? [];
  const kind = st?.kind ?? "hiring";
  const session = useMySession(title);

  return (
    <motion.main {...pageIn} className="wrap pb-40 pt-10 md:pt-14">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="min-w-0">
          <Words text="Go live" className="t-display text-ink" />
          <div className="mt-8 flex items-center gap-4">
            <Avatar who={ME.id} size={52} />
            <p className="t-meta"><Name host={ME} className="text-[18px] font-semibold text-ink" /><br />{ME.title} at {CO.name}</p>
          </div>

          <label className="mt-14 block text-[18px] font-semibold text-ink" htmlFor="title">What will you talk about?</label>
          <textarea
            id="title"
            value={title}
            onChange={(e) => patch({ title: e.target.value.replace(/\n/g, "") })}
            placeholder="How our new-grad interviews work"
            maxLength={80}
            rows={2}
            className="mt-3 w-full resize-none border-b-2 border-line bg-transparent pb-3 focus-visible:outline-none text-[clamp(28px,3vw,40px)] font-[650] leading-tight tracking-[-0.025em] text-ink outline-none transition-colors placeholder:text-ink/20 focus:border-brand"
          />
          <p className="mt-2 text-right text-[15px] tabular-nums text-ink-3">{title.length} of 80</p>

          <p className="mt-12 text-[18px] font-semibold text-ink">You’re talking as</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {([
              ["hiring", "A recruiter", "The process and open roles"],
              ["inside", "Someone in the job", "What the work is really like"],
            ] as const).map(([id, label, note]) => (
              <button key={id} onClick={() => patch({ kind: id })} className="relative rounded-[22px] border-[1.5px] border-line bg-white p-6 text-left transition-colors hover:border-ink/30">
                {kind === id && <motion.span layoutId="kind-ring" className="absolute -inset-[1.5px] rounded-[22px] border-2 border-brand" transition={spring.ui} />}
                <span className="block text-[20px] font-semibold text-ink">{label}</span>
                <span className="t-meta mt-1 block">{note}</span>
              </button>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {kind === "hiring" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }} className="overflow-hidden">
                <p className="mt-12 text-[18px] font-semibold text-ink">Roles to show viewers</p>
                <div className="mt-3 border-t border-line">
                  {CO.roles.map((r) => {
                    const on = roleIds.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => patch({ roleIds: on ? roleIds.filter((x) => x !== r.id) : [...roleIds, r.id] })} className="flex w-full items-center gap-4 border-b border-line py-5 text-left">
                        <motion.span animate={{ backgroundColor: on ? "var(--brand)" : "#ffffff", borderColor: on ? "var(--brand)" : "var(--line)" }} className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] border-2 text-white">
                          <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.snap}><Check size={16} strokeWidth={3} /></motion.span>}</AnimatePresence>
                        </motion.span>
                        <span>
                          <span className="block text-[19px] font-semibold text-ink">{r.title}</span>
                          <span className="t-meta block">{r.location}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex flex-wrap items-center gap-5">
            <Button variant="primary" size="lg" disabled={!title.trim()} onClick={() => setCounting(true)}>Go live</Button>
            <span className="t-meta">You can end it whenever you like.</span>
          </div>
        </div>

        <div className="lg:sticky lg:top-[110px] lg:self-start">
          <p className="mb-4 text-[18px] font-semibold text-ink-2">How viewers will see you</p>
          <div className="overflow-hidden rounded-[28px] shadow-stage">
            <Stage session={session} rounded={false} badges={false} overlay={<LowerThird title={title} />} />
          </div>
        </div>
      </div>
      <AnimatePresence>{counting && <Countdown onDone={() => (setCounting(false), goLive())} />}</AnimatePresence>
    </motion.main>
  );
}

/* ---------------- live console ---------------- */

function Console() {
  const st = useStore((s) => s.studio)!;
  const mark = useStore((s) => s.markAnswered);
  const end = useStore((s) => s.endStudio);
  const session = useMySession(st.title);
  const now = useNow();
  const [answering, setAnswering] = useState<number | null>(null);
  useEffect(() => (startStudio(), stopStudio), []);
  const open = st.questions.filter((q) => !q.answered && q.id !== answering).sort((a, b) => b.votes - a.votes);
  const current = st.questions.find((q) => q.id === answering);
  const done = st.questions.filter((q) => q.answered);
  const caption: Caption | null = current ? { key: current.id, text: current.text, asker: current.who } : null;

  return (
    <motion.main {...pageIn} className="wrap pb-32 pt-6 md:pt-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[28px] shadow-stage"><Stage session={session} caption={caption} viewers={st.viewers} rounded={false} /></div>
          <div className="mt-9 flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[17px] font-semibold text-live">You’re live, {timecode((now - st.startedAt) / 1000)}</p>
              <h1 className="mt-3 text-[clamp(30px,3.2vw,46px)] font-[650] leading-[1.05] tracking-[-0.03em] text-ink">{st.title}</h1>
            </div>
            <Button variant="danger" size="lg" onClick={end}>End session</Button>
          </div>
          <div className="mt-14 grid grid-cols-3 border-t border-line">
            {([["watching now", st.viewers], ["at the most", st.peak], ["answered", done.length]] as const).map(([k, v]) => (
              <div key={k} className="border-r border-line py-8 pr-6 last:border-r-0 [&:not(:first-child)]:pl-8">
                <Count value={v} className="block text-[clamp(40px,4.4vw,64px)] font-[650] leading-none tracking-[-0.04em] text-ink" />
                <p className="mt-3 text-[17px] text-ink-2">{k}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-[96px] lg:h-[calc(100vh-120px)]">
          <div className="flex h-full min-h-[520px] flex-col">
            <h2 className="t-h2 text-ink">Questions</h2>
            <p className="t-meta mt-2">Pick one to answer. It shows on screen while you talk.</p>
            <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
              <AnimatePresence>
                {current && (
                  <motion.div key={current.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={spring.glide} className="mb-4 rounded-[22px] bg-brand-soft p-5">
                    <p className="text-[15.5px] font-semibold text-brand">You’re answering</p>
                    <p className="mt-2 text-[21px] font-semibold leading-snug text-ink">{current.text}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[15.5px] text-ink-2">From {current.who}</span>
                      <Button variant="primary" onClick={() => (mark(current.id), setAnswering(null))}><Check size={18} /> Done</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!open.length && !current && <p className="py-16 text-center text-[18px] text-ink-3">Questions show up here as people join.</p>}
              {open.map((q) => (
                <motion.div layout="position" key={q.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.glide} className="flex gap-4 rounded-2xl px-2 py-3">
                  <span className="flex h-[60px] w-[52px] shrink-0 flex-col items-center justify-center rounded-2xl bg-ink/[0.05] text-[16px] font-bold text-ink"><Up size={18} /><Count value={q.votes} /></span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="text-[17.5px] leading-snug text-ink">{q.text}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[15px] text-ink-3">{q.who}</span>
                      {!current && <Button variant="outline" className="!h-9 !px-4 !text-[15px]" onClick={() => setAnswering(q.id)}>Answer</Button>}
                    </div>
                  </div>
                </motion.div>
              ))}
              {done.map((q) => (
                <p key={q.id} className="flex gap-3 px-2 py-2.5 text-[16px] leading-snug text-ink-3"><Check size={18} className="mt-0.5 shrink-0 text-brand" /> {q.text}</p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </motion.main>
  );
}

/* ---------------- after ---------------- */

function Summary() {
  const st = useStore((s) => s.studio)!;
  const close = useStore((s) => s.closeStudio);
  const navigate = useNavigate();
  const done = st.questions.filter((q) => q.answered);
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 250); return () => clearTimeout(t); }, []);
  const mins = Math.max(1, Math.round((Date.now() - st.startedAt) / 60000));
  return (
    <motion.main {...pageIn} className="wrap pb-40 pt-14 md:pt-24">
      <Words text="Your session has ended" className="t-display max-w-[900px] text-ink" />
      <p className="t-body mt-8 max-w-[640px]">The recording is on {CO.name}’s page, and each question you answered is a chapter people can jump to.</p>
      <div className="mt-16 grid border-t border-line sm:grid-cols-3">
        {([["minutes live", mins], ["people at the most", st.peak], ["questions answered", done.length]] as const).map(([k, v], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ease.out, delay: 0.2 + i * 0.12 }} className="border-line py-10 sm:border-r sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-10">
            <Count value={shown ? v : 0} className="block text-[clamp(56px,6vw,96px)] font-[650] leading-none tracking-[-0.045em] text-ink" />
            <p className="mt-4 text-[18px] text-ink-2">{k}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap gap-4">
        <Button variant="primary" size="lg" onClick={() => (close(), navigate(`/company/${CO.id}`))}><CompanyLogo c={CO} size={26} /> See it on {CO.name}’s page</Button>
        <Button variant="outline" size="lg" onClick={close}>Start another</Button>
      </div>
    </motion.main>
  );
}

export default function GoLive() {
  const phase = useStore((s) => s.studio?.phase ?? "setup");
  return phase === "live" ? <Console /> : phase === "ended" ? <Summary /> : <Setup />;
}

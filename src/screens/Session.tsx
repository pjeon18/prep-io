import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SESSIONS, companyOf, findHost, findSession, rolesFor, type Session } from "../data/seed";
import { useStore, type Caption, type Question } from "../store/useStore";
import { startRoom, stopRoom, readMs } from "../lib/sim";
import { Stage } from "../components/Stage";
import { FollowButton, RemindButton, SessionCard } from "../components/Cards";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Count, Name, Reveal, Segmented, Words } from "../components/ui";
import { pageIn } from "../components/Nav";
import { Bookmark, BookmarkFill, Check, External, Send, Up } from "../components/icons";
import { ago, clock, dayLabel, duration, startsAt, timecode, useNow } from "../lib/format";
import { spring, ease } from "../lib/motion";

export default function SessionPage() {
  const { id = "" } = useParams();
  const s = findSession(id);
  if (!s) return <Navigate to="/" replace />;
  return (
    <motion.main key={s.id} {...pageIn} className="wrap pb-32 pt-6 md:pt-8">
      {s.status === "live" && <Live s={s} />}
      {s.status === "scheduled" && <Upcoming s={s} />}
      {s.status === "recorded" && <Recorded s={s} />}
    </motion.main>
  );
}

/* ---------------- layout ---------------- */

/* Desktop: stage and details on the left, the rail pinned on the right.
   Phones: stage, then the rail (where the conversation is), then details. */
function Layout({ stage, rail, children }: { stage: React.ReactNode; rail: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[auto_1fr]">
      <div className="min-w-0 overflow-hidden rounded-[28px] shadow-stage lg:col-start-1 lg:row-start-1" style={{ viewTransitionName: "stage" }}>{stage}</div>
      <aside className="max-lg:h-[78vh] lg:sticky lg:top-[96px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[calc(100vh-120px)] lg:self-start">{rail}</aside>
      <div className="min-w-0 lg:col-start-1 lg:row-start-2 [&>*:first-child]:mt-0">{children}</div>
    </div>
  );
}

function About({ s, line }: { s: Session; line: string }) {
  const host = findHost(s.hostId);
  const c = companyOf(s);
  return (
    <div className="mt-9">
      <p className="text-[17px] font-semibold text-ink-2">{line}</p>
      <div className="mt-3 text-ink" style={{ fontSize: "clamp(30px, 3.2vw, 46px)" }}>
        <Words text={s.title} className="font-[650] leading-[1.05] tracking-[-0.03em]" />
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <Avatar who={host.id} size={64} />
        <div className="min-w-[180px] flex-1">
          <p className="text-[20px] font-semibold text-ink"><Name host={host} /></p>
          <p className="t-meta">
            {host.title} at <Link to={`/company/${c.id}`} className="font-semibold text-ink hover:text-brand">{c.name}</Link>
          </p>
        </div>
        <FollowButton id={host.id} />
      </div>
      <p className="t-body mt-6 max-w-[720px]">{host.bio}</p>
      {!host.verified && <p className="mt-4 text-[17px] text-[#8a5a00]">{host.name} hasn’t verified their employer yet.</p>}
    </div>
  );
}

function Roles({ s }: { s: Session }) {
  const saved = useStore((x) => x.savedRoles);
  const toggle = useStore((x) => x.toggleSavedRole);
  const [opened, setOpened] = useState<string[]>([]);
  const roles = rolesFor(s);
  const c = companyOf(s);
  if (!roles.length) return null;
  return (
    <Reveal className="mt-16">
      <h2 className="t-h2 text-ink">Roles mentioned</h2>
      <div className="mt-6 border-t border-line">
        {roles.map((r) => {
          const on = saved.includes(r.id);
          return (
            <div key={r.id} className="flex flex-wrap items-center gap-x-5 gap-y-4 border-b border-line py-6">
              <span className="max-sm:hidden"><CompanyLogo c={c} size={52} /></span>
              <div className="min-w-[240px] flex-1">
                <p className="text-[20px] font-semibold text-ink">{r.title}</p>
                <p className="t-meta mt-0.5">{r.location}{r.closes ? `, applications close ${r.closes}` : ""}</p>
              </div>
              <Button variant="quiet" className="!h-12 !w-12 !px-0" aria-label={on ? "Unsave job" : "Save job"} onClick={() => toggle(r.id)}>
                <motion.span key={String(on)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring.snap}>
                  {on ? <BookmarkFill size={22} className="text-brand" /> : <Bookmark size={22} />}
                </motion.span>
              </Button>
              <Button variant={opened.includes(r.id) ? "outline" : "primary"} onClick={() => setOpened([...opened, r.id])}>
                {opened.includes(r.id) ? "Opened" : "Apply"} {!opened.includes(r.id) && <External size={16} />}
              </Button>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

function MoreLive({ s }: { s: Session }) {
  const more = SESSIONS.filter((x) => x.id !== s.id && x.status === "live").slice(0, 3);
  return (
    <Reveal className="mt-24">
      <h2 className="t-h2 text-ink">Other rooms</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">{more.map((x) => <SessionCard key={x.id} s={x} />)}</div>
    </Reveal>
  );
}

/* ---------------- live: questions ---------------- */

function Waves() {
  return (
    <span className="inline-flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-brand" animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }} />
      ))}
    </span>
  );
}

function Vote({ q }: { q: Question }) {
  const upvote = useStore((x) => x.upvote);
  const [bump, setBump] = useState(0);
  return (
    <motion.button
      onClick={() => (upvote(q.id), setBump((b) => b + 1))}
      disabled={q.me || q.answered}
      aria-label={q.voted ? "Remove upvote" : "Upvote"}
      whileTap={{ scale: 0.88 }}
      transition={spring.snap}
      className={`flex h-[60px] w-[52px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-[16px] font-bold transition-colors ${q.voted ? "bg-brand text-white" : "bg-ink/[0.05] text-ink hover:bg-brand-soft hover:text-brand"} disabled:cursor-default`}
    >
      <motion.span key={bump} initial={bump ? { y: 6 } : false} animate={{ y: 0 }} transition={spring.snap}><Up size={18} /></motion.span>
      <Count value={q.votes} />
    </motion.button>
  );
}

function Questions() {
  const qs = useStore((x) => x.room?.questions ?? []);
  const answering = useStore((x) => x.room?.answering ?? null);
  const host = useStore((x) => (x.room ? findHost(findSession(x.room.sessionId)!.hostId) : null));
  const ask = useStore((x) => x.ask);
  const [text, setText] = useState("");
  const now = qs.find((q) => q.id === answering);
  const open = qs.filter((q) => !q.answered && q.id !== answering).sort((a, b) => b.votes - a.votes);
  const done = qs.filter((q) => q.answered);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
        <AnimatePresence initial={false}>
          {now && (
            <motion.div key={now.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={spring.glide} className="mb-4 rounded-[22px] bg-brand-soft p-5">
              <p className="flex items-center gap-3 text-[15.5px] font-semibold text-brand"><Waves /> {host?.name.split(" ")[0]} is answering</p>
              <p className="mt-3 text-[21px] font-semibold leading-snug text-ink">{now.text}</p>
              <p className="mt-2 text-[15.5px] text-ink-2">Asked by {now.me ? "you" : now.who}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          {open.map((q) => (
            <motion.div key={q.id} layout="position" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring.glide} className="flex gap-4 rounded-2xl px-2 py-3">
              <Vote q={q} />
              <div className="min-w-0 pt-1">
                <p className="text-[17.5px] leading-snug text-ink">{q.text}</p>
                <p className="mt-1.5 text-[15px] text-ink-3">{q.me ? "Your question" : q.who}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {done.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="px-2 text-[15.5px] font-semibold text-ink-2">Answered</p>
            {done.map((q) => (
              <motion.p key={q.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 px-2 py-2.5 text-[16px] leading-snug text-ink-2">
                <Check size={18} className="mt-0.5 shrink-0 text-brand" /> {q.text}
              </motion.p>
            ))}
          </div>
        )}
      </div>
      <form
        className="border-t border-line pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          ask(text);
          setText("");
        }}
      >
        <div className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), e.currentTarget.form?.requestSubmit())}
            rows={2}
            maxLength={200}
            placeholder={`Ask ${host?.name.split(" ")[0] ?? "the host"} a question`}
            className="field resize-none"
          />
          <Button variant="primary" className="!h-12 shrink-0" type="submit" disabled={!text.trim()}>Ask</Button>
        </div>
        <p className="mt-3 text-[15px] text-ink-3">The most upvoted questions get answered first.</p>
      </form>
    </div>
  );
}

/* ---------------- live: chat ---------------- */

function Chat() {
  const chat = useStore((x) => x.room?.chat ?? []);
  const send = useStore((x) => x.sendChat);
  const [text, setText] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 200) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.length]);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={box} className="min-h-0 flex-1 overflow-y-auto px-1">
        <div className="flex min-h-full flex-col justify-end gap-4 pb-4">
          {chat.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: ease.out }} className="flex gap-3">
              <Avatar who={m.me ? "alex" : m.who} size={32} />
              <p className="pt-0.5 text-[16.5px] leading-snug">
                <span className="font-semibold text-ink">{m.me ? "You" : m.who}</span> <span className="text-ink-2">{m.text}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <form className="flex gap-3 border-t border-line pt-4" onSubmit={(e) => (e.preventDefault(), send(text), setText(""))}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something" className="field !rounded-full" maxLength={200} />
        <Button variant="primary" className="!h-[52px] !w-[52px] shrink-0 !px-0" aria-label="Send" type="submit" disabled={!text.trim()}><Send size={20} /></Button>
      </form>
    </div>
  );
}

function Live({ s }: { s: Session }) {
  const join = useStore((x) => x.joinRoom);
  const leave = useStore((x) => x.leaveRoom);
  const caption = useStore((x) => x.room?.caption ?? null);
  const viewers = useStore((x) => x.viewers[s.id] ?? 0);
  const qCount = useStore((x) => x.room?.questions.filter((q) => !q.answered).length ?? 0);
  const [tab, setTab] = useState<"qa" | "chat">("qa");
  useEffect(() => {
    join(s.id);
    startRoom(s.id);
    return () => (stopRoom(), leave());
  }, [s.id, join, leave]);
  return (
    <>
      <Layout
        stage={<Stage session={s} caption={caption} viewers={viewers} rounded={false} />}
        rail={
          <div className="flex h-full min-h-[560px] flex-col">
            <Segmented id="room" value={tab} onChange={setTab} className="mb-5 self-start" options={[{ id: "qa", label: <>Questions <span className="ml-1 text-ink-3"><Count value={qCount} /></span></> }, { id: "chat", label: "Chat" }]} />
            <motion.div key={tab} className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, x: tab === "qa" ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: ease.out }}>
              {tab === "qa" ? <Questions /> : <Chat />}
            </motion.div>
          </div>
        }
      >
        <About s={s} line={`Live for ${s.offsetMin} minutes`} />
        <Roles s={s} />
      </Layout>
      <MoreLive s={s} />
    </>
  );
}

/* ---------------- upcoming ---------------- */

function Countdown({ to }: { to: Date }) {
  const now = useNow(1000);
  const left = Math.max(0, Math.floor((to.getTime() - now) / 1000));
  const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), sec = left % 60;
  const parts = h ? [[h, "hours"], [m, "minutes"]] : [[m, "minutes"], [sec, "seconds"]];
  return (
    <div className="flex gap-8">
      {parts.map(([v, label]) => (
        <div key={label as string}>
          <span className="block overflow-hidden text-[84px] font-[650] leading-none tracking-[-0.04em] tabular-nums text-ink">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v as number} className="inline-block" initial={{ y: "-60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={spring.ui}>
                {String(v).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="mt-2 block text-[17px] text-ink-2">{label}</span>
        </div>
      ))}
    </div>
  );
}

function Upcoming({ s }: { s: Session }) {
  const d = startsAt(s);
  return (
    <>
      <Layout
        stage={<Stage session={s} rounded={false} overlay={<div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />} />}
        rail={
          <div className="rounded-[28px] bg-white p-8 shadow-lift">
            <p className="text-[18px] font-semibold text-ink-2">Starts in</p>
            <div className="mt-4"><Countdown to={d} /></div>
            <p className="t-body mt-8">{dayLabel(d)} at {clock(d)}, about {duration(s.durationMin)}.</p>
            <div className="mt-8"><RemindButton id={s.id} size="lg" /></div>
          </div>
        }
      >
        <About s={s} line="Coming up" />
        <Roles s={s} />
      </Layout>
      <MoreLive s={s} />
    </>
  );
}

/* ---------------- recorded: one question at a time ---------------- */

function Recorded({ s }: { s: Session }) {
  const chapters = s.chapters ?? [];
  const [ch, setCh] = useState(0);
  const [line, setLine] = useState(0);
  const [paused, setPaused] = useState(false);
  const [caption, setCaption] = useState<Caption | null>(null);
  const key = useRef(1);
  const chapter = chapters[ch];
  const lines = chapter ? [...(chapter.asker ? [{ text: chapter.q, asker: chapter.asker.split(",")[0] }] : []), ...chapter.a.map((text) => ({ text, asker: undefined as string | undefined }))] : [];

  useEffect(() => {
    if (!chapter || paused) return;
    const l = lines[line];
    if (!l) {
      const t = setTimeout(() => (setCh((c) => (c + 1) % chapters.length), setLine(0)), 800);
      return () => clearTimeout(t);
    }
    setCaption({ key: key.current++, text: l.text, asker: l.asker });
    const t = setTimeout(() => setLine((x) => x + 1), readMs(l.text));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch, line, paused]);

  const dur = s.durationMin * 60;
  const pos = chapter ? chapter.t + line * 12 : 0;
  const within = lines.length ? Math.min(1, line / lines.length) : 0;
  return (
    <>
      <Layout
        stage={<Stage session={s} caption={caption} paused={paused} onToggle={() => setPaused(!paused)} progress={pos / dur} rounded={false} />}
        rail={
          <div className="flex h-full flex-col">
            <h2 className="t-h2 text-ink">Questions in this video</h2>
            <div className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto">
              {chapters.map((c, i) => (
                <button key={i} onClick={() => (setCh(i), setLine(0), setPaused(false))} className="relative flex w-full gap-4 overflow-hidden rounded-2xl px-4 py-4 text-left transition-colors hover:bg-ink/[0.04]">
                  {i === ch && (
                    <>
                      <motion.span layoutId="chapter" className="absolute inset-0 rounded-2xl bg-brand-soft" transition={spring.ui} />
                      <motion.span className="absolute bottom-0 left-0 h-[3px] bg-brand" animate={{ width: `${within * 100}%` }} transition={{ duration: 0.6, ease: ease.out }} />
                    </>
                  )}
                  <span className={`relative w-14 shrink-0 pt-0.5 text-[16px] font-semibold tabular-nums ${i === ch ? "text-brand" : "text-ink-3"}`}>{timecode(c.t)}</span>
                  <span className="relative min-w-0">
                    <span className="block text-[18px] font-medium leading-snug text-ink">{c.asker ? c.q : "Introduction"}</span>
                    {c.asker && <span className="mt-1 block text-[15px] text-ink-3">Asked by {c.asker}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        }
      >
        <About s={s} line={`Recorded ${ago(s.daysAgo!).toLowerCase()}, ${s.views!.toLocaleString()} views`} />
        <Roles s={s} />
      </Layout>
      <MoreLive s={s} />
    </>
  );
}

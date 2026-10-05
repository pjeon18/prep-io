import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SESSIONS, companyOf, findHost, findSession, rolesFor, type Session } from "../data/seed";
import { useStore, type Caption, type Question } from "../store/useStore";
import { startRoom, stopRoom, readMs } from "../lib/sim";
import { Player } from "../components/Player";
import { SessionRow } from "../components/SessionCard";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Card, Name, Tabs } from "../components/kit";
import { Bell, BellFill, Bookmark, BookmarkFill, Check, External, Plus, Send, Up } from "../components/icons";
import { ago, clock, dayLabel, duration, startsAt, timecode, useNow } from "../lib/format";
import { spring } from "../lib/motion";

export default function SessionPage() {
  const { id = "" } = useParams();
  const s = findSession(id);
  if (!s) return <Navigate to="/" replace />;
  return <Page key={s.id} s={s} />;
}

function Page({ s }: { s: Session }) {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {s.status === "live" && <Live s={s} />}
      {s.status === "scheduled" && <Upcoming s={s} />}
      {s.status === "recorded" && <Recorded s={s} />}
    </div>
  );
}

/* ---------------- shared pieces ---------------- */

function About({ s, meta }: { s: Session; meta: string }) {
  const host = findHost(s.hostId);
  const c = companyOf(s);
  const following = useStore((x) => x.following.includes(host.id));
  const follow = useStore((x) => x.toggleFollow);
  return (
    <div className="p-5">
      <p className="text-[13.5px] text-ink-3">{meta}</p>
      <h1 className="mt-1 text-[24px] font-bold leading-tight text-ink">{s.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Avatar who={host.id} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold text-ink"><Name host={host} /></p>
          <p className="text-[14px] text-ink-2">
            {host.title} at <Link to={`/company/${c.id}`} className="font-semibold hover:text-brand hover:underline">{c.name}</Link>
          </p>
          {!host.verified && <p className="mt-1 text-[13px] text-[#9a6700]">This host hasn't verified their employer yet.</p>}
        </div>
        <Button variant={following ? "ghost" : "outline"} size="sm" onClick={() => follow(host.id)}>
          {following ? <Check size={15} /> : <Plus size={15} />} {following ? "Following" : "Follow"}
        </Button>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{host.bio}</p>
    </div>
  );
}

function Roles({ s }: { s: Session }) {
  const saved = useStore((x) => x.savedRoles);
  const toggle = useStore((x) => x.toggleSavedRole);
  const roles = rolesFor(s);
  const c = companyOf(s);
  const [applied, setApplied] = useState<string[]>([]);
  if (!roles.length) return null;
  return (
    <Card>
      <h2 className="text-[17px] font-bold text-ink">Open roles mentioned in this session</h2>
      <div className="mt-2 divide-y divide-line">
        {roles.map((r) => {
          const on = saved.includes(r.id);
          return (
            <div key={r.id} className="flex items-center gap-3 py-3.5">
              <CompanyLogo c={c} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink">{r.title}</p>
                <p className="text-[13.5px] text-ink-2">{c.name}, {r.location}</p>
                {r.closes && <p className="text-[13px] text-ink-3">Applications close {r.closes}</p>}
              </div>
              <Button variant="ghost" size="sm" className="!w-9 !px-0" aria-label="Save job" onClick={() => toggle(r.id)}>
                {on ? <BookmarkFill size={18} className="text-brand" /> : <Bookmark size={18} />}
              </Button>
              <Button variant={applied.includes(r.id) ? "soft" : "primary"} size="sm" onClick={() => setApplied([...applied, r.id])}>
                {applied.includes(r.id) ? "Opened" : "Apply"} {!applied.includes(r.id) && <External size={14} />}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function More({ s }: { s: Session }) {
  const more = SESSIONS.filter((x) => x.id !== s.id && x.status === "live").slice(0, 4);
  return (
    <Card>
      <h2 className="text-[16px] font-bold text-ink">More live sessions</h2>
      <div className="divide-y divide-line">{more.map((x) => <SessionRow key={x.id} s={x} />)}</div>
    </Card>
  );
}

/* ---------------- live ---------------- */

function QRow({ q, answering }: { q: Question; answering: boolean }) {
  const upvote = useStore((x) => x.upvote);
  return (
    <motion.div layout transition={spring.glide} className={`flex gap-3 rounded-lg px-2 py-3 ${answering ? "bg-brand-soft" : ""}`}>
      <Button
        onClick={() => upvote(q.id)}
        disabled={q.me || q.answered}
        aria-label="Upvote"
        className={`flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-lg border text-[13px] font-semibold ${q.voted ? "border-brand bg-brand text-white" : "border-line text-ink-2 hover:border-brand hover:text-brand"} disabled:!opacity-100`}
      >
        <Up size={15} />
        {q.votes}
      </Button>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] leading-snug text-ink">{q.text}</p>
        <p className="mt-1 flex items-center gap-2 text-[13px] text-ink-3">
          {q.me ? "You" : q.who}
          {answering && <span className="font-semibold text-brand">Being answered now</span>}
          {q.answered && <span className="inline-flex items-center gap-1 font-semibold text-ok"><Check size={14} /> Answered</span>}
        </p>
      </div>
    </motion.div>
  );
}

function QA() {
  const qs = useStore((x) => x.room?.questions ?? []);
  const answering = useStore((x) => x.room?.answering ?? null);
  const ask = useStore((x) => x.ask);
  const [text, setText] = useState("");
  const sorted = [...qs].sort((a, b) => Number(!!a.answered) - Number(!!b.answered) || Number(b.id === answering) - Number(a.id === answering) || b.votes - a.votes);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <form
        className="border-b border-line p-4"
        onSubmit={(e) => {
          e.preventDefault();
          ask(text);
          setText("");
        }}
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={200} placeholder="Ask the host a question" className="field resize-none" />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] text-ink-3">The host answers the most upvoted questions.</span>
          <Button variant="primary" size="sm" type="submit" disabled={!text.trim()}>Ask</Button>
        </div>
      </form>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {sorted.map((q) => <QRow key={q.id} q={q} answering={q.id === answering} />)}
      </div>
    </div>
  );
}

function Chat() {
  const chat = useStore((x) => x.room?.chat ?? []);
  const send = useStore((x) => x.sendChat);
  const [text, setText] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 160) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.length]);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={box} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="flex min-h-full flex-col justify-end gap-3">
          {chat.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
              <Avatar who={m.me ? "alex" : m.who} size={28} />
              <p className="text-[14px] leading-snug">
                <span className="font-semibold text-ink">{m.me ? "You" : m.who}</span> <span className="text-ink-2">{m.text}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <form className="flex gap-2 border-t border-line p-3" onSubmit={(e) => (e.preventDefault(), send(text), setText(""))}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="field !rounded-full !py-2" maxLength={200} />
        <Button variant="primary" size="sm" className="!h-10 !w-10 !px-0" aria-label="Send" type="submit"><Send size={16} /></Button>
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
  const [tab, setTab] = useState<"chat" | "qa">("chat");
  useEffect(() => {
    join(s.id);
    startRoom(s.id);
    return () => (stopRoom(), leave());
  }, [s.id, join, leave]);
  return (
    <>
      <main className="min-w-0 space-y-4">
        <Card pad={false} className="overflow-hidden">
          <Player session={s} caption={caption} viewers={viewers} />
          <About s={s} meta={`Live now, started ${s.offsetMin} minutes ago, ${viewers.toLocaleString()} watching`} />
        </Card>
        <Roles s={s} />
      </main>
      <aside className="space-y-4">
        <Card pad={false} className="flex h-[640px] flex-col overflow-hidden lg:sticky lg:top-[84px]">
          <Tabs id="live" value={tab} onChange={setTab} options={[{ id: "chat", label: "Chat" }, { id: "qa", label: "Q&A", count: qCount }]} />
          {tab === "chat" ? <Chat /> : <QA />}
        </Card>
      </aside>
    </>
  );
}

/* ---------------- upcoming ---------------- */

function Upcoming({ s }: { s: Session }) {
  const on = useStore((x) => x.reminders.includes(s.id));
  const toggle = useStore((x) => x.toggleReminder);
  const now = useNow();
  const d = startsAt(s);
  const left = Math.max(0, (d.getTime() - now) / 1000);
  return (
    <>
      <main className="min-w-0 space-y-4">
        <Card pad={false} className="overflow-hidden">
          <Player
            session={s}
            controls={false}
            overlay={
              <div className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-[2px]">
                <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-lift">
                  <p className="text-[14px] font-semibold text-ink-2">{dayLabel(d)} at {clock(d)}</p>
                  <p className="mt-1 text-[32px] font-bold tabular-nums text-ink">
                    {left < 3600 ? `Starts in ${Math.ceil(left / 60)} min` : `Starts in ${Math.floor(left / 3600)}h ${Math.floor((left % 3600) / 60)}m`}
                  </p>
                  <Button variant={on ? "soft" : "primary"} className="mt-4" onClick={() => toggle(s.id)}>
                    {on ? <BellFill size={17} /> : <Bell size={17} />} {on ? "Reminder set" : "Remind me"}
                  </Button>
                </div>
              </div>
            }
          />
          <About s={s} meta={`Upcoming live session, ${duration(s.durationMin)}`} />
        </Card>
        <Roles s={s} />
      </main>
      <aside className="space-y-4">
        <More s={s} />
      </aside>
    </>
  );
}

/* ---------------- recorded: plays one question at a time ---------------- */

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
  return (
    <>
      <main className="min-w-0 space-y-4">
        <Card pad={false} className="overflow-hidden">
          <Player session={s} caption={caption} paused={paused} onToggle={() => setPaused(!paused)} progress={pos / dur} />
          <About s={s} meta={`Recorded ${ago(s.daysAgo!).toLowerCase()}, ${s.views!.toLocaleString()} views, ${duration(s.durationMin)}`} />
        </Card>
        <Roles s={s} />
      </main>
      <aside className="space-y-4">
        <Card pad={false} className="overflow-hidden lg:sticky lg:top-[84px]">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[16px] font-bold text-ink">Questions in this video</h2>
            <p className="text-[13.5px] text-ink-2">Jump to any question.</p>
          </div>
          <div className="p-2">
            {chapters.map((c, i) => (
              <button key={i} onClick={() => (setCh(i), setLine(0), setPaused(false))} className="relative flex w-full gap-3 rounded-lg px-3 py-3 text-left hover:bg-[#f3f2ef]">
                {i === ch && <motion.span layoutId="chapter" className="absolute inset-0 rounded-lg bg-brand-soft" transition={spring.ui} />}
                <span className={`relative w-12 shrink-0 pt-px text-[13px] font-semibold tabular-nums ${i === ch ? "text-brand" : "text-ink-3"}`}>{timecode(c.t)}</span>
                <span className="relative min-w-0">
                  <span className="block text-[14.5px] leading-snug text-ink">{c.asker ? c.q : "Introduction"}</span>
                  {c.asker && <span className="block text-[13px] text-ink-3">Asked by {c.asker}</span>}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </aside>
    </>
  );
}

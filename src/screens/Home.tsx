import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COMPANIES, FIELDS, SESSIONS, companyOf, findHost, type Field } from "../data/seed";
import { useStore } from "../store/useStore";
import { Player } from "../components/Player";
import { SessionCard, SessionRow, hrefFor, useCaptionLoop } from "../components/SessionCard";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Card, Chip, Name } from "../components/kit";
import { Bell, BellFill, Check, Plus } from "../components/icons";
import { clock, dayLabel, startsAt } from "../lib/format";
import { spring } from "../lib/motion";

const LIVE = SESSIONS.filter((s) => s.status === "live");

function ProfileCard() {
  const following = useStore((s) => s.following);
  const reminders = useStore((s) => s.reminders);
  const saved = useStore((s) => s.savedRoles);
  return (
    <Card pad={false} className="overflow-hidden">
      <div className="h-[58px] bg-gradient-to-r from-[#cfdcff] via-[#e3ebff] to-[#fff0cf]" />
      <div className="-mt-9 px-4 pb-4 text-center">
        <div className="inline-block rounded-full border-2 border-white"><Avatar who="alex" size={68} /></div>
        <p className="mt-2 text-[17px] font-bold text-ink">Alex Morgan</p>
        <p className="text-[13.5px] text-ink-2">Economics student, Class of 2027</p>
      </div>
      <div className="border-t border-line py-3 text-[13.5px]">
        {[
          ["Companies you follow", following.length],
          ["Session reminders", reminders.length],
          ["Saved jobs", saved.length],
        ].map(([k, v]) => (
          <div key={k as string} className="flex justify-between px-4 py-1">
            <span className="text-ink-2">{k}</span>
            <span className="font-semibold text-brand">{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Featured() {
  const viewers = useStore((s) => s.viewers);
  const s = LIVE[0];
  const host = findHost(s.hostId);
  const c = companyOf(s);
  const caption = useCaptionLoop(s);
  return (
    <Card pad={false} className="overflow-hidden">
      <Link to={hrefFor(s)} className="block">
        <Player session={s} caption={caption} viewers={viewers[s.id]} />
      </Link>
      <div className="flex items-start gap-3 p-4">
        <Avatar who={host.id} size={48} />
        <div className="min-w-0 flex-1">
          <Link to={hrefFor(s)} className="text-[18px] font-bold leading-snug text-ink hover:text-brand">{s.title}</Link>
          <p className="mt-0.5 text-[14px] font-semibold text-ink"><Name host={host} /></p>
          <p className="text-[13.5px] text-ink-2">{host.title} at {c.name}</p>
        </div>
        <Link to={hrefFor(s)} className="shrink-0">
          <Button variant="primary" size="sm">Watch</Button>
        </Link>
      </div>
    </Card>
  );
}

function ComingUp() {
  const reminders = useStore((s) => s.reminders);
  const toggle = useStore((s) => s.toggleReminder);
  const soon = SESSIONS.filter((s) => s.status === "scheduled").sort((a, b) => a.offsetMin - b.offsetMin).slice(0, 4);
  return (
    <Card>
      <h2 className="text-[16px] font-bold text-ink">Coming up</h2>
      <div className="mt-3 space-y-4">
        {soon.map((s) => {
          const d = startsAt(s);
          const on = reminders.includes(s.id);
          return (
            <div key={s.id} className="flex gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-soft text-center leading-none">
                <span className="text-[11px] font-bold uppercase text-brand">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                <span className="-mt-3 text-[18px] font-bold text-ink">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <Link to={hrefFor(s)} className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink hover:text-brand">{s.title}</Link>
                <p className="mt-0.5 truncate text-[12.5px] text-ink-3">{dayLabel(d)} at {clock(d)}, {companyOf(s).name}</p>
                <Button variant={on ? "soft" : "outline"} size="sm" className="mt-2 !h-7 !px-3 !text-[13px]" onClick={() => toggle(s.id)}>
                  {on ? <BellFill size={14} /> : <Bell size={14} />} {on ? "Reminder set" : "Remind me"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/events" className="mt-4 block border-t border-line pt-3 text-center text-[14px] font-semibold text-ink-2 hover:text-brand">See all events</Link>
    </Card>
  );
}

function Companies() {
  const following = useStore((s) => s.following);
  const toggle = useStore((s) => s.toggleFollow);
  return (
    <Card>
      <h2 className="text-[16px] font-bold text-ink">Companies on Prep.io</h2>
      <div className="mt-3 space-y-3.5">
        {COMPANIES.slice(0, 5).map((c) => {
          const on = following.includes(c.id);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <CompanyLogo c={c} size={40} />
              <Link to={`/company/${c.id}`} className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold text-ink hover:text-brand">{c.name}</span>
                <span className="block text-[12.5px] text-ink-3">{c.roles.length} open roles</span>
              </Link>
              <Button variant={on ? "ghost" : "outline"} size="sm" className="!h-8 !px-3" onClick={() => toggle(c.id)}>
                {on ? <Check size={15} /> : <Plus size={15} />} {on ? "Following" : "Follow"}
              </Button>
            </div>
          );
        })}
      </div>
      <Link to="/companies" className="mt-4 block border-t border-line pt-3 text-center text-[14px] font-semibold text-ink-2 hover:text-brand">See all companies</Link>
    </Card>
  );
}

export default function Home() {
  const [who, setWho] = useState<"all" | "recruiter" | "employee">("all");
  const [field, setField] = useState<Field | null>(null);
  const rest = useMemo(
    () => LIVE.slice(1).filter((s) => (who === "all" || findHost(s.hostId).kind === who) && (!field || s.field === field)),
    [who, field],
  );
  const recorded = SESSIONS.filter((s) => s.status === "recorded");

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 lg:grid-cols-[230px_minmax(0,1fr)_300px]">
      <aside className="hidden space-y-4 lg:block">
        <ProfileCard />
      </aside>

      <main className="min-w-0 space-y-4">
        <div className="flex items-baseline justify-between px-1">
          <h1 className="text-[22px] font-bold text-ink">Live now</h1>
          <span className="text-[14px] text-ink-2">{LIVE.length} sessions</span>
        </div>
        <Featured />

        <Card>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <Chip on={who === "all" && !field} onClick={() => (setWho("all"), setField(null))}>All</Chip>
            <Chip on={who === "recruiter"} onClick={() => setWho(who === "recruiter" ? "all" : "recruiter")}>Recruiters</Chip>
            <Chip on={who === "employee"} onClick={() => setWho(who === "employee" ? "all" : "employee")}>Employees</Chip>
            <span className="mx-1 w-px shrink-0 bg-line" />
            {FIELDS.map((f) => (
              <Chip key={f.id} on={field === f.id} onClick={() => setField(field === f.id ? null : f.id)}>{f.label}</Chip>
            ))}
          </div>
          <motion.div layout className="mt-5 grid gap-x-5 gap-y-7 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {rest.map((s) => (
                <motion.div key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={spring.glide}>
                  <SessionCard s={s} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {rest.length === 0 && <p className="py-10 text-center text-[15px] text-ink-2">No live sessions match these filters right now.</p>}
        </Card>

        <Card>
          <h2 className="text-[18px] font-bold text-ink">Recordings</h2>
          <p className="text-[14px] text-ink-2">Watch past sessions, organized by the questions people asked.</p>
          <div className="mt-2 divide-y divide-line">
            {recorded.map((s) => <SessionRow key={s.id} s={s} />)}
          </div>
        </Card>
      </main>

      <aside className="space-y-4">
        <ComingUp />
        <Companies />
      </aside>
    </div>
  );
}

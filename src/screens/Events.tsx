import { useState } from "react";
import { Link } from "react-router-dom";
import { SESSIONS, companyOf, findHost } from "../data/seed";
import { useStore } from "../store/useStore";
import { Thumb, hrefFor } from "../components/SessionCard";
import { Button, Card, Chip, Name } from "../components/kit";
import { Bell, BellFill } from "../components/icons";
import { clock, dayLabel, duration, startsAt } from "../lib/format";

export default function Events() {
  const [who, setWho] = useState<"all" | "recruiter" | "employee">("all");
  const reminders = useStore((s) => s.reminders);
  const toggle = useStore((s) => s.toggleReminder);
  const list = SESSIONS.filter((s) => s.status === "scheduled" && (who === "all" || findHost(s.hostId).kind === who)).sort((a, b) => a.offsetMin - b.offsetMin);
  const days = list.reduce<Record<string, typeof list>>((acc, s) => ((acc[dayLabel(startsAt(s))] ??= []).push(s), acc), {});

  return (
    <div className="mx-auto max-w-[820px] px-4 py-6">
      <Card>
        <h1 className="text-[22px] font-bold text-ink">Upcoming events</h1>
        <p className="text-[15px] text-ink-2">Live sessions scheduled by recruiters and employees. Set a reminder and we'll let you know when it starts.</p>
        <div className="mt-4 flex gap-2">
          <Chip on={who === "all"} onClick={() => setWho("all")}>All</Chip>
          <Chip on={who === "recruiter"} onClick={() => setWho("recruiter")}>Recruiters</Chip>
          <Chip on={who === "employee"} onClick={() => setWho("employee")}>Employees</Chip>
        </div>
      </Card>

      {Object.entries(days).map(([day, ss]) => (
        <Card key={day} className="mt-4">
          <h2 className="text-[17px] font-bold text-ink">{day}</h2>
          <div className="mt-1 divide-y divide-line">
            {ss.map((s) => {
              const h = findHost(s.hostId);
              const on = reminders.includes(s.id);
              return (
                <div key={s.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                  <Link to={hrefFor(s)} className="sm:w-[200px] sm:shrink-0"><Thumb s={s} /></Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-live">{clock(startsAt(s))}, {duration(s.durationMin)}</p>
                    <Link to={hrefFor(s)} className="mt-0.5 block text-[17px] font-semibold leading-snug text-ink hover:text-brand">{s.title}</Link>
                    <p className="mt-1 text-[14px] text-ink-2"><Name host={h} className="font-semibold text-ink" /> <span className="text-ink-3">{h.title} at {companyOf(s).name}</span></p>
                  </div>
                  <Button variant={on ? "soft" : "outline"} size="sm" onClick={() => toggle(s.id)}>
                    {on ? <BellFill size={15} /> : <Bell size={15} />} {on ? "Reminder set" : "Remind me"}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

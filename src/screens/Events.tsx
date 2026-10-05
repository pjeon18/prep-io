import { motion } from "framer-motion";
import { useState } from "react";
import { SESSIONS, companyOf, findHost } from "../data/seed";
import { RemindButton, Thumb } from "../components/Cards";
import { Reveal, Segmented, Words, useStageNav } from "../components/ui";
import { hrefFor, pageIn } from "../components/Nav";
import { clock, dayLabel, duration, startsAt } from "../lib/format";

export default function Events() {
  const [who, setWho] = useState<"all" | "recruiter" | "employee">("all");
  const go = useStageNav();
  const list = SESSIONS.filter((s) => s.status === "scheduled" && (who === "all" || findHost(s.hostId).kind === who)).sort((a, b) => a.offsetMin - b.offsetMin);
  const days = list.reduce<Record<string, typeof list>>((acc, s) => ((acc[dayLabel(startsAt(s))] ??= []).push(s), acc), {});

  return (
    <motion.main {...pageIn} className="wrap pb-40 pt-10 md:pt-16">
      <Words text="Schedule" className="t-display text-ink" />
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="t-body max-w-[560px]">Set a reminder and you’ll get a notification when the room opens.</p>
        <Segmented id="who" value={who} onChange={setWho} options={[{ id: "all", label: "All" }, { id: "recruiter", label: "Recruiters" }, { id: "employee", label: "In the job" }]} />
      </div>

      {Object.entries(days).map(([day, ss]) => (
        <section key={`${day}-${who}`} className="mt-20">
          <Reveal><h2 className="t-h1 text-ink">{day}</h2></Reveal>
          <div className="mt-8 border-t border-line">
            {ss.map((s, k) => {
              const h = findHost(s.hostId);
              return (
                <Reveal key={s.id} delay={k * 0.05} y={16}>
                  <a
                    href={hrefFor(s)}
                    onClick={(e) => (e.preventDefault(), go(hrefFor(s), e.currentTarget.querySelector<HTMLElement>("[data-pic]")))}
                    className="group grid items-center gap-x-10 gap-y-5 border-b border-line py-8 md:grid-cols-[150px_240px_minmax(0,1fr)_auto]"
                  >
                    <p>
                      <span className="block text-[32px] font-[650] leading-none tracking-[-0.03em] tabular-nums text-ink">{clock(startsAt(s))}</span>
                      <span className="mt-2 block text-[16px] text-ink-2">{duration(s.durationMin)}</span>
                    </p>
                    <div data-pic className="overflow-hidden rounded-[18px] max-md:hidden"><Thumb s={s} when={false} /></div>
                    <div className="min-w-0">
                      <h3 className="t-h3 text-ink transition-colors group-hover:text-brand">{s.title}</h3>
                      <p className="t-meta mt-1.5">{h.name}, {h.title.split(",")[0]} at {companyOf(s).name}</p>
                    </div>
                    <RemindButton id={s.id} />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </section>
      ))}
    </motion.main>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { COMPANIES, HOSTS, SESSIONS, companyOf, type Company as C } from "../data/seed";
import { useStore } from "../store/useStore";
import { FollowButton, SessionCard } from "../components/Cards";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Name, Reveal, Tabs, Words } from "../components/ui";
import { pageIn } from "../components/Nav";
import { Bookmark, BookmarkFill, External } from "../components/icons";
import { ease, spring } from "../lib/motion";

const sessionsOf = (c: C) => SESSIONS.filter((s) => companyOf(s).id === c.id);

export function Companies() {
  return (
    <motion.main {...pageIn} className="wrap pb-40 pt-10 md:pt-16">
      <Words text="Companies" className="t-display text-ink" />
      <p className="t-body mt-8 max-w-[560px]">Follow a company to hear when its recruiters and employees go live.</p>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...COMPANIES].sort((a, b) => a.name.localeCompare(b.name)).map((c, k) => {
          const live = sessionsOf(c).filter((s) => s.status === "live").length;
          return (
            <Reveal key={c.id} delay={(k % 3) * 0.06}>
              <Link to={`/company/${c.id}`} className="group flex h-full flex-col rounded-[28px] border-[1.5px] border-line bg-white p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <CompanyLogo c={c} size={64} />
                  {live > 0 && <span className="rounded-full bg-live/10 px-3 py-1 text-[15px] font-semibold text-live">{live} live now</span>}
                </div>
                <p className="mt-8 text-[28px] font-[650] tracking-[-0.025em] text-ink">{c.name}</p>
                <p className="t-meta mt-2 flex-1">{c.about}</p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[16px] font-semibold text-ink-2">{c.roles.length} open roles</span>
                  <FollowButton id={c.id} />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </motion.main>
  );
}

export function Company() {
  const { id = "" } = useParams();
  const c = COMPANIES.find((x) => x.id === id);
  const [tab, setTab] = useState<"home" | "jobs" | "people">("home");
  const saved = useStore((s) => s.savedRoles);
  const toggleRole = useStore((s) => s.toggleSavedRole);
  if (!c) return <Navigate to="/companies" replace />;
  const ss = sessionsOf(c);
  const groups: [string, typeof ss][] = [["Live now", ss.filter((s) => s.status === "live")], ["Coming up", ss.filter((s) => s.status === "scheduled")], ["Recordings", ss.filter((s) => s.status === "recorded")]];
  const people = HOSTS.filter((h) => h.companyId === c.id);

  return (
    <motion.main key={c.id} {...pageIn} className="pb-40">
      {/* the company's colour, washed soft, as the only decoration */}
      <div className="h-[200px] md:h-[260px]" style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${c.tone} 30%, var(--page)), color-mix(in srgb, ${c.tone} 6%, var(--page)))` }} />
      <div className="wrap -mt-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring.glide, delay: 0.1 }} className="inline-block rounded-[26px] border-[5px] border-page">
          <CompanyLogo c={c} size={112} />
        </motion.div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[760px]">
            <Words text={c.name} className="t-display text-ink" />
            <p className="t-body mt-5">{c.about}</p>
            <p className="t-meta mt-2">{c.hq}, {c.size} employees</p>
          </div>
          <FollowButton id={c.id} size="lg" />
        </div>
        <div className="mt-14">
          <Tabs id="co" value={tab} onChange={setTab} options={[{ id: "home", label: "Sessions" }, { id: "jobs", label: "Jobs", count: c.roles.length }, { id: "people", label: "People", count: people.length }]} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: ease.out }}>
            {tab === "home" &&
              groups.map(([label, list]) =>
                list.length ? (
                  <section key={label} className="mt-16">
                    <h2 className="t-h2 text-ink">{label}</h2>
                    <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((s) => <SessionCard key={s.id} s={s} />)}</div>
                  </section>
                ) : null,
              )}

            {tab === "jobs" && (
              <div className="mt-10 border-t border-line">
                {c.roles.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-5 border-b border-line py-7">
                    <div className="min-w-0 flex-1">
                      <p className="text-[22px] font-semibold text-ink">{r.title}</p>
                      <p className="t-meta mt-1">{r.team}, {r.location}{r.closes ? `, applications close ${r.closes}` : ""}</p>
                    </div>
                    <Button variant="quiet" className="!h-12 !w-12 !px-0" aria-label="Save job" onClick={() => toggleRole(r.id)}>
                      {saved.includes(r.id) ? <BookmarkFill size={22} className="text-brand" /> : <Bookmark size={22} />}
                    </Button>
                    <Button variant="outline">Apply <External size={16} /></Button>
                  </div>
                ))}
              </div>
            )}

            {tab === "people" && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {people.map((h) => (
                  <div key={h.id} className="flex items-center gap-5 rounded-[24px] border-[1.5px] border-line bg-white p-6">
                    <Avatar who={h.id} size={72} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[20px] font-semibold text-ink"><Name host={h} /></p>
                      <p className="t-meta">{h.title}</p>
                      <p className="mt-1 text-[15px] text-ink-3">At {c.name} since {h.since}</p>
                    </div>
                    <FollowButton id={h.id} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

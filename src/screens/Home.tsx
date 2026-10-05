import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COMPANIES, SESSIONS, companyOf, findHost, type Session } from "../data/seed";
import { useStore } from "../store/useStore";
import { Stage } from "../components/Stage";
import { FollowButton, RemindButton, SessionCard, useCaptionLoop } from "../components/Cards";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Count, LiveBadge, Name, Reveal, SectionHead, Segmented, Words, useStageNav } from "../components/ui";
import { hrefFor, pageIn } from "../components/Nav";
import { ChevronLeft, ChevronRight } from "../components/icons";
import { clock, dayLabel, startsAt, useNow } from "../lib/format";
import { spring, ease } from "../lib/motion";

const LIVE = SESSIONS.filter((s) => s.status === "live");
const SOON = SESSIONS.filter((s) => s.status === "scheduled").sort((a, b) => a.offsetMin - b.offsetMin);
const RECORDED = SESSIONS.filter((s) => s.status === "recorded");
const AUTO_MS = 9000;

/* ---------------- the room in front of you ---------------- */

function Featured() {
  const viewers = useStore((x) => x.viewers);
  // most watched first, decided once so the order does not reshuffle under you
  const order = useMemo(() => [...LIVE].sort((a, b) => (viewers[b.id] ?? 0) - (viewers[a.id] ?? 0)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [[i, dir], setI] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const s = order[i];
  const host = findHost(s.hostId);
  const caption = useCaptionLoop(s);
  const go = useStageNav();
  const stageEl = useRef<HTMLDivElement>(null);
  const step = (d: number) => setI(([x]) => [(x + d + order.length) % order.length, d]);

  // auto-advance unless you are looking at it
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => step(1), AUTO_MS);
    return () => clearTimeout(t);
  }, [i, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (window.scrollY > 500) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -80) step(1);
    else if (swipe > 80) step(-1);
  };

  return (
    <section className="wrap pt-6 md:pt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] lg:gap-16">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] shadow-stage">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={s.id}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: `${d * 18}%`, opacity: 0, scale: 1.04 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ x: `${d * -12}%`, opacity: 0, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: spring.glide, opacity: { duration: 0.35 }, scale: spring.glide }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <div ref={stageEl}>
                  <Stage session={s} caption={caption} viewers={viewers[s.id]} rounded={false} badges={false} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <LiveBadge />
            <span className="text-[17px] font-semibold text-ink-2"><Count value={viewers[s.id] ?? 0} /> watching</span>
          </div>
          <div className="mt-6 min-h-[3.2em] text-ink" style={{ fontSize: "clamp(34px, 3.6vw, 54px)" }}>
            <Words text={s.title} k={s.id} className="font-[650] leading-[1.02] tracking-[-0.03em]" />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease: ease.out, delay: 0.12 }} className="mt-7 flex items-center gap-4">
              <Avatar who={host.id} size={56} />
              <div className="min-w-0">
                <p className="text-[19px] font-semibold text-ink"><Name host={host} /></p>
                <p className="t-meta">{host.title.split(",")[0]} at {companyOf(s).name}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" className="whitespace-nowrap max-sm:!px-6" onClick={() => go(hrefFor(s), stageEl.current)}>Join the room</Button>
            <Button variant="outline" size="lg" className="!w-14 !px-0" aria-label="Previous room" onClick={() => step(-1)}><ChevronLeft size={22} /></Button>
            <Button variant="outline" size="lg" className="relative !w-14 !px-0" aria-label="Next room" onClick={() => step(1)}>
              <ChevronRight size={22} />
              {/* the ring fills as the next room approaches */}
              <svg className="pointer-events-none absolute -inset-[1.5px] h-[calc(100%+3px)] w-[calc(100%+3px)] -rotate-90" viewBox="0 0 60 60">
                <motion.circle key={`${i}-${paused}`} cx="30" cy="30" r="28.5" fill="none" stroke="var(--brand)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: paused ? 0 : 1 }} transition={{ duration: paused ? 0.3 : AUTO_MS / 1000, ease: "linear" }} />
              </svg>
            </Button>
            <span className="ml-2 text-[17px] font-semibold tabular-nums text-ink-3 max-sm:hidden">{i + 1} of {order.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- everything that is live ---------------- */

function LiveNow() {
  const [kind, setKind] = useState<"all" | "hiring" | "inside">("all");
  // six rooms make two full rows; the seventh is always one step away in the room above
  const list = LIVE.filter((s) => kind === "all" || s.kind === kind).slice(0, 6);
  return (
    <section className="wrap mt-28 md:mt-36">
      <Reveal>
        <SectionHead
          title="Live now"
          action={<Segmented id="kind" value={kind} onChange={setKind} options={[{ id: "all", label: "All" }, { id: "hiring", label: "Recruiters" }, { id: "inside", label: "In the job" }]} className="max-sm:hidden" />}
        />
      </Reveal>
      <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((s, k) => (
            <motion.div key={s.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ ...spring.glide, delay: k * 0.04 }}>
              <SessionCard s={s} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- what is about to start ---------------- */

function StartingSoon() {
  const now = useNow(30000);
  return (
    <section className="wrap mt-28 md:mt-36">
      <Reveal><SectionHead title="Starting soon" action={<Link to="/events" className="text-[17px] font-semibold text-brand hover:underline">Full schedule</Link>} /></Reveal>
      <div className="border-t border-line">
        {SOON.slice(0, 4).map((s, k) => {
          const d = startsAt(s);
          const mins = Math.max(1, Math.round((d.getTime() - now) / 60000));
          const host = findHost(s.hostId);
          return (
            <Reveal key={s.id} delay={k * 0.06} y={16}>
              <Link to={hrefFor(s)} className="group grid items-center gap-x-10 gap-y-4 border-b border-line py-8 md:grid-cols-[200px_minmax(0,1fr)_auto]">
                <p className="text-ink">
                  <span className="block text-[34px] font-[650] leading-none tracking-[-0.03em] tabular-nums">{mins < 60 ? `${mins} min` : clock(d)}</span>
                  <span className="mt-2 block text-[16px] text-ink-2">{mins < 60 ? "from now" : dayLabel(d)}</span>
                </p>
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar who={host.id} size={52} />
                  <div className="min-w-0">
                    <h3 className="t-h3 text-ink transition-colors group-hover:text-brand">{s.title}</h3>
                    <p className="t-meta mt-1">{host.name} at {companyOf(s).name}</p>
                  </div>
                </div>
                <RemindButton id={s.id} />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- what already happened ---------------- */

function Recordings() {
  return (
    <section className="wrap mt-28 md:mt-36">
      <Reveal><SectionHead title="Recordings" /></Reveal>
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {RECORDED.slice(0, 6).map((s, k) => (
          <Reveal key={s.id} delay={(k % 3) * 0.06}>
            <SessionCard s={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- who hosts ---------------- */

function Companies() {
  return (
    <section className="wrap mb-40 mt-28 md:mt-36">
      <Reveal><SectionHead title="Companies on Prep.io" action={<Link to="/companies" className="text-[17px] font-semibold text-brand hover:underline">See all</Link>} /></Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMPANIES.slice(0, 8).map((c, k) => (
          <Reveal key={c.id} delay={(k % 4) * 0.05} y={16}>
            <Link to={`/company/${c.id}`} className="group flex h-full flex-col rounded-[24px] border-[1.5px] border-line bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift">
              <CompanyLogo c={c} size={56} />
              <p className="mt-6 text-[22px] font-[650] tracking-[-0.02em] text-ink">{c.name}</p>
              <p className="t-meta mt-1">{c.roles.length} open roles</p>
              <div className="mt-6"><FollowButton id={c.id} /></div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.main {...pageIn} className="pb-24">
      <Featured />
      <LiveNow />
      <StartingSoon />
      <Recordings />
      <Companies />
    </motion.main>
  );
}

export type { Session };

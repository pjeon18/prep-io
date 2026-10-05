import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { COMPANIES, HOSTS, SESSIONS, companyOf, findCompany, findHost } from "../data/seed";
import { spring, ease } from "../lib/motion";
import { Avatar, CompanyLogo } from "./people";
import { Broadcast, Building, Calendar, Home, Search } from "./icons";

export const hrefFor = (s: { id: string }) => `/session/${s.id}`;

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center font-extrabold text-white" style={{ width: size, height: size, borderRadius: size * 0.3, background: "var(--brand)", fontSize: size * 0.62, lineHeight: 1 }}>
      <span style={{ transform: `translate(-${size * 0.07}px, -${size * 0.06}px)` }}>p</span>
      <span className="absolute rounded-full bg-brand-mint" style={{ width: size * 0.17, height: size * 0.17, right: size * 0.14, bottom: size * 0.24 }} />
    </span>
  );
}

export function Wordmark({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size={size} />
      <span className="font-bold tracking-[-0.035em] text-ink" style={{ fontSize: size * 0.66 }}>Prep.io</span>
    </span>
  );
}

const LINKS = [
  { to: "/", label: "Live", icon: Home, end: true },
  { to: "/events", label: "Schedule", icon: Calendar },
  { to: "/companies", label: "Companies", icon: Building },
  { to: "/go-live", label: "Go live", icon: Broadcast },
];

/* ---------------- search, as a panel you can drive from the keyboard ---------------- */

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const t = q.trim().toLowerCase();
  const hits = useMemo(() => {
    const m = (s: string) => !t || s.toLowerCase().includes(t);
    return [
      ...SESSIONS.filter((s) => s.status === "live" && m(`${s.title} ${companyOf(s).name} ${findHost(s.hostId).name}`)).map((s) => ({ key: s.id, label: s.title, sub: `Live now with ${findHost(s.hostId).name}`, to: hrefFor(s), pic: <Avatar who={s.hostId} size={44} /> })),
      ...(t ? COMPANIES.filter((c) => m(c.name)).map((c) => ({ key: c.id, label: c.name, sub: `${c.roles.length} open roles`, to: `/company/${c.id}`, pic: <CompanyLogo c={c} size={44} /> })) : []),
      ...(t ? HOSTS.filter((h) => m(`${h.name} ${h.title}`)).map((h) => ({ key: h.id, label: h.name, sub: `${h.title} at ${findCompany(h.companyId).name}`, to: `/company/${h.companyId}`, pic: <Avatar who={h.id} size={44} /> })) : []),
      ...(t ? SESSIONS.filter((s) => s.status !== "live" && m(`${s.title} ${companyOf(s).name}`)).map((s) => ({ key: s.id, label: s.title, sub: s.status === "scheduled" ? "Coming up" : "Recording", to: hrefFor(s), pic: <Avatar who={s.hostId} size={44} /> })) : []),
    ].slice(0, 7);
  }, [t]);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => input.current?.focus(), 30); }
  }, [open]);
  useEffect(() => setSel(0), [t]);

  const go = (to: string) => { onClose(); navigate(to); };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="absolute inset-0 bg-ink/25 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-[640px] overflow-hidden rounded-[28px] bg-white shadow-lift"
            initial={{ y: -16, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98, opacity: 0 }}
            transition={spring.ui}
          >
            <label className="flex items-center gap-4 border-b border-line px-6">
              <Search size={24} className="text-ink-3" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "ArrowDown") (e.preventDefault(), setSel((s) => Math.min(hits.length - 1, s + 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setSel((s) => Math.max(0, s - 1)));
                  if (e.key === "Enter" && hits[sel]) go(hits[sel].to);
                }}
                placeholder="Search people, companies and sessions"
                className="h-[76px] w-full bg-transparent text-[22px] font-medium text-ink outline-none placeholder:text-ink-3"
              />
            </label>
            <div className="max-h-[56vh] overflow-y-auto p-2">
              {!t && <p className="px-4 pb-1 pt-3 text-[15px] font-semibold text-ink-3">Live right now</p>}
              {hits.map((h, i) => (
                <button key={h.key} onMouseEnter={() => setSel(i)} onClick={() => go(h.to)} className="relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left">
                  {i === sel && <motion.span layoutId="search-sel" className="absolute inset-0 rounded-2xl bg-brand-soft" transition={spring.snap} />}
                  <span className="relative">{h.pic}</span>
                  <span className="relative min-w-0">
                    <span className="block truncate text-[18px] font-semibold text-ink">{h.label}</span>
                    <span className="block truncate text-[15.5px] text-ink-2">{h.sub}</span>
                  </span>
                </button>
              ))}
              {t && !hits.length && <p className="px-4 py-10 text-center text-[18px] text-ink-2">Nothing matches “{q.trim()}”.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- the bar ---------------- */

export function Nav() {
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) (e.preventDefault(), setSearching(true));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const studio = loc.pathname.startsWith("/go-live");

  return (
    <>
      <header className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled ? "bg-page/85 shadow-[0_1px_0_var(--line)] backdrop-blur-xl" : "bg-page"}`}>
        <div className="wrap flex h-[76px] items-center gap-8 max-md:h-[64px]">
          <NavLink to="/" aria-label="Prep.io home"><Wordmark /></NavLink>
          <nav className="flex h-full items-center gap-1 max-md:hidden">
            {LINKS.slice(0, 3).map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="relative flex h-10 items-center rounded-full px-4 text-[17px] font-semibold">
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/[0.06]" transition={spring.ui} />}
                    <span className={`relative transition-colors ${isActive ? "text-ink" : "text-ink-2 hover:text-ink"}`}>{l.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setSearching(true)} className="flex h-11 items-center gap-3 rounded-full px-4 text-[16px] text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink" aria-label="Search">
              <Search size={20} />
              <span className="max-lg:hidden">Search</span>
              <kbd className="rounded-md border border-line px-1.5 text-[13px] font-semibold text-ink-3 max-lg:hidden">⌘K</kbd>
            </button>
            <NavLink to="/go-live" className={`flex h-11 items-center gap-2 rounded-full px-5 text-[16px] font-semibold transition-colors max-md:hidden ${studio ? "bg-ink text-white" : "bg-brand text-white hover:bg-brand-ink"}`}>
              <Broadcast size={18} /> Go live
            </NavLink>
            <span className="ml-1 max-md:hidden"><Avatar who="alex" size={40} /></span>
          </div>
        </div>
      </header>

      {/* phones get a bottom bar that stays under the thumb */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-page/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="relative flex h-[64px] flex-col items-center justify-center gap-1 text-[13px] font-semibold">
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="tab-dot" className="absolute top-0 h-[3px] w-10 rounded-full bg-brand" transition={spring.ui} />}
                  <l.icon size={24} className={isActive ? "text-brand" : "text-ink-3"} />
                  <span className={isActive ? "text-ink" : "text-ink-3"}>{l.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <SearchPanel open={searching} onClose={() => setSearching(false)} />
    </>
  );
}

/** A soft entrance for each page. */
export const pageIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: ease.out } };

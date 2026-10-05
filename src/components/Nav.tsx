import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { COMPANIES, HOSTS, SESSIONS, companyOf, findCompany, findHost } from "../data/seed";
import { spring } from "../lib/motion";
import { Avatar, CompanyLogo } from "./people";
import { Broadcast, Building, Calendar, HomeFill, Home, Search } from "./icons";
import { hrefFor } from "./SessionCard";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center font-extrabold text-white" style={{ width: size, height: size, borderRadius: size * 0.26, background: "#1f5bff", fontSize: size * 0.62, lineHeight: 1 }}>
      <span style={{ transform: `translate(-${size * 0.08}px, -${size * 0.06}px)` }}>p</span>
      <span className="absolute rounded-full bg-sun" style={{ width: size * 0.17, height: size * 0.17, right: size * 0.13, bottom: size * 0.24 }} />
    </span>
  );
}

export function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size={size} />
      <span className="font-extrabold tracking-[-0.03em] text-ink" style={{ fontSize: size * 0.72 }}>Prep.io</span>
    </span>
  );
}

const ITEMS = [
  { to: "/", label: "Home", icon: Home, on: HomeFill, end: true },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/companies", label: "Companies", icon: Building },
  { to: "/go-live", label: "Go live", icon: Broadcast },
];

function SearchBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const t = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!t) return [];
    const m = (s: string) => s.toLowerCase().includes(t);
    return [
      ...COMPANIES.filter((c) => m(c.name)).map((c) => ({ key: c.id, label: c.name, sub: "Company", to: `/company/${c.id}`, pic: <CompanyLogo c={c} size={32} /> })),
      ...HOSTS.filter((h) => m(`${h.name} ${h.title}`)).map((h) => ({ key: h.id, label: h.name, sub: `${h.title} at ${findCompany(h.companyId).name}`, to: `/company/${h.companyId}`, pic: <Avatar who={h.id} size={32} /> })),
      ...SESSIONS.filter((s) => m(`${s.title} ${companyOf(s).name}`)).map((s) => ({ key: s.id, label: s.title, sub: s.status === "live" ? "Live now" : s.status === "scheduled" ? "Upcoming" : "Recording", to: hrefFor(s), pic: <Avatar who={findHost(s.hostId).id} size={32} /> })),
    ].slice(0, 8);
  }, [t]);

  return (
    <div className="relative min-w-0 max-sm:flex-1">
      <label className="flex h-9 w-[280px] items-center gap-2 rounded-md bg-[#edf3f8] px-3 text-ink-2 max-md:w-[200px] max-sm:w-full">
        <Search size={17} />
        <input
          ref={input}
          value={q}
          onChange={(e) => (setQ(e.target.value), setOpen(true))}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && hits[0] && (navigate(hits[0].to), setQ(""), input.current?.blur())}
          placeholder="Search"
          className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-2"
        />
      </label>
      <AnimatePresence>
        {open && hits.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={spring.ui} className="absolute left-0 top-11 z-50 w-[380px] overflow-hidden rounded-xl border border-line bg-white py-2 shadow-lift">
            {hits.map((h) => (
              <button key={h.key} onMouseDown={() => (navigate(h.to), setQ(""))} className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-[#f3f2ef]">
                {h.pic}
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-semibold text-ink">{h.label}</span>
                  <span className="block truncate text-[13px] text-ink-3">{h.sub}</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-3 px-4 max-sm:gap-2 max-sm:px-3">
        <NavLink to="/" aria-label="Prep.io home"><Logo /></NavLink>
        <SearchBox />
        <nav className="ml-auto flex h-full shrink-0 items-stretch">
          {ITEMS.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className="relative flex w-[76px] flex-col items-center justify-center gap-0.5 text-[12px] max-sm:w-[44px]">
              {({ isActive }) => {
                const I = isActive && it.on ? it.on : it.icon;
                return (
                  <>
                    <I size={22} className={isActive ? "text-ink" : "text-ink-2"} />
                    <span className={`max-sm:hidden ${isActive ? "font-semibold text-ink" : "text-ink-2"}`}>{it.label}</span>
                    {isActive && <motion.span layoutId="nav-bar" className="absolute inset-x-2 bottom-0 h-[2px] bg-ink" transition={spring.ui} />}
                  </>
                );
              }}
            </NavLink>
          ))}
          <div className="ml-2 flex w-[64px] flex-col items-center justify-center gap-0.5 border-l border-line pl-3 text-[12px] text-ink-2 max-sm:hidden">
            <Avatar who="alex" size={24} />
            Me
          </div>
        </nav>
      </div>
    </header>
  );
}

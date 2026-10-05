import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { COMPANIES, HOSTS, SESSIONS, companyOf, type Company as C } from "../data/seed";
import { useStore } from "../store/useStore";
import { SessionCard } from "../components/SessionCard";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Card, Name, Tabs } from "../components/kit";
import { Bookmark, BookmarkFill, Check, External, Plus } from "../components/icons";

const sessionsOf = (c: C) => SESSIONS.filter((s) => companyOf(s).id === c.id);

function FollowButton({ id, size = "sm" }: { id: string; size?: "sm" | "md" }) {
  const on = useStore((s) => s.following.includes(id));
  const toggle = useStore((s) => s.toggleFollow);
  return (
    <Button variant={on ? "ghost" : "primary"} size={size} onClick={() => toggle(id)} className={on ? "border border-line" : ""}>
      {on ? <Check size={16} /> : <Plus size={16} />} {on ? "Following" : "Follow"}
    </Button>
  );
}

export function Companies() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <Card className="mb-4">
        <h1 className="text-[22px] font-bold text-ink">Companies</h1>
        <p className="text-[15px] text-ink-2">Follow a company to see when its recruiters and employees go live.</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...COMPANIES].sort((a, b) => a.name.localeCompare(b.name)).map((c) => {
          const ss = sessionsOf(c);
          const live = ss.filter((s) => s.status === "live").length;
          return (
            <Card key={c.id} pad={false} className="overflow-hidden transition-shadow hover:shadow-lift">
              <Link to={`/company/${c.id}`} className="block">
                <div className="h-16" style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${c.tone} 28%, white), color-mix(in srgb, ${c.tone} 10%, white))` }} />
                <div className="-mt-7 px-4">
                  <div className="inline-block rounded-[12px] border-2 border-white"><CompanyLogo c={c} size={56} /></div>
                  <p className="mt-2 text-[17px] font-bold text-ink">{c.name}</p>
                  <p className="line-clamp-2 min-h-[40px] text-[13.5px] leading-snug text-ink-2">{c.about}</p>
                  <p className="mt-2 text-[13px] text-ink-3">
                    {live > 0 ? <span className="font-semibold text-live">{live} live now</span> : "Not live right now"}, {c.roles.length} open roles
                  </p>
                </div>
              </Link>
              <div className="p-4"><FollowButton id={c.id} /></div>
            </Card>
          );
        })}
      </div>
    </div>
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
  const live = ss.filter((s) => s.status === "live");
  const upcoming = ss.filter((s) => s.status === "scheduled");
  const recorded = ss.filter((s) => s.status === "recorded");
  const people = HOSTS.filter((h) => h.companyId === c.id);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <Card pad={false} className="overflow-hidden">
        <div className="h-[140px]" style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${c.tone} 35%, white), color-mix(in srgb, ${c.tone} 8%, #fff8ea))` }} />
        <div className="-mt-12 px-6 pb-2">
          <div className="inline-block rounded-[18px] border-4 border-white"><CompanyLogo c={c} size={96} /></div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-ink">{c.name}</h1>
              <p className="text-[15.5px] text-ink-2">{c.about}</p>
              <p className="mt-1 text-[14px] text-ink-3">{c.hq}, {c.size} employees</p>
            </div>
            <FollowButton id={c.id} size="md" />
          </div>
        </div>
        <div className="mt-3 px-2">
          <Tabs id="co" value={tab} onChange={setTab} options={[{ id: "home", label: "Sessions" }, { id: "jobs", label: "Jobs", count: c.roles.length }, { id: "people", label: "People", count: people.length }]} />
        </div>
      </Card>

      {tab === "home" && (
        <div className="mt-4 space-y-4">
          {[["Live now", live], ["Upcoming", upcoming], ["Recordings", recorded]].map(([label, list]) =>
            (list as typeof ss).length ? (
              <Card key={label as string}>
                <h2 className="mb-4 text-[18px] font-bold text-ink">{label as string}</h2>
                <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">{(list as typeof ss).map((s) => <SessionCard key={s.id} s={s} />)}</div>
              </Card>
            ) : null,
          )}
        </div>
      )}

      {tab === "jobs" && (
        <Card className="mt-4">
          <h2 className="text-[18px] font-bold text-ink">Open roles</h2>
          <div className="mt-2 divide-y divide-line">
            {c.roles.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-4">
                <CompanyLogo c={c} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold text-ink">{r.title}</p>
                  <p className="text-[14px] text-ink-2">{r.team}, {r.location}</p>
                  {r.closes && <p className="text-[13px] text-ink-3">Applications close {r.closes}</p>}
                </div>
                <Button variant="ghost" size="sm" className="!w-9 !px-0" aria-label="Save job" onClick={() => toggleRole(r.id)}>
                  {saved.includes(r.id) ? <BookmarkFill size={18} className="text-brand" /> : <Bookmark size={18} />}
                </Button>
                <Button variant="outline" size="sm">Apply <External size={14} /></Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "people" && (
        <Card className="mt-4">
          <h2 className="text-[18px] font-bold text-ink">People who host sessions</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {people.map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-xl border border-line p-4">
                <Avatar who={h.id} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold text-ink"><Name host={h} /></p>
                  <p className="text-[14px] text-ink-2">{h.title}</p>
                  <p className="text-[13px] text-ink-3">{h.kind === "recruiter" ? "Recruiter" : "Employee"} since {h.since}</p>
                </div>
                <FollowButton id={h.id} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

import { CLIPS, COMPANIES, HOSTS, SESSIONS } from "../data/seedData";
import type { Clip, Company, Host, SessionInfo } from "./types";

/* Search is user-initiated discovery — the opposite of a feed. Plain
 * substring matching over names, titles, orgs, and companies. */

export interface SearchResults {
  companies: Company[];
  hosts: Host[];
  live: SessionInfo[];
  upcoming: SessionInfo[];
  recordings: SessionInfo[];
  clips: Clip[];
}

const norm = (s: string) => s.toLowerCase();

export function search(query: string): SearchResults {
  const q = norm(query.trim());
  const empty: SearchResults = {
    companies: [],
    hosts: [],
    live: [],
    upcoming: [],
    recordings: [],
    clips: [],
  };
  if (q.length < 2) return empty;

  const companies = COMPANIES.filter(
    (c) => norm(c.name).includes(q) || norm(c.blurb).includes(q),
  );
  const companyIds = new Set(companies.map((c) => c.id));

  const hosts = HOSTS.filter(
    (h) =>
      norm(h.name).includes(q) ||
      norm(h.headline).includes(q) ||
      norm(h.org).includes(q) ||
      (h.companyId ? companyIds.has(h.companyId) : false),
  );
  const hostIds = new Set(hosts.map((h) => h.id));

  const sessions = SESSIONS.filter(
    (x) => norm(x.title).includes(q) || hostIds.has(x.hostId),
  );

  return {
    companies,
    hosts,
    live: sessions.filter((x) => x.kind === "live"),
    upcoming: sessions.filter((x) => x.kind === "scheduled"),
    recordings: sessions.filter((x) => x.kind === "vod"),
    clips: CLIPS.filter((c) => norm(c.title).includes(q) || hostIds.has(c.hostId)),
  };
}

export function companyHosts(companyId: string): Host[] {
  return HOSTS.filter((h) => h.companyId === companyId);
}

export function companySessions(companyId: string): SessionInfo[] {
  const ids = new Set(companyHosts(companyId).map((h) => h.id));
  return SESSIONS.filter((x) => ids.has(x.hostId));
}

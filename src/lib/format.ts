import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import type { Session } from "../data/seed";

export const startsAt = (s: Session) => new Date(useStore.getState().epoch + s.offsetMin * 60000);

export const clock = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export const dayLabel = (d: Date) => {
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((b - a) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "long" });
};

export const when = (s: Session) => {
  const d = startsAt(s);
  const mins = Math.round((d.getTime() - Date.now()) / 60000);
  if (mins < 60 && mins > 0) return `Starts in ${mins} min`;
  return `${dayLabel(d)} at ${clock(d)}`;
};

export const duration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60 ? `${min % 60}m` : ""}`.trim() : `${min} min`);

export const timecode = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const p = (x: number) => String(x).padStart(2, "0");
  return h ? `${h}:${p(m)}:${p(s % 60)}` : `${m}:${p(s % 60)}`;
};

export const ago = (days: number) => (days === 1 ? "Yesterday" : days < 7 ? `${days} days ago` : `${Math.round(days / 7)} week${days >= 14 ? "s" : ""} ago`);

export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

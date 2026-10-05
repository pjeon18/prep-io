import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SESSIONS, findCompany, findHost } from "../data/seed";
import { useStore } from "../store/useStore";
import { startStudio, stopStudio } from "../lib/sim";
import { Player } from "../components/Player";
import { Avatar, CompanyLogo } from "../components/people";
import { Button, Card, Name } from "../components/kit";
import { Check, Up } from "../components/icons";
import { timecode, useNow } from "../lib/format";
import { spring } from "../lib/motion";

/* The demo host identity: a verified Stripe recruiter. */
const ME = findHost("priya");
const CO = findCompany(ME.companyId);

function useMySession() {
  const st = useStore((s) => s.studio);
  return useMemo(() => ({ ...SESSIONS[0], id: "mine", status: "live" as const, title: st?.title || "Your session title" }), [st?.title]);
}

function Setup() {
  const st = useStore((s) => s.studio);
  const patch = useStore((s) => s.studioSetup);
  const goLive = useStore((s) => s.goLive);
  const session = useMySession();
  const title = st?.title ?? "";
  const roleIds = st?.roleIds ?? [];
  const kind = st?.kind ?? "hiring";

  return (
    <div className="mx-auto grid max-w-[1100px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      <Card className="!p-6">
        <h1 className="text-[22px] font-bold text-ink">Go live</h1>
        <p className="text-[15px] text-ink-2">Host a live session for people interested in {CO.name}.</p>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f7f6f3] p-3">
          <Avatar who={ME.id} size={44} />
          <div>
            <p className="text-[15px] font-semibold text-ink"><Name host={ME} /></p>
            <p className="text-[13.5px] text-ink-2">{ME.title} at {CO.name}</p>
          </div>
        </div>

        <label className="mt-6 block text-[14px] font-semibold text-ink" htmlFor="title">Session title</label>
        <input id="title" value={title} onChange={(e) => patch({ title: e.target.value })} placeholder="For example: How our new grad interviews work" maxLength={80} className="field mt-1.5" />

        <p className="mt-6 text-[14px] font-semibold text-ink">Who's hosting</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {([
            ["hiring", "I'm a recruiter", "Talk about the hiring process and open roles."],
            ["inside", "I'm an employee", "Talk about your job and your team."],
          ] as const).map(([id, label, note]) => (
            <Button key={id} onClick={() => patch({ kind: id })} className={`rounded-xl border-2 p-4 text-left transition-colors ${kind === id ? "border-brand bg-brand-soft" : "border-line hover:border-[#c9c5bd]"}`}>
              <span className="block text-[15px] font-semibold text-ink">{label}</span>
              <span className="mt-1 block text-[13.5px] leading-snug text-ink-2">{note}</span>
            </Button>
          ))}
        </div>

        {kind === "hiring" && (
          <>
            <p className="mt-6 text-[14px] font-semibold text-ink">Roles to share with viewers</p>
            <div className="mt-2 divide-y divide-line rounded-xl border border-line">
              {CO.roles.map((r) => {
                const on = roleIds.includes(r.id);
                return (
                  <button key={r.id} onClick={() => patch({ roleIds: on ? roleIds.filter((x) => x !== r.id) : [...roleIds, r.id] })} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f7f6f3]">
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${on ? "border-brand bg-brand text-white" : "border-[#b9b5ad]"}`}>{on && <Check size={13} strokeWidth={3} />}</span>
                    <span>
                      <span className="block text-[14.5px] font-semibold text-ink">{r.title}</span>
                      <span className="block text-[13px] text-ink-3">{r.location}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-7 flex items-center gap-3">
          <Button variant="primary" size="lg" disabled={!title.trim()} onClick={goLive}>Go live now</Button>
          <span className="text-[13.5px] text-ink-3">You can end the session at any time.</span>
        </div>
      </Card>

      <div>
        <p className="mb-2 px-1 text-[14px] font-semibold text-ink-2">Preview</p>
        <Card pad={false} className="overflow-hidden">
          <Player session={session} controls={false} caption={null} viewers={0} />
          <div className="p-4">
            <p className="text-[17px] font-bold text-ink">{title || "Your session title"}</p>
            <p className="mt-1 text-[14px] text-ink-2"><Name host={ME} className="font-semibold text-ink" /> <span className="text-ink-3">{ME.title} at {CO.name}</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Console() {
  const st = useStore((s) => s.studio)!;
  const mark = useStore((s) => s.markAnswered);
  const end = useStore((s) => s.endStudio);
  const session = useMySession();
  const now = useNow();
  useEffect(() => (startStudio(), stopStudio), []);
  const open = st.questions.filter((q) => !q.answered).sort((a, b) => b.votes - a.votes);
  const done = st.questions.filter((q) => q.answered);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <main className="min-w-0 space-y-4">
        <Card pad={false} className="overflow-hidden">
          <Player session={session} caption={null} viewers={st.viewers} controls={false} />
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-[13.5px] text-ink-3">You're live, {timecode((now - st.startedAt) / 1000)}</p>
              <h1 className="text-[22px] font-bold text-ink">{st.title}</h1>
            </div>
            <Button variant="outline" className="!border-live !text-live hover:!bg-[#fdeced]" onClick={end}>End session</Button>
          </div>
        </Card>
        <div className="grid grid-cols-3 gap-4">
          {[["Watching now", st.viewers], ["Most viewers", st.peak], ["Questions answered", done.length]].map(([k, v]) => (
            <Card key={k as string}>
              <p className="text-[13.5px] text-ink-2">{k}</p>
              <p className="mt-1 text-[28px] font-bold tabular-nums text-ink">{v}</p>
            </Card>
          ))}
        </div>
      </main>
      <aside>
        <Card pad={false} className="overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[16px] font-bold text-ink">Questions from viewers</h2>
            <p className="text-[13.5px] text-ink-2">Sorted by upvotes. Mark each one when you've answered it.</p>
          </div>
          <div className="max-h-[520px] overflow-y-auto p-2">
            {open.length === 0 && <p className="px-4 py-8 text-center text-[14.5px] text-ink-3">Questions will show up here as people join.</p>}
            {open.map((q) => (
              <motion.div layout key={q.id} transition={spring.glide} className="flex gap-3 rounded-lg px-2 py-3">
                <span className="flex h-11 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-line text-[13px] font-semibold text-ink-2"><Up size={14} />{q.votes}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] leading-snug text-ink">{q.text}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[13px] text-ink-3">{q.who}</span>
                    <Button variant="soft" size="sm" className="!h-7 !text-[13px]" onClick={() => mark(q.id)}>Mark answered</Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {done.map((q) => (
              <div key={q.id} className="flex items-center gap-2 px-3 py-2 text-[14px] text-ink-3"><Check size={15} className="text-ok" /> {q.text}</div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Summary() {
  const st = useStore((s) => s.studio)!;
  const close = useStore((s) => s.closeStudio);
  const navigate = useNavigate();
  const done = st.questions.filter((q) => q.answered);
  return (
    <div className="mx-auto max-w-[680px] px-4 py-10">
      <Card className="!p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e3f6ee] text-ok"><Check size={28} strokeWidth={2.4} /></div>
        <h1 className="mt-4 text-[24px] font-bold text-ink">Your session has ended</h1>
        <p className="mt-1 text-[15px] text-ink-2">The recording is saved to {CO.name}'s page, with each answered question marked so people can jump to it.</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[["Length", timecode((Date.now() - st.startedAt) / 1000)], ["Most viewers", st.peak], ["Questions answered", done.length]].map(([k, v]) => (
            <div key={k as string} className="rounded-xl bg-[#f7f6f3] p-4">
              <p className="text-[13px] text-ink-2">{k}</p>
              <p className="mt-1 text-[22px] font-bold tabular-nums text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex justify-center gap-3">
          <Button variant="primary" onClick={() => (close(), navigate(`/company/${CO.id}`))}>
            <CompanyLogo c={CO} size={20} /> View on {CO.name}'s page
          </Button>
          <Button variant="outline" onClick={close}>Start another</Button>
        </div>
      </Card>
    </div>
  );
}

export default function GoLive() {
  const phase = useStore((s) => s.studio?.phase ?? "setup");
  return phase === "live" ? <Console /> : phase === "ended" ? <Summary /> : <Setup />;
}

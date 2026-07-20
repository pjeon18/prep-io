import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { TopNav } from "../../components/TopNav";
import { IconArrowLeft, IconHand, IconMic } from "../../components/icons";
import { SECTIONS } from "../../data/seedData";
import { usePrepStore } from "../../store/usePrepStore";

/** Go-live wizard: section, title, now vs scheduled, hand-raise, breakout rate.
 *  The rate monetizes your TIME — it never touches where you appear on the
 *  floor (Principle 1). */
export default function GoLiveWizard() {
  const nav = useNavigate();
  const draft = usePrepStore((s) => s.hostDraft);
  const setHostDraft = usePrepStore((s) => s.setHostDraft);
  const goLive = usePrepStore((s) => s.goLive);
  const verification = usePrepStore((s) => s.verification);
  const toast = usePrepStore((s) => s.toast);

  const verified =
    verification.state === "verified-role" || verification.state === "verified-school";

  const ready = !!draft.sectionId && !!draft.title.trim();

  const submit = () => {
    if (draft.mode === "scheduled") {
      toast(`Scheduled for ${draft.when} — followers will be notified`);
      nav("/host");
      return;
    }
    if (goLive()) nav("/host/live");
  };

  return (
    <div className="min-h-dvh pb-24">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        <div className="mt-4 flex items-center gap-2">
          <button
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/host")}
          >
            <IconArrowLeft size={20} />
          </button>
          <h1 className="font-display text-[20px] font-semibold">Set up your session</h1>
        </div>

        {/* badge preview — how you'll appear */}
        <div className="card mt-4 flex items-center justify-between p-3.5">
          <span className="text-[13px]" style={{ color: "var(--prep-text-2)" }}>
            You'll appear as
          </span>
          <Badge state={verified ? (verification.state as "verified-role" | "verified-school") : "unverified"} />
        </div>

        {/* section */}
        <h2 className="mt-6 font-display text-[14px] font-semibold">Which booth?</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`chip ${draft.sectionId === s.id ? "chip-active" : ""}`}
              onClick={() => setHostDraft({ sectionId: s.id })}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* title */}
        <h2 className="mt-6 font-display text-[14px] font-semibold">Session title</h2>
        <input
          className="input mt-2.5"
          placeholder={'Specific beats broad — "Superday prep for juniors"'}
          maxLength={80}
          value={draft.title}
          onChange={(e) => setHostDraft({ title: e.target.value })}
        />

        {/* timing */}
        <h2 className="mt-6 font-display text-[14px] font-semibold">When?</h2>
        <div className="mt-2.5 flex gap-2">
          <button
            className={`chip flex-1 justify-center !py-2.5 ${draft.mode === "now" ? "chip-active" : ""}`}
            onClick={() => setHostDraft({ mode: "now" })}
          >
            <IconMic size={14} /> Go live now
          </button>
          <button
            className={`chip flex-1 justify-center !py-2.5 ${draft.mode === "scheduled" ? "chip-active" : ""}`}
            onClick={() => setHostDraft({ mode: "scheduled" })}
          >
            Schedule it
          </button>
        </div>
        {draft.mode === "scheduled" && (
          <select
            className="input mt-2.5"
            value={draft.when}
            onChange={(e) => setHostDraft({ when: e.target.value })}
          >
            {["Thu 7:00 PM", "Fri 6:30 PM", "Sat 2:00 PM", "Sun 4:00 PM", "Mon 7:30 PM"].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        )}

        {/* room settings */}
        <h2 className="mt-6 font-display text-[14px] font-semibold">Room settings</h2>
        <div className="card mt-2.5 divide-y" style={{ borderColor: "var(--prep-line)" }}>
          <label className="flex items-center justify-between gap-3 p-4">
            <span className="flex items-center gap-2 text-[13.5px]">
              <IconHand size={15} /> Hand raises
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#FFB547]"
              checked={draft.handRaise}
              onChange={(e) => setHostDraft({ handRaise: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-3 p-4" style={{ borderColor: "var(--prep-line)" }}>
            <span className="text-[13.5px]">Slow-mode chat</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#FFB547]"
              checked={draft.slowMode}
              onChange={(e) => setHostDraft({ slowMode: e.target.checked })}
            />
          </label>
          <div className="p-4" style={{ borderColor: "var(--prep-line)" }}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13.5px]">Breakout rate (optional)</span>
              <div className="flex items-center gap-1.5">
                <span style={{ color: "var(--prep-text-3)" }}>$</span>
                <input
                  className="input !w-20 !px-2.5 !py-1.5 text-center"
                  type="number"
                  min={0}
                  max={500}
                  placeholder="off"
                  value={draft.rate ?? ""}
                  onChange={(e) =>
                    setHostDraft({ rate: e.target.value ? Number(e.target.value) : null })
                  }
                />
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] leading-snug" style={{ color: "var(--prep-text-3)" }}>
              Per 15-minute private breakout. Pays for your time — it never
              affects your placement on the floor.
            </div>
          </div>
        </div>

        <button className="btn btn-primary mt-6 w-full" disabled={!ready} onClick={submit}>
          {draft.mode === "now" ? "Go live" : `Schedule for ${draft.when}`}
        </button>
      </main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { IconCheck, IconDownload, IconList, IconPlay, IconStar } from "../components/icons";
import { usePrepStore } from "../store/usePrepStore";

/** Premium — viewer-side subscription. It buys tools and the recording
 *  library, never placement, never access to a live public room
 *  (lurking stays free, Principle 4). */
export default function Premium() {
  const nav = useNavigate();
  const premium = usePrepStore((s) => s.premium);
  const upgradePremium = usePrepStore((s) => s.upgradePremium);
  const cancelPremium = usePrepStore((s) => s.cancelPremium);

  const perks = [
    {
      icon: IconPlay,
      title: "The full recording library",
      desc: "Every session recording after it airs — beyond the ones channels publish free.",
    },
    {
      icon: IconDownload,
      title: "AI transcription",
      desc: "Turn any recording into a clean text file of the Q&A for your notes.",
    },
    {
      icon: IconList,
      title: "Playlists",
      desc: "String recordings and shorts into an ordered mini-course you build yourself.",
    },
    {
      icon: IconStar,
      title: "Exclusive content",
      desc: "Members-only recordings and resource drops from channels you join.",
    },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <div className="overline mt-10">Prep.io Premium</div>
        <h1 className="mt-2 font-display text-[36px] leading-[1.12]" style={{ fontWeight: 500 }}>
          Keep everything you learn.
        </h1>
        <p className="mt-3 max-w-[36ch] text-[15.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          Watching live is free and always will be. Premium is for the studying
          after — the library, the notes, the courses you build from it.
        </p>

        <div className="mt-8 flex flex-col">
          {perks.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 border-t py-5"
              style={{ borderColor: "var(--prep-line)" }}
            >
              <p.icon size={20} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-[15.5px] font-medium">{p.title}</div>
                <div className="mt-1 text-[13.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {premium ? (
          <div className="card mt-6 p-5 text-center">
            <div className="inline-flex items-center gap-2 text-[15px] font-medium" style={{ color: "var(--prep-verified)" }}>
              <IconCheck size={16} /> You're on Premium
            </div>
            <button className="mt-3 block w-full text-[13px] underline" style={{ color: "var(--prep-text-3)" }} onClick={cancelPremium}>
              Cancel (prototype toggle)
            </button>
          </div>
        ) : (
          <>
            <button className="btn btn-primary mt-6 w-full !py-4 text-[16px]" onClick={() => { upgradePremium(); nav(-1); }}>
              Go Premium · $7 / month
            </button>
            <div className="mt-2.5 text-center text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
              Prototype — no real billing. Cancel anytime.
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

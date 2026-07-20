import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { TopNav } from "../../components/TopNav";
import { IconMic, IconPlay, IconShieldCheck } from "../../components/icons";
import { usePrepStore } from "../../store/usePrepStore";

/** The host's home: verify, go live, and watch sessions compound into a library. */
export default function HostHub() {
  const nav = useNavigate();
  const verification = usePrepStore((s) => s.verification);
  const userVods = usePrepStore((s) => s.userVods);
  const room = usePrepStore((s) => s.room);

  const verified =
    verification.state === "verified-role" || verification.state === "verified-school";

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <h1 className="mt-9 font-display text-[32px] leading-tight" style={{ fontWeight: 500 }}>
          Host on Prep.io
        </h1>
        <p className="mt-3 max-w-[34ch] text-[15.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          One hour of office hours reaches two hundred people. You earn from
          breakouts — never from placement.
        </p>

        {/* verification card — the badge IS the product */}
        <div className="card mt-7 p-5">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: verified ? "var(--prep-verified-tint)" : "var(--prep-surface-2)",
                color: verified ? "var(--prep-verified)" : "var(--prep-text-2)",
              }}
            >
              <IconShieldCheck size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-medium">Verification</div>
              <div className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--prep-text-2)" }}>
                {verification.state === "none" && "Unverified hosts are marked in every room"}
                {verification.state === "pending" && "Under review — usually under 48 hours"}
                {verification.state === "unverified" && "Review couldn't confirm your role — retry anytime"}
                {verified && "Your badge shows everywhere you appear"}
              </div>
            </div>
            {verified ? (
              <Badge state={verification.state as "verified-role" | "verified-school"} />
            ) : (
              <button className="chip" onClick={() => nav("/host/verify")}>
                {verification.state === "pending" ? "Status" : "Verify"}
              </button>
            )}
          </div>
        </div>

        {/* go live */}
        {room?.role === "host" ? (
          <button className="btn btn-primary mt-4 w-full !py-4" onClick={() => nav("/host/live")}>
            <IconMic size={17} /> Return to your live room
          </button>
        ) : (
          <button className="btn btn-primary mt-4 w-full !py-4" onClick={() => nav("/host/golive")}>
            <IconMic size={17} /> Set up a session
          </button>
        )}
        {!verified && (
          <div className="mt-2.5 text-center text-[13px]" style={{ color: "var(--prep-text-3)" }}>
            You can host unverified — you'll be marked that way.
          </div>
        )}

        {/* how it works */}
        <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
          How a session flows
        </h2>
        <ol className="mt-4 flex flex-col gap-0 text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          {[
            "People drop in free — no signup, real counts.",
            "Hands go up with written questions. You pick who's next.",
            "Each question is answered in front of everyone.",
            "You may offer a paid breakout; they choose.",
            "The session ends as a chaptered recording.",
          ].map((step, i) => (
            <li
              key={i}
              className="flex gap-4 border-b py-3.5 last:border-b-0"
              style={{ borderColor: "var(--prep-line)" }}
            >
              <span className="font-display text-[15px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* your library */}
        {userVods.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Your library
            </h2>
            {userVods.map((v) => (
              <button
                key={v.id}
                className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left"
                onClick={() => nav(`/vod/${v.id}`)}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-2)" }}
                >
                  <IconPlay size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium">{v.title}</div>
                  <div className="mt-1 text-[13px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                    Recorded · {v.vod!.durationLabel} · {v.vod!.chapters.length} questions
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

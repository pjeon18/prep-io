import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { TopNav } from "../../components/TopNav";
import { IconMic, IconPlay, IconShieldCheck, IconUsers } from "../../components/icons";
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
    <div className="min-h-dvh pb-16">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        <h1 className="mt-5 font-display text-[22px] font-semibold">Host on Prep.io</h1>
        <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          One hour of your office hours helps two hundred people at once. You
          earn from breakouts and tips — never from placement.
        </p>

        {/* verification card — the badge IS the product */}
        <div className="card mt-5 p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-tile"
              style={{
                background: verified ? "var(--prep-verified-tint)" : "var(--prep-surface-2)",
                color: verified ? "var(--prep-verified)" : "var(--prep-text-2)",
              }}
            >
              <IconShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">Credential verification</div>
              <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                {verification.state === "none" && "Unverified hosts are clearly marked in every room"}
                {verification.state === "pending" && "Under review — usually under 48 hours"}
                {verification.state === "unverified" && "Review couldn't confirm your role — you can retry"}
                {verified && "You're verified — the badge shows everywhere you appear"}
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
          <button className="btn btn-primary mt-4 w-full" onClick={() => nav("/host/live")}>
            <IconMic size={17} /> Return to your live room
          </button>
        ) : (
          <button className="btn btn-primary mt-4 w-full" onClick={() => nav("/host/golive")}>
            <IconMic size={17} /> Set up a session
          </button>
        )}
        {!verified && (
          <div className="mt-2 text-center text-[12px]" style={{ color: "var(--prep-text-3)" }}>
            You can host unverified — you'll just be marked that way, persistently.
          </div>
        )}

        {/* how it works */}
        <div className="card mt-5 p-4">
          <div className="flex items-center gap-2 font-display text-[13px] font-semibold">
            <IconUsers size={15} /> How a session flows
          </div>
          <ol className="mt-2.5 flex flex-col gap-2 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
            <li>1 · The crowd lurks free — no signup wall, real counts.</li>
            <li>2 · Hands go up with written questions; you pick who's next.</li>
            <li>3 · Each hot seat is answered in front of everyone.</li>
            <li>4 · You may offer a paid breakout — they choose to accept.</li>
            <li>5 · The session ends as a chaptered archive in your library.</li>
          </ol>
        </div>

        {/* your library */}
        {userVods.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-[16px] font-semibold">Your library</h2>
            {userVods.map((v) => (
              <button
                key={v.id}
                className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left"
                onClick={() => nav(`/vod/${v.id}`)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile" style={{ background: "var(--prep-surface-2)", color: "var(--prep-text-2)" }}>
                  <IconPlay size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium">{v.title}</div>
                  <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                    ARCHIVE · {v.vod!.durationLabel} · {v.vod!.chapters.length} questions
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

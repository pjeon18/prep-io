import { useNavigate } from "react-router-dom";
import { Badge } from "../components/Badge";
import { TopNav } from "../components/TopNav";
import { usePrepStore } from "../store/usePrepStore";

export default function Settings() {
  const nav = useNavigate();
  const verification = usePrepStore((s) => s.verification);
  const resetAll = usePrepStore((s) => s.resetAll);

  const row = "card mt-3 flex items-center justify-between gap-4 p-5";

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <h1 className="mt-9 font-display text-[32px]" style={{ fontWeight: 500 }}>
          Settings
        </h1>

        <div className={row}>
          <div>
            <div className="text-[15px] font-medium">Host verification</div>
            <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
              {verification.state === "none" && "Not started"}
              {verification.state === "pending" && "Under review"}
              {(verification.state === "verified-role" ||
                verification.state === "verified-school" ||
                verification.state === "unverified") && "Reviewed"}
            </div>
          </div>
          {verification.state === "verified-role" || verification.state === "verified-school" ? (
            <Badge state={verification.state} />
          ) : (
            <button className="chip" onClick={() => nav("/host/verify")}>
              {verification.state === "pending" ? "View" : "Start"}
            </button>
          )}
        </div>

        <div className={row}>
          <div>
            <div className="text-[15px] font-medium">Notifications</div>
            <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
              Go-live and schedule alerts from your follows
            </div>
          </div>
          <span className="chip chip-active !py-1.5 text-[13px]">On</span>
        </div>

        <div className={row}>
          <div>
            <div className="text-[15px] font-medium">Privacy</div>
            <div className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              You watch anonymously. Your name appears only when you raise
              your hand.
            </div>
          </div>
        </div>

        <div
          className="mt-8 border-t pt-5 text-[13px] leading-relaxed"
          style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-3)" }}
        >
          Prep.io prototype — all data is simulated and lives in your browser.
          No accounts, no payments, no real streams. Add <code>?debug</code> to
          the URL for demo controls.
        </div>

        <button className="btn btn-danger mt-5 w-full" onClick={resetAll}>
          Reset the prototype
        </button>
      </main>
    </div>
  );
}

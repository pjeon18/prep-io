import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { AppShell } from "../../components/AppShell";
import { IconArrowLeft, IconBook, IconCheck, IconShieldCheck } from "../../components/icons";
import { springs } from "../../lib/motion";
import { usePrepStore } from "../../store/usePrepStore";

/** Verification flow — stubbed review, real states. "Verified means verified"
 *  (Principle 2): the badge only ever comes out of this flow. */
export default function Verify() {
  const nav = useNavigate();
  const verification = usePrepStore((s) => s.verification);
  const startVerification = usePrepStore((s) => s.startVerification);
  const completeVerification = usePrepStore((s) => s.completeVerification);
  const toast = usePrepStore((s) => s.toast);
  const [method, setMethod] = useState<string | null>(verification.method);

  const verified =
    verification.state === "verified-role" || verification.state === "verified-school";

  // Stubbed reviewer: a pending submission resolves after a short beat so the
  // demo is self-contained. Method decides which badge you earn.
  useEffect(() => {
    if (verification.state !== "pending") return;
    const t = setTimeout(() => {
      const badge = verification.method === "edu" ? "verified-school" : "verified-role";
      completeVerification(badge);
      toast("Verification approved");
    }, 5000);
    return () => clearTimeout(t);
  }, [verification.state, verification.method, completeVerification, toast]);

  const methods = [
    {
      id: "linkedin",
      title: "LinkedIn",
      desc: "We match your current role and employer.",
      grants: "Verified role",
    },
    {
      id: "edu",
      title: ".edu email",
      desc: "Confirms your school affiliation.",
      grants: "Verified school",
    },
    {
      id: "offer",
      title: "Offer letter",
      desc: "Upload your offer or employment letter. A person reviews it.",
      grants: "Verified role",
    },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <div className="mt-5 flex items-center gap-1">
          <button
            aria-label="Back"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/host")}
          >
            <IconArrowLeft size={20} />
          </button>
        </div>

        {verified ? (
          <motion.div
            className="mt-14 flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springs.calm}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--prep-verified-tint)", color: "var(--prep-verified)" }}
            >
              <IconShieldCheck size={26} />
            </div>
            <h1 className="mt-5 font-display text-[32px]" style={{ fontWeight: 500 }}>
              You're verified
            </h1>
            <div className="mt-3">
              <Badge state={verification.state as "verified-role" | "verified-school"} />
            </div>
            <p className="mt-4 max-w-[32ch] text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              The badge shows on every surface you appear — the fair, your
              room, your profile, your recordings.
            </p>
            <button className="btn btn-primary mt-7 w-full" onClick={() => nav("/host/golive")}>
              Set up a session
            </button>
          </motion.div>
        ) : verification.state === "pending" ? (
          <motion.div
            className="mt-14 flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-2)" }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <IconBook size={24} />
            </motion.div>
            <h1 className="mt-5 font-display text-[32px]" style={{ fontWeight: 500 }}>
              Under review
            </h1>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              Until it clears, you'll appear as unverified anywhere you host.
              The marking never lies in either direction.
            </p>
            <div className="mt-4 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
              (prototype: resolves in a few seconds)
            </div>
          </motion.div>
        ) : (
          <>
            <h1 className="mt-3 font-display text-[32px] leading-tight" style={{ fontWeight: 500 }}>
              Get verified
            </h1>
            <p className="mt-3 max-w-[34ch] text-[15.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              Trust is the product. Choose how we confirm who you are — the
              badge shows everywhere, and so does its absence.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  className="card p-5 text-left"
                  style={method === m.id ? { borderColor: "var(--prep-text)" } : undefined}
                  onClick={() => setMethod(m.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[16px] font-medium">{m.title}</div>
                    {method === m.id && <IconCheck size={17} />}
                  </div>
                  <div className="mt-1 text-[13.5px] leading-snug" style={{ color: "var(--prep-text-2)" }}>
                    {m.desc}
                  </div>
                  <div className="mt-2.5 text-[12px] font-medium" style={{ color: "var(--prep-verified)" }}>
                    Grants {m.grants.toLowerCase()}
                  </div>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary mt-6 w-full"
              disabled={!method}
              onClick={() => startVerification(method!)}
            >
              Submit for review
            </button>
          </>
        )}
      </main>
    </AppShell>
  );
}

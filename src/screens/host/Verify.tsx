import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/Badge";
import { TopNav } from "../../components/TopNav";
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
      toast("Verification approved — your badge is live");
    }, 5000);
    return () => clearTimeout(t);
  }, [verification.state, verification.method, completeVerification, toast]);

  const methods = [
    {
      id: "linkedin",
      title: "LinkedIn OAuth",
      desc: "We match your current role and employer. Fastest for professionals.",
      grants: "Verified role",
    },
    {
      id: "edu",
      title: ".edu email",
      desc: "Confirms your school affiliation — for students and academics.",
      grants: "Verified school",
    },
    {
      id: "offer",
      title: "Offer letter review",
      desc: "Upload your offer or employment letter. A human checks it.",
      grants: "Verified role",
    },
  ];

  return (
    <div className="min-h-dvh pb-16">
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
          <h1 className="font-display text-[20px] font-semibold">Get verified</h1>
        </div>

        {verified ? (
          <motion.div
            className="card mt-6 flex flex-col items-center p-8 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springs.calm}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--prep-verified-tint)", color: "var(--prep-verified)" }}
            >
              <IconShieldCheck size={28} />
            </div>
            <div className="mt-4 font-display text-[18px] font-semibold">You're verified</div>
            <div className="mt-2">
              <Badge state={verification.state as "verified-role" | "verified-school"} />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              The badge now shows on every surface you appear — the fair, your
              room, your profile, and your archives.
            </p>
            <button className="btn btn-primary mt-5 w-full" onClick={() => nav("/host/golive")}>
              Set up a session
            </button>
          </motion.div>
        ) : verification.state === "pending" ? (
          <motion.div
            className="card mt-6 flex flex-col items-center p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--prep-surface-2)", color: "var(--prep-amber)" }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <IconBook size={26} />
            </motion.div>
            <div className="mt-4 font-display text-[17px] font-semibold">Under review</div>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              We're checking your submission. Until it clears, anywhere you host
              you'll appear as unverified — that marking never lies in either
              direction.
            </p>
            <div className="mt-3 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
              (prototype: the review resolves in a few seconds)
            </div>
          </motion.div>
        ) : (
          <>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              Trust is the whole product. Pick how we confirm who you are — the
              badge you earn shows everywhere, and its absence shows too.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  className="card p-4 text-left"
                  style={method === m.id ? { borderColor: "var(--prep-amber)" } : undefined}
                  onClick={() => setMethod(m.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[14.5px] font-medium">{m.title}</div>
                    {method === m.id && <IconCheck size={17} className="text-prep-amber" />}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-snug" style={{ color: "var(--prep-text-2)" }}>
                    {m.desc}
                  </div>
                  <div className="mt-2 text-[11.5px] font-medium" style={{ color: "var(--prep-verified)" }}>
                    Grants: {m.grants}
                  </div>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary mt-5 w-full"
              disabled={!method}
              onClick={() => startVerification(method!)}
            >
              Submit for review
            </button>
          </>
        )}
      </main>
    </div>
  );
}

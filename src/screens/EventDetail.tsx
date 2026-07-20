import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { BottomNav } from "../components/BottomNav";
import { TopNav } from "../components/TopNav";
import { IconArrowLeft, IconCheck, IconTicket, IconUsers, IconVideo } from "../components/icons";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { usePrepStore } from "../store/usePrepStore";

/** A ticketed event: capacity-limited so the engagement stays real.
 *  Free events use the $1 commitment — not revenue, a bot filter and an
 *  attendance stake, refunded when you show up. */
export default function EventDetail() {
  const { eventId } = useParams();
  const nav = useNavigate();
  const sesh = SESSIONS.find((x) => x.id === eventId && x.ticket);
  const tickets = usePrepStore((s) => s.tickets);
  const reserveTicket = usePrepStore((s) => s.reserveTicket);
  const releaseTicket = usePrepStore((s) => s.releaseTicket);
  const toast = usePrepStore((s) => s.toast);

  if (!sesh || !sesh.ticket) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>Event not found.</div>
        <Link to="/fair" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back home
        </Link>
      </div>
    );
  }

  const host = HOSTS.find((h) => h.id === sesh.hostId)!;
  const ticket = tickets[sesh.id];
  const left = sesh.ticket.capacity - sesh.ticket.seedTaken - (ticket ? 1 : 0);
  const pct = Math.min(
    100,
    Math.round(((sesh.ticket.seedTaken + (ticket ? 1 : 0)) / sesh.ticket.capacity) * 100),
  );
  const isCommit = sesh.ticket.commit && sesh.ticket.price === null;

  return (
    <div className="min-h-dvh pb-28">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <button
          aria-label="Back"
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav(-1)}
        >
          <IconArrowLeft size={20} />
        </button>

        <div className="overline mt-3 flex items-center gap-1.5">
          <IconTicket size={13} /> Ticketed event · {sesh.when}
        </div>
        <h1 className="mt-2 font-display text-[30px] leading-tight" style={{ fontWeight: 500 }}>
          {sesh.title}
        </h1>

        <Link to={`/profile/${host.id}`} className="mt-4 flex items-center gap-3">
          <Avatar hue={host.hue} initials={host.initials} size={40} />
          <div>
            <div className="flex items-center gap-2 text-[15px] font-medium">
              {host.name} <Badge state={host.badge} />
            </div>
            <div className="text-[13px]" style={{ color: "var(--prep-text-2)" }}>
              {host.headline}
            </div>
          </div>
        </Link>

        <div className="mt-5 flex flex-wrap gap-2 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          <span className="chip !py-1.5">
            <IconUsers size={13} /> capped at {sesh.ticket.capacity}
          </span>
          {sesh.video && (
            <span className="chip !py-1.5">
              <IconVideo size={13} /> video session
            </span>
          )}
          <span className="chip !py-1.5">
            {SECTIONS.find((s) => s.id === sesh.sectionId)?.name}
          </span>
        </div>

        {/* capacity */}
        <div className="card mt-6 p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px]" style={{ color: "var(--prep-text-2)" }}>
              Seats
            </span>
            <span className="text-[14px] font-medium tabular-nums">
              {left} of {sesh.ticket.capacity} left
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-pill" style={{ background: "var(--prep-surface-2)" }}>
            <div
              className="h-full rounded-pill transition-all"
              style={{ width: `${pct}%`, background: pct > 85 ? "var(--prep-live)" : "var(--prep-text)" }}
            />
          </div>
          <div className="mt-2 text-[12.5px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
            Small on purpose — the host caps the room where the engagement
            stays meaningful. First come, first served.
          </div>
        </div>

        {/* the commitment message */}
        {isCommit && !ticket && (
          <div className="card mt-4 p-5" style={{ borderColor: "var(--prep-text)" }}>
            <div className="overline">Commit to your learning</div>
            <div className="mt-2 font-display text-[20px] leading-snug" style={{ fontWeight: 500 }}>
              $1 to hold your seat.
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              Not revenue — a filter. It keeps bots out and no-shows honest, so
              the {sesh.ticket.capacity} people in the room actually showed up
              to be there. Refunded when you attend.
            </p>
          </div>
        )}

        {ticket ? (
          <>
            <div className="card mt-4 flex items-center gap-3 p-5" style={{ borderColor: "var(--prep-verified)" }}>
              <span style={{ color: "var(--prep-verified)" }}>
                <IconCheck size={18} />
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-medium">Your seat is held</div>
                <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                  {ticket.paid === 1
                    ? "$1 commitment paid — refunded when you attend"
                    : ticket.paid > 0
                      ? `Paid $${ticket.paid}`
                      : "Free seat"}
                  {" · "}see it in your Library
                </div>
              </div>
            </div>
            <button
              className="btn btn-ghost mt-3 w-full"
              onClick={() => {
                releaseTicket(sesh.id);
                toast("Seat released — someone on the floor will thank you");
              }}
            >
              Give up my seat
            </button>
          </>
        ) : left <= 0 ? (
          <div className="card mt-4 p-5 text-center text-[14.5px]" style={{ color: "var(--prep-text-2)" }}>
            This event is full. Subscribe to {host.name.split(" ")[0]} to hear
            about the next one.
          </div>
        ) : (
          <button
            className="btn btn-primary mt-5 w-full !py-4"
            onClick={() => {
              if (reserveTicket(sesh.id)) {
                toast(
                  isCommit
                    ? "Seat held — $1 commitment charged (stubbed, refunded on attendance)"
                    : "Seat reserved (stubbed payment)",
                );
              }
            }}
          >
            {isCommit
              ? "Hold my seat · $1"
              : sesh.ticket.price
                ? `Reserve · $${sesh.ticket.price}`
                : "Reserve a seat"}
          </button>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

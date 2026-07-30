import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/AppShell";
import { Badge } from "../../components/Badge";
import { IconHand, IconMic, IconUsers, IconVideo } from "../../components/icons";
import { Pressable } from "../../components/ui/Pressable";
import { SegmentedSwitch } from "../../components/ui/SegmentedSwitch";
import { CAMPUS_KIND_LABEL, TEACHING_COURSE_ID } from "../../data/campusData";
import type { CampusKind } from "../../data/campusData";
import { courseSessions, findCourse, findPerson } from "../../lib/campus";
import { usePrepStore } from "../../store/usePrepStore";

/* Teach — the staff side of Campus.
 *
 * The pitch to an instructor is not "another video tool," it's fewer tools:
 * going live here posts to the course channel, is joinable from the web
 * with no client and no meeting id, records itself, and chapters the
 * recording by the question that was asked. The hand-raise queue is the
 * same consent-gated mechanic the careers side uses, which is exactly how
 * office hours already work in a room. */

const KINDS: { value: CampusKind; label: string }[] = [
  { value: "office-hours", label: "Office hours" },
  { value: "section", label: "Section" },
  { value: "review", label: "Review" },
  { value: "lecture", label: "Lecture" },
];

export default function TeachHub() {
  const nav = useNavigate();
  const draft = usePrepStore((s) => s.hostDraft);
  const setHostDraft = usePrepStore((s) => s.setHostDraft);
  const goLive = usePrepStore((s) => s.goLive);
  const room = usePrepStore((s) => s.room);
  const [kind, setKind] = useState<CampusKind>("office-hours");

  const course = findCourse(TEACHING_COURSE_ID)!;
  const instructor = findPerson(course.instructorId)!;
  const past = courseSessions(course.id).filter((s) => s.kind === "vod");

  const defaultTitle = `${course.code} ${CAMPUS_KIND_LABEL[kind].toLowerCase()}`;
  const title = draft.title.trim() || defaultTitle;

  const start = () => {
    setHostDraft({ sectionId: "stem", title, mode: "now" });
    // goLive reads the draft synchronously from the store, so the set above
    // has already landed by the time this runs.
    if (goLive()) nav("/host/live");
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[860px] lg:px-8">
        <div className="overline mt-9">You are course staff</div>
        <h1 className="mt-2 font-display text-[32px] leading-tight" style={{ fontWeight: 500 }}>
          Hold office hours, live.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          One link on the course channel, no meeting id, nothing to install.
          It records itself and chapters the recording by the question that
          got asked.
        </p>

        {/* who you're going live as */}
        <div className="card mt-7 flex items-center gap-3.5 p-4">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-tile text-[12px] font-semibold"
            style={{ background: `hsl(${course.hue} 40% 94%)`, color: `hsl(${course.hue} 45% 26%)` }}
          >
            {course.code.replace(/[^A-Z0-9]/g, "").slice(0, 4)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium">
              {course.code} · {course.term}
            </div>
            <div className="mt-0.5 inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
              <IconUsers size={12} /> {course.enrolled} students will be notified
            </div>
          </div>
          <Badge state="verified-school" compact />
        </div>

        <div className="overline mt-8">Session type</div>
        <div className="mt-3">
          <SegmentedSwitch
            layoutGroup="teach-kind"
            options={KINDS}
            value={kind}
            onChange={(k) => {
              setKind(k);
              setHostDraft({ title: "" }); // let the title follow the type
            }}
            size="sm"
          />
        </div>

        <div className="overline mt-8">Title</div>
        <input
          className="input mt-3"
          placeholder={defaultTitle}
          maxLength={80}
          value={draft.title}
          onChange={(e) => setHostDraft({ title: e.target.value })}
        />

        <div className="overline mt-8">Room</div>
        <div className="card mt-3 divide-y" style={{ borderColor: "var(--prep-line)" }}>
          <label className="flex items-center justify-between gap-3 px-5 py-4">
            <span className="flex items-center gap-2.5 text-[15px]">
              <IconVideo size={15} /> Camera on
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#000]"
              checked={draft.video}
              onChange={(e) => setHostDraft({ video: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-3 px-5 py-4">
            <span className="flex items-center gap-2.5 text-[15px]">
              <IconHand size={15} /> Hand raises
              <span className="text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                (the office-hours queue)
              </span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#000]"
              checked={draft.handRaise}
              onChange={(e) => setHostDraft({ handRaise: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-3 px-5 py-4">
            <span className="text-[15px]">Slow-mode chat</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#000]"
              checked={draft.slowMode}
              onChange={(e) => setHostDraft({ slowMode: e.target.checked })}
            />
          </label>
        </div>

        {room?.role === "host" ? (
          <Pressable
            onClick={() => nav("/host/live")}
            className="btn btn-primary mt-8 w-full !py-4"
            magnetic
          >
            <IconMic size={17} /> Return to your live room
          </Pressable>
        ) : (
          <Pressable onClick={start} className="btn btn-primary mt-8 w-full !py-4" magnetic>
            <IconMic size={17} /> Go live to {course.enrolled} students
          </Pressable>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-12 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Your past sessions
            </h2>
            {past.map((s) => (
              <Pressable
                key={s.id}
                onClick={() => nav(`/vod/${s.id}`)}
                className="card mt-3 flex w-full items-center gap-4 p-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-medium">{s.title}</div>
                  <div className="mt-1 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                    {s.vod!.recordedOn} · {s.vod!.durationLabel} · {s.vod!.chapters.length} questions answered
                  </div>
                </div>
              </Pressable>
            ))}
          </>
        )}

        <div className="mt-10 text-[12.5px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
          Instructor of record: {instructor.name}. Prototype — going live starts
          a simulated room with a simulated class in it.
        </div>
      </main>
    </AppShell>
  );
}

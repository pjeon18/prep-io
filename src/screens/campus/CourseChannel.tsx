import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { AppShell } from "../../components/AppShell";
import { Thumb } from "../../components/Thumb";
import { LivePill } from "../../components/LiveStage";
import { IconArrowLeft, IconEye, IconPlay, IconUsers } from "../../components/icons";
import { AnimatedNumber } from "../../components/ui/AnimatedNumber";
import { Pressable } from "../../components/ui/Pressable";
import { SegmentedSwitch } from "../../components/ui/SegmentedSwitch";
import { SpotlightCard } from "../../components/ui/SpotlightCard";
import { CopyConfirm } from "../../components/ui/watermelon/CopyConfirm";
import { ExpandDetails } from "../../components/ui/watermelon/ExpandDetails";
import { CAMPUS_KIND_LABEL } from "../../data/campusData";
import { courseClips, courseSessions, courseStaff, findCourse, findPerson } from "../../lib/campus";
import { fadeUp, springs, stagger } from "../../lib/motion";
import { fmtCount, usePrepStore } from "../../store/usePrepStore";
import { useSyncMode } from "../../store/useSyncMode";

/* The course channel — the whole argument for Campus mode in one screen.
 *
 * Today a course is scattered: Zoom for the meeting, Canvas for the files,
 * a calendar for when, Panopto for the recording, and none of them know
 * about the others. Here it's one channel: live now, the week ahead, every
 * past session chaptered by the question that was asked, and the clips cut
 * from them. */

type Tab = "live" | "recordings" | "clips" | "staff";

export default function CourseChannel() {
  useSyncMode("campus");
  const { courseId } = useParams();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("live");
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const driftFloor = usePrepStore((s) => s.driftFloor);

  useEffect(() => {
    initFloor();
    const t = setInterval(driftFloor, 3000);
    return () => clearInterval(t);
  }, [initFloor, driftFloor]);

  const course = findCourse(courseId);
  if (!course) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-5 py-20 text-center">
          <div style={{ color: "var(--prep-text-2)" }}>That course doesn't exist.</div>
          <Link to="/campus" className="mt-4 inline-block text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
            Back to your courses
          </Link>
        </main>
      </AppShell>
    );
  }

  const sessions = courseSessions(course.id);
  const live = sessions.filter((s) => s.kind === "live");
  const upcoming = sessions.filter((s) => s.kind === "scheduled");
  const recordings = sessions.filter((s) => s.kind === "vod");
  const clips = courseClips(course);
  const staff = courseStaff(course);

  const tabs: { value: Tab; label: string }[] = [
    { value: "live", label: "Live & upcoming" },
    { value: "recordings", label: "Recordings" },
    { value: "clips", label: "Clips" },
    { value: "staff", label: "Staff" },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1180px] lg:px-8">
        <Pressable
          aria-label="Back"
          onClick={() => nav("/campus")}
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
        >
          <IconArrowLeft size={20} />
        </Pressable>

        {/* course header */}
        <div className="mt-3 flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card font-display text-[15px] font-semibold"
            style={{
              background: `hsl(${course.hue} 40% 94%)`,
              color: `hsl(${course.hue} 45% 26%)`,
            }}
          >
            {course.code.replace(/[^A-Z0-9]/g, "").slice(0, 4)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="overline">{course.term}</div>
            <h1 className="mt-1 font-display text-[28px] leading-tight" style={{ fontWeight: 500 }}>
              {course.code}: {course.title}
            </h1>
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
              <IconUsers size={13} /> {course.enrolled} enrolled
            </div>
          </div>
        </div>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          {course.blurb}
        </p>

        {/* The join link IS the pitch: one address for the course, no meeting
            id, nothing to install. */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CopyConfirm
            value={`https://prep.io/campus/course/${course.id}`}
            copyText="Copy join link"
          />
          <ExpandDetails
            label="Course details"
            rows={[
              { label: "Instructor", value: findPerson(course.instructorId)?.name ?? "—", wide: true },
              { label: "Term", value: course.term },
              { label: "Enrolled", value: String(course.enrolled) },
              {
                label: "Teaching staff",
                value: course.taIds.length ? String(course.taIds.length) : "None",
              },
              { label: "Recordings", value: String(recordings.length) },
            ]}
          />
        </div>

        <div className="mt-6">
          <SegmentedSwitch
            layoutGroup={`course-${course.id}`}
            options={tabs}
            value={tab}
            onChange={setTab}
            size="sm"
          />
        </div>

        {/* ---- live & upcoming ---- */}
        {tab === "live" && (
          <>
            {live.length > 0 && (
              <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5">
                {live.map((s, i) => {
                  const p = findPerson(s.hostId)!;
                  return (
                    <motion.div key={s.id} className="mt-5 lg:mt-0" {...fadeUp} transition={{ ...springs.standard, ...stagger(i) }}>
                      <SpotlightCard onClick={() => nav(`/room/${s.id}`)} className="cursor-pointer rounded-tile">
                        <Thumb hue={p.hue} initials={p.initials} live video={s.video} height={190} />
                        <div className="mt-2.5">
                          <div className="text-[16px] font-medium leading-snug">{s.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                            {p.name}
                            <span className="inline-flex items-center gap-1" style={{ color: "var(--prep-text-3)" }}>
                              · <IconEye size={13} /> <AnimatedNumber value={floorCounts[s.id] ?? 0} /> here now
                            </span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-7 lg:grid lg:grid-cols-2 lg:gap-3">
              {upcoming.map((s) => {
                const p = findPerson(s.hostId)!;
                return (
                  <div key={s.id} className="card mt-3 flex items-center gap-4 p-4 lg:mt-0">
                    <div className="overline w-[74px] shrink-0 !leading-snug">{s.when}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14.5px] font-medium leading-snug">{s.title}</div>
                      <div className="mt-1 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                        {CAMPUS_KIND_LABEL[s.campusKind]} · {p.name}
                      </div>
                    </div>
                  </div>
                );
              })}
              {live.length === 0 && upcoming.length === 0 && (
                <div className="card mt-5 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
                  Nothing scheduled yet this week.
                </div>
              )}
            </div>
          </>
        )}

        {/* ---- recordings ---- */}
        {tab === "recordings" && (
          <div className="mt-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5">
            {recordings.map((s, i) => {
              const p = findPerson(s.hostId)!;
              return (
                <motion.div key={s.id} className="mt-5 lg:mt-0" {...fadeUp} transition={{ ...springs.standard, ...stagger(i) }}>
                  <Pressable onClick={() => nav(`/vod/${s.id}`)} className="w-full text-left" large>
                    <Thumb hue={p.hue} initials={p.initials} duration={s.vod!.durationLabel} height={150} />
                    <div className="mt-2 text-[14.5px] font-medium leading-snug">{s.title}</div>
                    <div className="mt-1 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                      {CAMPUS_KIND_LABEL[s.campusKind]} · {s.vod!.chapters.length} questions ·{" "}
                      {fmtCount(s.vod!.views)} views · {s.vod!.recordedOn}
                    </div>
                  </Pressable>
                </motion.div>
              );
            })}
            {recordings.length === 0 && (
              <div className="card mt-5 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
                No recordings yet.
              </div>
            )}
          </div>
        )}

        {/* ---- clips ---- */}
        {tab === "clips" && (
          <div className="mt-6 grid grid-cols-3 items-start gap-2.5 lg:grid-cols-6">
            {clips.map((c) => {
              const p = findPerson(c.hostId)!;
              return (
                <Pressable key={c.id} onClick={() => nav(`/shorts/${c.id}`)} className="text-left">
                  <Thumb hue={c.hue} initials={p.initials} duration={c.durationLabel} height={170} />
                  <div className="mt-1.5 line-clamp-2 text-[12px] font-medium leading-snug">{c.title}</div>
                </Pressable>
              );
            })}
            {clips.length === 0 && (
              <div className="card col-span-full mt-5 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
                No clips yet.
              </div>
            )}
          </div>
        )}

        {/* ---- staff ---- */}
        {tab === "staff" && (
          <div className="mt-6 lg:grid lg:grid-cols-2 lg:gap-3">
            {staff.map((p) => {
              const onAir = live.some((s) => s.hostId === p.id);
              return (
                <Pressable
                  key={p.id}
                  onClick={() => nav(`/profile/${p.id}`)}
                  className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left lg:mt-0"
                >
                  <Avatar hue={p.hue} initials={p.initials} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[15px] font-medium">
                      {p.name} <Badge state={p.badge} compact />
                    </div>
                    <div className="mt-0.5 truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                      {p.headline}
                    </div>
                  </div>
                  {onAir ? <LivePill /> : <IconPlay size={15} />}
                </Pressable>
              );
            })}
          </div>
        )}
      </main>
    </AppShell>
  );
}

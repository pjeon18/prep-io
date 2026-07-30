import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { AppShell } from "../../components/AppShell";
import { Thumb } from "../../components/Thumb";
import { LivePill } from "../../components/LiveStage";
import { IconEye, IconUsers } from "../../components/icons";
import { AnimatedNumber } from "../../components/ui/AnimatedNumber";
import { Pressable } from "../../components/ui/Pressable";
import { SpotlightCard } from "../../components/ui/SpotlightCard";
import { CAMPUS_KIND_LABEL } from "../../data/campusData";
import {
  campusLiveNow,
  campusUpcoming,
  findCourse,
  findPerson,
  myCourses,
} from "../../lib/campus";
import { fadeUp, springs, stagger } from "../../lib/motion";
import { usePrepStore } from "../../store/usePrepStore";
import { COURSE_CLIPS } from "../../data/campusData";

/* Campus home — one place for everything a student currently hunts for
 * across Canvas, Zoom, a calendar, and Panopto: what's live right now,
 * what's on this week, and the clips worth two minutes. */
export default function CampusHome() {
  const nav = useNavigate();
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const driftFloor = usePrepStore((s) => s.driftFloor);

  useEffect(() => {
    initFloor();
    const t = setInterval(driftFloor, 3000);
    return () => clearInterval(t);
  }, [initFloor, driftFloor]);

  const courses = myCourses();
  const live = campusLiveNow();
  const week = campusUpcoming();

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1440px] lg:px-8">
        <h1 className="mt-8 font-display text-[30px] leading-tight" style={{ fontWeight: 500 }}>
          Your courses
        </h1>

        {/* enrolled courses */}
        <div className="rail -mx-5 mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1">
          {courses.map((c, i) => (
            <motion.div key={c.id} {...fadeUp} transition={{ ...springs.standard, ...stagger(i) }}>
              <Pressable
                onClick={() => nav(`/campus/course/${c.id}`)}
                lift
                className="card flex w-[212px] shrink-0 flex-col p-4 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-tile text-[12px] font-semibold"
                    style={{
                      background: `hsl(${c.hue} 40% 94%)`,
                      color: `hsl(${c.hue} 45% 28%)`,
                    }}
                  >
                    {c.code.replace(/[^A-Z0-9]/g, "").slice(0, 4)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium">{c.code}</div>
                    <div className="truncate text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
                      {c.term}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 line-clamp-2 text-[13px] leading-snug" style={{ color: "var(--prep-text-2)" }}>
                  {c.title}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                  <IconUsers size={12} /> {c.enrolled} enrolled
                </div>
              </Pressable>
            </motion.div>
          ))}
        </div>

        {/* live now */}
        <h2 className="mt-11 font-display text-[26px]" style={{ fontWeight: 500 }}>
          Live now
        </h2>
        {live.length === 0 ? (
          <div className="card mt-4 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
            Nothing live in your courses right now.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 xl:grid-cols-4">
            {live.map((s, i) => {
              const staff = findPerson(s.hostId)!;
              const course = findCourse(s.courseId)!;
              return (
                <motion.div key={s.id} {...fadeUp} transition={{ ...springs.standard, ...stagger(i) }}>
                  <SpotlightCard
                    onClick={() => nav(`/room/${s.id}`)}
                    className="cursor-pointer rounded-tile"
                  >
                    <Thumb hue={staff.hue} initials={staff.initials} live video={s.video} height={168} />
                    <div className="mt-2.5 flex items-start gap-3">
                      <Avatar hue={staff.hue} initials={staff.initials} size={34} />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[15.5px] font-medium leading-snug">
                          {s.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                          <span className="font-medium">{course.code}</span>
                          <span style={{ color: "var(--prep-text-3)" }}>
                            {CAMPUS_KIND_LABEL[s.campusKind]}
                          </span>
                          <span className="inline-flex items-center gap-1" style={{ color: "var(--prep-text-3)" }}>
                            <IconEye size={13} />
                            <AnimatedNumber value={floorCounts[s.id] ?? 0} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* this week */}
        <h2 className="mt-11 font-display text-[26px]" style={{ fontWeight: 500 }}>
          This week
        </h2>
        <div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
          {week.map((s) => {
            const staff = findPerson(s.hostId)!;
            const course = findCourse(s.courseId)!;
            return (
              <Pressable
                key={s.id}
                onClick={() => nav(`/campus/course/${s.courseId}`)}
                className="card mt-3 flex w-full items-center gap-4 p-4 text-left lg:mt-0"
              >
                <div className="overline w-[74px] shrink-0 !leading-snug">{s.when}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-medium leading-snug">{s.title}</div>
                  <div className="mt-1 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                    <span className="font-medium">{course.code}</span>
                    <span style={{ color: "var(--prep-text-3)" }}>
                      {` · ${CAMPUS_KIND_LABEL[s.campusKind]} · ${staff.name}`}
                    </span>
                  </div>
                </div>
              </Pressable>
            );
          })}
        </div>

        {/* clips */}
        <h2 className="mt-11 font-display text-[26px]" style={{ fontWeight: 500 }}>
          Clips from your courses
        </h2>
        <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
          The one explanation you actually needed, cut out of the session
        </div>
        <div className="rail -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
          {COURSE_CLIPS.map((clip) => {
            const staff = findPerson(clip.hostId)!;
            return (
              <Pressable
                key={clip.id}
                onClick={() => nav(`/shorts/${clip.id}`)}
                className="w-[124px] shrink-0 text-left"
              >
                <Thumb hue={clip.hue} initials={staff.initials} duration={clip.durationLabel} height={182} />
                <div className="mt-1.5 line-clamp-2 text-[12.5px] font-medium leading-snug">
                  {clip.title}
                </div>
              </Pressable>
            );
          })}
        </div>

        {/* staff strip: verification means course staff here */}
        <h2 className="mt-11 font-display text-[26px]" style={{ fontWeight: 500 }}>
          Course staff
        </h2>
        <div className="mt-4 lg:grid lg:grid-cols-3 lg:gap-3">
          {courses.flatMap((c) =>
            [c.instructorId, ...c.taIds].map((id) => {
              const p = findPerson(id)!;
              return (
                <Pressable
                  key={`${c.id}-${id}`}
                  onClick={() => nav(`/profile/${id}`)}
                  className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left lg:mt-0"
                >
                  <Avatar hue={p.hue} initials={p.initials} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[14.5px] font-medium">
                      {p.name} <Badge state={p.badge} compact />
                    </div>
                    <div className="truncate text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                      {p.headline}
                    </div>
                  </div>
                  <LiveIfHosting hostId={id} />
                </Pressable>
              );
            }),
          )}
        </div>
      </main>
    </AppShell>
  );
}

/** A live marker next to staff who are on air right now. */
function LiveIfHosting({ hostId }: { hostId: string }) {
  const on = campusLiveNow().some((s) => s.hostId === hostId);
  return on ? <LivePill /> : null;
}

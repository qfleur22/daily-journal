import Link from "next/link";
import { SCHEDULE_TRACKS, type ScheduleTrack } from "@/data/schedule-tracks";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function WeekJournalPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Week Journal (Hopeway Schedule)
      </h1>
      <p className="text-slate-600 mb-8">
        Choose a track, then select a day to view and log your schedule.
      </p>

      <div className="space-y-10">
        {(Object.entries(SCHEDULE_TRACKS) as [ScheduleTrack, typeof SCHEDULE_TRACKS[ScheduleTrack]][]).map(
          ([track, { label }]) => (
            <section key={track}>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DAYS.map(({ key, label: dayLabel }) => (
                  <Link
                    key={key}
                    href={`/week-journal/${key}?track=${track}`}
                    className="block rounded-xl border-2 border-thistle/60 bg-white/80 p-6 shadow-sm hover:border-thistle hover:bg-pastel-petal/20 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-slate-800">
                      {dayLabel}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      View schedule →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}

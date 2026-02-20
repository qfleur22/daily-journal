import { HOPEWAY_SCHEDULE } from "@/data/hopeway-schedule";
import { RESIDENTIAL_SCHEDULE } from "@/data/residential-schedule";
import type { DayKey, ScheduleItem } from "@/data/hopeway-schedule";

export type ScheduleTrack = "php" | "residential";

export const SCHEDULE_TRACKS: Record<
  ScheduleTrack,
  { label: string; schedule: Record<DayKey, ScheduleItem[]> }
> = {
  php: {
    label: "PHP Track #2",
    schedule: HOPEWAY_SCHEDULE,
  },
  residential: {
    label: "Residential Track #1",
    schedule: RESIDENTIAL_SCHEDULE,
  },
};

export function getScheduleForTrack({
  track,
  dayKey,
}: {
  track: ScheduleTrack;
  dayKey: DayKey;
}): ScheduleItem[] {
  return SCHEDULE_TRACKS[track].schedule[dayKey] ?? [];
}

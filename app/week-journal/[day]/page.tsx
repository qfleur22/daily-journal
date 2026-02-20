import { DayJournal } from "@/components/week-journal/day-journal";
import type { ScheduleTrack } from "@/data/schedule-tracks";

export const runtime = "edge";

interface DayPageProps {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ track?: string }>;
}

const VALID_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const VALID_TRACKS: ScheduleTrack[] = ["php", "residential"];

export default async function WeekJournalDayPage({
  params,
  searchParams,
}: DayPageProps) {
  const { day } = await params;
  const { track: trackParam } = await searchParams;
  const normalized = day.toLowerCase();
  if (!VALID_DAYS.includes(normalized)) {
    return null;
  }
  const track: ScheduleTrack =
    trackParam && VALID_TRACKS.includes(trackParam as ScheduleTrack)
      ? (trackParam as ScheduleTrack)
      : "php";

  return (
    <DayJournal
      dayKey={
        normalized as
          | "monday"
          | "tuesday"
          | "wednesday"
          | "thursday"
          | "friday"
          | "saturday"
          | "sunday"
      }
      track={track}
    />
  );
}

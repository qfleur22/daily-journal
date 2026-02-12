import { DayJournal } from "@/components/week-journal/day-journal";

interface DayPageProps {
  params: Promise<{ day: string }>;
}

const VALID_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default async function WeekJournalDayPage({ params }: DayPageProps) {
  const { day } = await params;
  const normalized = day.toLowerCase();
  if (!VALID_DAYS.includes(normalized)) {
    return null;
  }
  return <DayJournal dayKey={normalized as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"} />;
}

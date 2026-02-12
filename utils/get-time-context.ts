import { ScheduleGroup } from "@/models/day-entry";

const PROGRAMMING_START_HOUR = 9;
const PROGRAMMING_END_HOUR = 16;

export interface TimeContext {
  isBeforeProgramming: boolean;
  isDuringProgramming: boolean;
  isAfterProgramming: boolean;
  currentGroup: ScheduleGroup | null;
  nextGroup: ScheduleGroup | null;
}

/**
 * Determines the current time context for the daily schedule.
 * Programming hours are 9am-4pm.
 */
export function getTimeContext({
  schedule,
}: {
  schedule: ScheduleGroup[];
}): TimeContext {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinutes;

  const isBeforeProgramming = currentHour < PROGRAMMING_START_HOUR;
  const isDuringProgramming =
    currentHour >= PROGRAMMING_START_HOUR && currentHour < PROGRAMMING_END_HOUR;
  const isAfterProgramming = currentHour >= PROGRAMMING_END_HOUR;

  let currentGroup: ScheduleGroup | null = null;
  let nextGroup: ScheduleGroup | null = null;

  for (let i = 0; i < schedule.length; i++) {
    const [startH, startM] = schedule[i].startTime.split(":").map(Number);
    const [endH, endM] = schedule[i].endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
      currentGroup = schedule[i];
      nextGroup = schedule[i + 1] ?? null;
      break;
    }
    if (currentTimeMinutes < startMinutes) {
      nextGroup = schedule[i];
      break;
    }
  }

  return {
    isBeforeProgramming,
    isDuringProgramming,
    isAfterProgramming,
    currentGroup,
    nextGroup,
  };
}

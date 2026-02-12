import {
  HOPEWAY_SCHEDULE,
  type DayKey,
  type ScheduleItem,
} from "@/data/hopeway-schedule";
import { ScheduleGroup } from "@/models/day-entry";

function parseTimeToMinutes(timeStr: string): number {
  const ampmMatch = timeStr.match(/(AM|PM)/i);
  const ampm = ampmMatch?.[1]?.toUpperCase();
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return 0;
  }
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (ampm === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  if (ampm === "PM" && hours === 12) {
    hours = 12;
  }
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function hopewayItemToScheduleGroup(
  item: ScheduleItem,
  index: number,
  allItems: ScheduleItem[]
): ScheduleGroup {
  const ampmSuffix = item.time.match(/(AM|PM)/i)?.[0] ?? "";
  const startMinutes = parseTimeToMinutes(item.time);
  let endMinutes = startMinutes + 60;
  if (item.time.includes("–") || item.time.includes("-")) {
    const parts = item.time.split(/[–-]/).map((p) => p.trim());
    if (parts.length >= 2) {
      const endPart = parts[1].includes("AM") || parts[1].includes("PM")
        ? parts[1]
        : parts[1] + " " + ampmSuffix;
      endMinutes = parseTimeToMinutes(endPart);
    }
  } else if (allItems[index + 1]) {
    endMinutes = parseTimeToMinutes(allItems[index + 1].time);
  }
  const name =
    item.options.length === 1
      ? item.options[0].location
        ? `${item.options[0].name} (${item.options[0].location})`
        : item.options[0].name
      : item.options.map((o) => (o.location ? `${o.name} (${o.location})` : o.name)).join(" OR ");
  return {
    id: item.id,
    name,
    startTime: formatMinutesToTime(startMinutes),
    endTime: formatMinutesToTime(endMinutes),
  };
}

export function getHopewayScheduleForDay({ date }: { date: string }): ScheduleGroup[] {
  const d = new Date(date + "T12:00:00");
  const dayNum = d.getDay();
  const dayKeys: DayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayKey = dayKeys[dayNum];
  const items = HOPEWAY_SCHEDULE[dayKey] ?? [];
  return items.map((item, i) =>
    hopewayItemToScheduleGroup(item, i, items)
  );
}

export function getHopewayScheduleForDayName({ day }: { day: string }): ScheduleGroup[] {
  const dayKey = day.toLowerCase() as DayKey;
  const items = HOPEWAY_SCHEDULE[dayKey] ?? [];
  return items.map((item, i) =>
    hopewayItemToScheduleGroup(item, i, items)
  );
}

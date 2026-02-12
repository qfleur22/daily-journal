const STORAGE_KEY = "hopeway-journal";

export interface GroupLog {
  itemId: string;
  chosenOptionIndex?: number;
  attended: boolean;
  notes: string;
  recordedTime?: string;
}

export interface DayLog {
  date: string;
  logs: Record<string, GroupLog>;
  reflection?: string;
  cupsOfTea?: number;
}

function loadLogs(): DayLog[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: DayLog[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getDayLog({ date }: { date: string }): DayLog | null {
  const logs = loadLogs();
  return logs.find((l) => l.date === date) ?? null;
}

export function saveDayLog({
  date,
  logs,
  reflection,
  cupsOfTea,
}: {
  date: string;
  logs: Record<string, GroupLog>;
  reflection?: string;
  cupsOfTea?: number;
}): void {
  const all = loadLogs();
  const idx = all.findIndex((l) => l.date === date);
  const existing = idx >= 0 ? all[idx] : null;
  const entry: DayLog = {
    date,
    logs,
    reflection: reflection ?? existing?.reflection,
    cupsOfTea: cupsOfTea ?? existing?.cupsOfTea ?? 0,
  };
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  saveLogs(all);
}

export function incrementCupsOfTea({ date }: { date: string }): number {
  const dayLog = getDayLog({ date });
  const current = dayLog?.cupsOfTea ?? 0;
  const next = current + 1;
  saveDayLog({
    date,
    logs: dayLog?.logs ?? {},
    reflection: dayLog?.reflection,
    cupsOfTea: next,
  });
  return next;
}

export function decrementCupsOfTea({ date }: { date: string }): number {
  const dayLog = getDayLog({ date });
  const current = dayLog?.cupsOfTea ?? 0;
  const next = Math.max(0, current - 1);
  saveDayLog({
    date,
    logs: dayLog?.logs ?? {},
    reflection: dayLog?.reflection,
    cupsOfTea: next,
  });
  return next;
}

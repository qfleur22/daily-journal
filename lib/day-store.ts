import {
  DayEntry,
  DayEntryOverview,
  DayTransitions,
  FreeTimeActivity,
  ScheduleGroup,
  ScheduleTimeBlock,
} from "@/models/day-entry";

const STORAGE_KEY = "daily-journal-entries";

const defaultTransitions: DayTransitions = {
  arrivedEarly: false,
  seatPicked: false,
  fidgetLoopsReady: false,
  resetAtCoffeeBreak: false,
};

const defaultSchedule: ScheduleGroup[] = [
  { id: "1", name: "Morning check-in", startTime: "09:00", endTime: "09:30" },
  { id: "2", name: "Group A", startTime: "09:30", endTime: "10:30" },
  { id: "3", name: "Break", startTime: "10:30", endTime: "10:45" },
  { id: "4", name: "Group B", startTime: "10:45", endTime: "11:45" },
  { id: "5", name: "Lunch", startTime: "11:45", endTime: "12:45" },
  { id: "6", name: "Group C", startTime: "12:45", endTime: "13:45" },
  { id: "7", name: "Coffee break", startTime: "13:45", endTime: "14:00" },
  { id: "8", name: "Group D", startTime: "14:00", endTime: "16:00" },
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadEntries(): DayEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const entries: DayEntry[] = JSON.parse(raw);
    return entries.map((e) => ({
      ...e,
      meals: (e.meals ?? []).map((m) => {
        const fw = m.foodWins ?? {};
        return {
          ...m,
          mealType: m.mealType ?? null,
          mealTime: m.mealTime ?? null,
          foodWins: {
            calories: fw.calories ?? false,
            protein: fw.protein ?? false,
            salt: fw.salt ?? false,
            usedSafeFood: fw.usedSafeFood ?? (fw as { safeTexture?: boolean }).safeTexture ?? false,
            drinkableOption: fw.drinkableOption ?? false,
            hadAtLeast2Bites: fw.hadAtLeast2Bites ?? false,
            ateUntilFull: fw.ateUntilFull ?? false,
          },
          whatIDrank: (m as { whatIDrank?: string }).whatIDrank ?? "",
          caffeinated: (m as { caffeinated?: boolean }).caffeinated ?? false,
        };
      }),
      morningRoutine: e.morningRoutine ?? null,
      bedtimeRoutine: e.bedtimeRoutine ?? null,
      dreamThemesOrRemember: e.dreamThemesOrRemember ?? null,
      scheduleChoices: e.scheduleChoices ?? {},
      bedtimeTaperDownTime: e.bedtimeTaperDownTime ?? null,
      weekendWakeupTime: e.weekendWakeupTime ?? null,
      weekendLunchTime: e.weekendLunchTime ?? null,
      weekendDinnerTime: e.weekendDinnerTime ?? null,
      freeTimeActivities: (
        (e as { freeTimeActivities?: FreeTimeActivity[] }).freeTimeActivities ??
        []
      ),
      scheduleBlocks:
        (e as { scheduleBlocks?: ScheduleTimeBlock[] }).scheduleBlocks ?? [],
    }));
  } catch {
    return [];
  }
}

function saveEntries(entries: DayEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntryById({ id }: { id: string }): DayEntry | null {
  const entries = loadEntries();
  return entries.find((e) => e.id === id) ?? null;
}

export function getEntryByDate({ date }: { date: string }): DayEntry | null {
  const entries = loadEntries();
  return entries.find((e) => e.date === date) ?? null;
}

export function createOrGetTodayEntry(): DayEntry {
  const today = new Date().toISOString().slice(0, 10);
  const existing = getEntryByDate({ date: today });
  if (existing) {
    return existing;
  }
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = dayNames[new Date().getDay()];
  const weekOfMonth = Math.ceil(
    (new Date().getDate() - 1) / 7 + 1
  ) as 1 | 2 | 3 | 4 | 5 | 6;
  const clampedWeek = Math.min(6, Math.max(1, weekOfMonth)) as 1 | 2 | 3 | 4 | 5 | 6;

  const entry: DayEntry = {
    id: generateId(),
    date: today,
    day: dayOfWeek,
    week: clampedWeek,
    participationPlan: null,
    burnoutStage: null,
    sensoryLoad: null,
    morningRoutine: null,
    bedtimeRoutine: null,
    windowOfTolerance: null,
    pain: null,
    fatigue: null,
    anxiety: null,
    depression: null,
    sleepHours: null,
    nightmareIntensity: null,
    dreamThemesOrRemember: null,
    arfidAppetite: null,
    dizziness: null,
    transitions: { ...defaultTransitions },
    breakfastAte: null,
    dinnerNotes: null,
    bedtimeTaperDownTime: null,
    weekendWakeupTime: null,
    weekendLunchTime: null,
    weekendDinnerTime: null,
    meals: [],
    schedule: defaultSchedule,
    scheduleChoices: {},
    freeTimeActivities: [],
    scheduleBlocks: [],
  };
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

export function updateEntry({
  id,
  updates,
}: {
  id: string;
  updates: Partial<DayEntry>;
}): DayEntry | null {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) {
    return null;
  }
  entries[idx] = { ...entries[idx], ...updates };
  saveEntries(entries);
  return entries[idx];
}

export function listEntries(): DayEntryOverview[] {
  const entries = loadEntries();
  return entries
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .map((e) => ({
      id: e.id,
      date: e.date,
      day: e.day,
      week: e.week,
      burnoutStage: e.burnoutStage,
      participationPlan: e.participationPlan,
      pain: e.pain,
      fatigue: e.fatigue,
      transitions: e.transitions ?? { arrivedEarly: false, seatPicked: false, fidgetLoopsReady: false, resetAtCoffeeBreak: false },
      scheduleChoices: e.scheduleChoices ?? {},
    }));
}

export function listFullEntries(): DayEntry[] {
  return loadEntries().sort((a, b) => (b.date > a.date ? 1 : -1));
}

export type ParticipationPlan = "Full" | "Medium" | "Low" | "Safety";

export type BurnoutStage = "Green" | "Yellow" | "Red" | "Black";

export type RoutineTier = 0 | 1 | 2;

export interface RoutineProgress {
  tier: RoutineTier;
  completedItemIds: string[];
}

export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type WindowOfTolerance = "In-window" | "Hyper" | "Hypo" | "Freeze";

export interface DayTransitions {
  arrivedEarly: boolean;
  seatPicked: boolean;
  fidgetLoopsReady: boolean;
  resetAtCoffeeBreak: boolean;
}

export interface DayEntry {
  id: string;
  date: string;
  day: string;
  week: WeekNumber;
  participationPlan: ParticipationPlan | null;
  burnoutStage: BurnoutStage | null;
  sensoryLoad: number | null;
  morningRoutine: RoutineProgress | null;
  bedtimeRoutine: RoutineProgress | null;
  windowOfTolerance: WindowOfTolerance | null;
  pain: number | null;
  fatigue: number | null;
  anxiety: number | null;
  depression: number | null;
  sleepHours: number | null;
  nightmareIntensity: number | null;
  dreamThemesOrRemember: string | null;
  arfidAppetite: number | null;
  dizziness: number | null;
  transitions: DayTransitions;
  breakfastAte: boolean | null;
  dinnerNotes: string | null;
  bedtimeTaperDownTime: string | null;
  weekendWakeupTime: string | null;
  weekendLunchTime: string | null;
  weekendDinnerTime: string | null;
  meals: Meal[];
  schedule: ScheduleGroup[];
  scheduleChoices: Record<string, string>;
  freeTimeActivities: FreeTimeActivity[];
  scheduleBlocks: ScheduleTimeBlock[];
}

export interface FreeTimeActivity {
  id: string;
  name: string;
  timeStarted: string;
  timeFinished: string;
}

export interface ScheduleTimeBlock {
  id: string;
  title: string;
  notes: string;
  timeStart: string;
  timeEnd: string;
}

export interface ScheduleGroup {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  mealType: MealType | null;
  mealTime: string | null;
  arfidAppetite: number | null;
  foodWins: {
    calories: boolean;
    protein: boolean;
    salt: boolean;
    usedSafeFood: boolean;
    drinkableOption: boolean;
    hadAtLeast2Bites: boolean;
    ateUntilFull: boolean;
  };
  whatIAte: string;
  whatIDrank: string;
  caffeinated: boolean;
}

export interface DayEntryOverview {
  id: string;
  date: string;
  day: string;
  week: WeekNumber;
  burnoutStage: BurnoutStage | null;
  participationPlan: ParticipationPlan | null;
  pain: number | null;
  fatigue: number | null;
  transitions: DayTransitions;
  scheduleChoices: Record<string, string>;
}

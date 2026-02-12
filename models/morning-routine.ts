export interface MorningRoutineItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface MorningRoutine {
  id: string;
  date: string;
  items: MorningRoutineItem[];
}

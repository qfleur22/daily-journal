export interface BedTimeRoutineItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface BedTimeRoutine {
  id: string;
  date: string;
  items: BedTimeRoutineItem[];
}

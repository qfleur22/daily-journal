import { type Meal } from "@/models/day-entry";

function mealTimeToMinutes(mealTime: string | null): number {
  if (!mealTime) {
    return 24 * 60;
  }
  const [h, m] = mealTime.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/**
 * Sorts meals by time taken (mealTime). Meals without a time appear last.
 */
export function sortMealsByTime(meals: Meal[]): Meal[] {
  return [...meals].sort(
    (a, b) => mealTimeToMinutes(a.mealTime) - mealTimeToMinutes(b.mealTime)
  );
}

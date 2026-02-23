"use client";

import { type Meal } from "@/models/day-entry";
import { formatTimeForDisplay } from "@/utils/format-time";

const FOOD_WIN_LABELS: { key: keyof Meal["foodWins"]; label: string }[] = [
  { key: "calories", label: "calories" },
  { key: "protein", label: "protein" },
  { key: "salt", label: "salt" },
  { key: "usedSafeFood", label: "used safe food" },
  { key: "drinkableOption", label: "drinkable option" },
  { key: "hadAtLeast2Bites", label: "2+ bites" },
  { key: "ateUntilFull", label: "ate until full" },
];

function formatMealType(mealType: Meal["mealType"]): string {
  if (!mealType) {
    return "Meal";
  }
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export interface MealSummaryContentProps {
  meal: Meal;
}

function getMealEndTime(meal: Meal): string {
  return meal.mealTimeEnd ?? meal.mealTime ?? "";
}

/**
 * Renders a consistent meal summary: time, food win bubbles, what was eaten, drink bubble.
 */
export function MealSummaryContent({ meal }: MealSummaryContentProps) {
  const mealLabel = formatMealType(meal.mealType);
  const endTime = getMealEndTime(meal);
  const showRange =
    meal.mealTime &&
    endTime &&
    meal.mealTime !== endTime;
  const timeStr = meal.mealTime
    ? showRange
      ? ` · ${formatTimeForDisplay(meal.mealTime)} – ${formatTimeForDisplay(endTime)}`
      : ` · ${formatTimeForDisplay(meal.mealTime)}`
    : " · —";

  return (
    <div className="min-w-0 flex-1">
      <p className="font-medium text-slate-700 text-sm">
        {mealLabel}
        {timeStr}
      </p>
      {meal.whatIAte && (
        <p className="text-sm text-slate-600 mt-1">{meal.whatIAte}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {FOOD_WIN_LABELS.map(
          ({ key, label }) =>
            meal.foodWins?.[key] && (
              <span
                key={key}
                className="text-xs px-2 py-0.5 rounded-full bg-pastel-petal/40 text-slate-700"
              >
                {label}
              </span>
            )
        )}
        {meal.whatIDrank && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-pastel-petal/40 text-slate-700">
            {meal.whatIDrank}
          </span>
        )}
      </div>
    </div>
  );
}

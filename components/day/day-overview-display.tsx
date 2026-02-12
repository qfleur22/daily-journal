"use client";

import Link from "next/link";
import { DayEntry, type BurnoutStage } from "@/models/day-entry";

const ROUTINE_TIER_LABELS: Record<number, string> = {
  0: "low spoons",
  1: "average spoons",
  2: "high spoons",
};

interface DayOverviewDisplayProps {
  entry: DayEntry;
  showMealsSummary?: boolean;
}

const BURNOUT_STAGE_STYLES: Record<BurnoutStage, string> = {
  Green: "border-green-400 bg-green-50 text-green-800",
  Yellow: "border-amber-400 bg-amber-50 text-amber-800",
  Red: "border-red-400 bg-red-50 text-red-800",
  Black: "border-slate-600 bg-slate-200 text-slate-900",
};

function formatValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return String(value);
}

export function DayOverviewDisplay({
  entry,
  showMealsSummary = true,
}: DayOverviewDisplayProps) {
  return (
    <section className="p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
      <h2 className="text-xl font-semibold mb-4">Day overview</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <dt className="text-sm text-slate-600">Date</dt>
          <dd className="font-medium">{entry.date}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">Day</dt>
          <dd className="font-medium">{entry.day}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">Week</dt>
          <dd className="font-medium">{entry.week}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Participation plan
          </dt>
          <dd className="font-medium">{formatValue(entry.participationPlan)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Burnout stage
          </dt>
          <dd>
            {entry.burnoutStage ? (
              <span
                className={`inline-flex px-3 py-1 rounded-full border-2 font-medium ${BURNOUT_STAGE_STYLES[entry.burnoutStage]}`}
              >
                {entry.burnoutStage}
              </span>
            ) : (
              <span className="font-medium">—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Sensory load
          </dt>
          <dd className="font-medium">{formatValue(entry.sensoryLoad)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Routines
          </dt>
          <dd className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/routine/morning"
                className="text-sm px-2 py-1 rounded border border-thistle/50 hover:bg-thistle/20"
              >
                Morning routine
              </Link>
              <Link
                href="/routine/bedtime"
                className="text-sm px-2 py-1 rounded border border-thistle/50 hover:bg-thistle/20"
              >
                Bedtime routine
              </Link>
            </div>
            {entry.morningRoutine && (
              <p className="text-sm text-slate-600">
                Morning: {entry.morningRoutine.completedItemIds.length} items done (
                {ROUTINE_TIER_LABELS[entry.morningRoutine.tier]})
              </p>
            )}
            {entry.bedtimeRoutine && (
              <p className="text-sm text-slate-600">
                Bedtime: {entry.bedtimeRoutine.completedItemIds.length} items done (
                {ROUTINE_TIER_LABELS[entry.bedtimeRoutine.tier]})
              </p>
            )}
            {!entry.morningRoutine && !entry.bedtimeRoutine && (
              <p className="text-sm text-slate-500">No routine progress yet</p>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Window of tolerance
          </dt>
          <dd className="font-medium">{formatValue(entry.windowOfTolerance)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">Pain</dt>
          <dd className="font-medium">{formatValue(entry.pain)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">Fatigue</dt>
          <dd className="font-medium">{formatValue(entry.fatigue)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">Anxiety</dt>
          <dd className="font-medium">{formatValue(entry.anxiety)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Depression
          </dt>
          <dd className="font-medium">{formatValue(entry.depression)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Sleep (hrs)
          </dt>
          <dd className="font-medium">{formatValue(entry.sleepHours)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Nightmare intensity
          </dt>
          <dd className="font-medium">{formatValue(entry.nightmareIntensity)}</dd>
        </div>
        {entry.dreamThemesOrRemember && (
          <div className="md:col-span-2">
            <dt className="text-sm text-slate-600">
              Dream themes / what I remember
            </dt>
            <dd className="font-medium">{entry.dreamThemesOrRemember}</dd>
          </div>
        )}
        <div>
          <dt className="text-sm text-slate-600">
            ARFID/Appetite
          </dt>
          <dd className="font-medium">{formatValue(entry.arfidAppetite)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-600">
            Dizziness
          </dt>
          <dd className="font-medium">{formatValue(entry.dizziness)}</dd>
        </div>
      </dl>
      <div className="mt-4 pt-4 border-t border-thistle/40">
        <dt className="text-sm text-slate-600 mb-2">
          Transitions
        </dt>
        <dd className="flex flex-wrap gap-4">
          <span
            className={
              entry.transitions.arrivedEarly ? "text-sky-blue font-medium" : "text-slate-500"
            }
          >
            Arrived early {entry.transitions.arrivedEarly ? "✓" : "○"}
          </span>
          <span
            className={
              entry.transitions.seatPicked ? "text-sky-blue font-medium" : "text-slate-500"
            }
          >
            Seat picked {entry.transitions.seatPicked ? "✓" : "○"}
          </span>
          <span
            className={
              entry.transitions.fidgetLoopsReady ? "text-sky-blue font-medium" : "text-slate-500"
            }
          >
            Fidget/loops ready {entry.transitions.fidgetLoopsReady ? "✓" : "○"}
          </span>
          <span
            className={
              entry.transitions.resetAtCoffeeBreak ? "text-sky-blue font-medium" : "text-slate-500"
            }
          >
            1 reset at coffee break{" "}
            {entry.transitions.resetAtCoffeeBreak ? "✓" : "○"}
          </span>
        </dd>
      </div>
      {entry.dinnerNotes && (
        <div className="mt-4 pt-4 border-t border-thistle/40">
          <dt className="text-sm text-slate-600">Dinner</dt>
          <dd className="font-medium">{entry.dinnerNotes}</dd>
        </div>
      )}
      {showMealsSummary && (entry.meals?.length ?? 0) > 0 && (
        <div className="mt-4 pt-4 border-t border-thistle/40">
          <dt className="text-sm text-slate-600 mb-3">Meals</dt>
          <dd className="space-y-4">
            {entry.meals?.map((meal, i) => (
              <div
                key={meal.id}
                className="rounded-lg border border-thistle/40 p-3 bg-white/50"
              >
                <p className="font-medium text-slate-700 mb-1">
                  {meal.mealType
                    ? meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)
                    : "Meal"}
                  {meal.mealTime && ` (${meal.mealTime})`}
                  {meal.whatIAte && ` — ${meal.whatIAte}`}
                </p>
                <p className="text-sm text-slate-600">
                  ARFID/Appetite: {meal.arfidAppetite ?? "—"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    ["calories", meal.foodWins.calories],
                    ["protein", meal.foodWins.protein],
                    ["salt", meal.foodWins.salt],
                    ["used safe food", meal.foodWins.usedSafeFood],
                    ["drinkable option", meal.foodWins.drinkableOption],
                    ["2+ bites", meal.foodWins.hadAtLeast2Bites],
                    ["ate until full", meal.foodWins.ateUntilFull],
                  ].map(
                    ([label, checked]) =>
                      checked && (
                        <span
                          key={String(label)}
                          className="text-xs px-2 py-0.5 rounded-full bg-pastel-petal/40"
                        >
                          {label}
                        </span>
                      )
                  )}
                </div>
              </div>
            ))}
          </dd>
        </div>
      )}
    </section>
  );
}

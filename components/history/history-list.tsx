"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listFullEntries } from "@/lib/day-store";
import {
  DayEntry,
  type BurnoutStage,
  type RoutineTier,
} from "@/models/day-entry";
import { formatTimeForDisplay } from "@/utils/format-time";

const BURNOUT_STAGE_STYLES: Record<BurnoutStage, string> = {
  Green: "border-green-400 bg-green-50 text-green-800",
  Yellow: "border-amber-400 bg-amber-50 text-amber-800",
  Red: "border-red-400 bg-red-50 text-red-800",
  Black: "border-slate-600 bg-slate-200 text-slate-900",
};

const ROUTINE_TIER_LABELS: Record<RoutineTier, string> = {
  0: "low spoons",
  1: "average spoons",
  2: "high spoons",
};

function isWeekend(date: string): boolean {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();
  return day === 0 || day === 6;
}

interface HistoryEntryCardProps {
  entry: DayEntry;
  onNavigate: () => void;
}

function HistoryEntryCard({ entry, onNavigate }: HistoryEntryCardProps) {
  const hasMetrics =
    entry.pain !== null ||
    entry.fatigue !== null ||
    entry.anxiety !== null ||
    entry.depression !== null ||
    entry.sensoryLoad !== null;

  const hasRoutines = entry.morningRoutine ?? entry.bedtimeRoutine;

  const hasTransitions =
    entry.transitions?.arrivedEarly ||
    entry.transitions?.seatPicked ||
    entry.transitions?.fidgetLoopsReady ||
    entry.transitions?.resetAtCoffeeBreak;

  const meals = entry.meals ?? [];
  const scheduleBlocks = entry.scheduleBlocks ?? [];
  const weekend = isWeekend(entry.date);

  return (
    <article className="rounded-xl border-2 border-thistle/40 bg-white/80 overflow-hidden hover:border-thistle transition-colors">
      <button
        type="button"
        onClick={onNavigate}
        className="w-full text-left p-6"
      >
        <div className="flex justify-between items-start gap-4 mb-5">
          <div>
            <h2 className="font-semibold text-xl">
              {entry.date} — {entry.day}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Week {entry.week}
              {entry.participationPlan && (
                <>
                  {" · "}
                  <span className="font-medium">{entry.participationPlan}</span>
                </>
              )}
              {entry.burnoutStage && (
                <>
                  {" · "}
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full border-2 font-medium ${BURNOUT_STAGE_STYLES[entry.burnoutStage]}`}
                  >
                    {entry.burnoutStage}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {hasMetrics && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Metrics
              </h3>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                {entry.pain !== null && (
                  <div>
                    <dt className="text-slate-500">Pain</dt>
                    <dd className="font-medium">{entry.pain}</dd>
                  </div>
                )}
                {entry.fatigue !== null && (
                  <div>
                    <dt className="text-slate-500">Fatigue</dt>
                    <dd className="font-medium">{entry.fatigue}</dd>
                  </div>
                )}
                {entry.anxiety !== null && (
                  <div>
                    <dt className="text-slate-500">Anxiety</dt>
                    <dd className="font-medium">{entry.anxiety}</dd>
                  </div>
                )}
                {entry.depression !== null && (
                  <div>
                    <dt className="text-slate-500">Depression</dt>
                    <dd className="font-medium">{entry.depression}</dd>
                  </div>
                )}
                {entry.sensoryLoad !== null && (
                  <div>
                    <dt className="text-slate-500">Sensory load</dt>
                    <dd className="font-medium">{entry.sensoryLoad}</dd>
                  </div>
                )}
                {entry.windowOfTolerance && (
                  <div>
                    <dt className="text-slate-500">Window</dt>
                    <dd className="font-medium">{entry.windowOfTolerance}</dd>
                  </div>
                )}
                {entry.sleepHours !== null && (
                  <div>
                    <dt className="text-slate-500">Sleep (hrs)</dt>
                    <dd className="font-medium">{entry.sleepHours}</dd>
                  </div>
                )}
                {entry.nightmareIntensity !== null && (
                  <div>
                    <dt className="text-slate-500">Nightmares</dt>
                    <dd className="font-medium">{entry.nightmareIntensity}</dd>
                  </div>
                )}
                {entry.arfidAppetite !== null && (
                  <div>
                    <dt className="text-slate-500">Appetite</dt>
                    <dd className="font-medium">{entry.arfidAppetite}</dd>
                  </div>
                )}
                {entry.dizziness !== null && (
                  <div>
                    <dt className="text-slate-500">Dizziness</dt>
                    <dd className="font-medium">{entry.dizziness}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {(entry.dreamThemesOrRemember || entry.breakfastAte !== null) && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Sleep & morning
              </h3>
              <div className="text-sm space-y-1">
                {entry.dreamThemesOrRemember && (
                  <p>
                    <span className="text-slate-500">Dreams:</span>{" "}
                    {entry.dreamThemesOrRemember}
                  </p>
                )}
                {entry.breakfastAte !== null && (
                  <p>
                    <span className="text-slate-500">Breakfast:</span>{" "}
                    {entry.breakfastAte ? "Ate" : "Skipped"}
                  </p>
                )}
              </div>
            </section>
          )}

          {hasRoutines && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Routines
              </h3>
              <div className="text-sm space-y-1">
                {entry.morningRoutine && (
                  <p>
                    Morning: {entry.morningRoutine.completedItemIds.length} done (
                    {ROUTINE_TIER_LABELS[entry.morningRoutine.tier]})
                  </p>
                )}
                {entry.bedtimeRoutine && (
                  <p>
                    Bedtime: {entry.bedtimeRoutine.completedItemIds.length} done (
                    {ROUTINE_TIER_LABELS[entry.bedtimeRoutine.tier]})
                  </p>
                )}
              </div>
            </section>
          )}

          {hasTransitions && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Transitions
              </h3>
              <p className="text-sm">
                {[
                  entry.transitions?.arrivedEarly && "arrived early",
                  entry.transitions?.seatPicked && "seat picked",
                  entry.transitions?.fidgetLoopsReady && "fidget loops ready",
                  entry.transitions?.resetAtCoffeeBreak &&
                    "reset at coffee break",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </section>
          )}

          {meals.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Meals
              </h3>
              <ul className="text-sm space-y-2">
                {meals.map((meal) => (
                  <li key={meal.id} className="flex flex-wrap gap-x-2">
                    <span className="font-medium">
                      {meal.mealType
                        ? meal.mealType.charAt(0).toUpperCase() +
                          meal.mealType.slice(1)
                        : "Meal"}
                      {meal.mealTime &&
                        ` (${formatTimeForDisplay(meal.mealTime)})`}
                    </span>
                    {meal.whatIAte && (
                      <span className="text-slate-600">— {meal.whatIAte}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {scheduleBlocks.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Free time activities
              </h3>
              <ul className="text-sm space-y-1.5">
                {scheduleBlocks
                  .sort(
                    (a, b) =>
                      (a.timeStart ?? "").localeCompare(b.timeStart ?? "")
                  )
                  .map((block) => (
                    <li key={block.id}>
                      <span className="font-medium">{block.title}</span>
                      <span className="text-slate-500">
                        {" "}
                        {formatTimeForDisplay(block.timeStart)}–
                        {formatTimeForDisplay(block.timeEnd)}
                      </span>
                      {block.notes && (
                        <span className="text-slate-600"> — {block.notes}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {entry.dinnerNotes && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Dinner notes
              </h3>
              <p className="text-sm text-slate-700">{entry.dinnerNotes}</p>
            </section>
          )}

          {weekend &&
            (entry.weekendWakeupTime ||
              entry.weekendLunchTime ||
              entry.weekendDinnerTime) && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Weekend times
                </h3>
                <div className="text-sm space-y-1">
                  {entry.weekendWakeupTime && (
                    <p>Wake: {formatTimeForDisplay(entry.weekendWakeupTime)}</p>
                  )}
                  {entry.weekendLunchTime && (
                    <p>Lunch: {formatTimeForDisplay(entry.weekendLunchTime)}</p>
                  )}
                  {entry.weekendDinnerTime && (
                    <p>Dinner: {formatTimeForDisplay(entry.weekendDinnerTime)}</p>
                  )}
                </div>
              </section>
            )}

          {entry.scheduleChoices &&
            Object.keys(entry.scheduleChoices).length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Schedule choices
                </h3>
                <p className="text-sm text-slate-600">
                  {Object.values(entry.scheduleChoices).join(" · ")}
                </p>
              </section>
            )}

          {entry.bedtimeTaperDownTime && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Bedtime taper
              </h3>
              <p className="text-sm">
                {formatTimeForDisplay(entry.bedtimeTaperDownTime)}
              </p>
            </section>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-5 pt-4 border-t border-thistle/30">
          Click to view full details
        </p>
      </button>

      <div className="px-6 py-3 bg-thistle/10 border-t border-thistle/30 flex justify-end">
        <Link
          href={`/day/${entry.id}/edit`}
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}

export function HistoryList() {
  const router = useRouter();
  const [entries, setEntries] = useState<DayEntry[]>([]);

  useEffect(() => {
    setEntries(listFullEntries());
  }, []);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border-2 border-thistle/40 bg-white/80 p-8 text-center text-slate-600">
        No entries yet. Start by checking in on the home page.
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {entries.map((entry) => (
        <li key={entry.id}>
          <HistoryEntryCard
            entry={entry}
            onNavigate={() => router.push(`/day/${entry.id}`)}
          />
        </li>
      ))}
    </ul>
  );
}

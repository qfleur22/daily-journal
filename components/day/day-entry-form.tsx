"use client";

import { useState } from "react";
import Link from "next/link";
import { DayEntry, WeekNumber } from "@/models/day-entry";
import { RightNowUpNext } from "@/components/day/right-now-up-next";
import { MealsSection } from "@/components/day/meals-section";
import { DayScheduleDisplay } from "@/components/day/day-schedule-display";
import { getTimeContext } from "@/utils/get-time-context";
import { getHopewayScheduleForDay } from "@/utils/hopeway-to-schedule";

interface DayEntryFormProps {
  entry: DayEntry;
  onUpdate: (updates: Partial<DayEntry>) => void;
  isCurrentDay: boolean;
}

const WEEK_OPTIONS: WeekNumber[] = [1, 2, 3, 4, 5, 6];

export function DayEntryForm({
  entry,
  onUpdate,
  isCurrentDay,
}: DayEntryFormProps) {
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const hopewaySchedule = getHopewayScheduleForDay({ date: entry.date });
  const scheduleWithFreeTime =
    hopewaySchedule.length > 0
      ? [
          ...hopewaySchedule,
          {
            id: "free-time",
            name: "Free time",
            startTime: "16:00",
            endTime: "21:00",
          },
        ]
      : hopewaySchedule;
  const timeContext = getTimeContext({ schedule: scheduleWithFreeTime });

  return (
    <div className="space-y-6">
      <RightNowUpNext
        timeContext={timeContext}
        breakfastAte={entry.breakfastAte}
        onBreakfastChange={(ate) => onUpdate({ breakfastAte: ate })}
        dinnerNotes={entry.dinnerNotes}
        onDinnerNotesChange={(notes) => onUpdate({ dinnerNotes: notes })}
        transitions={entry.transitions}
        onTransitionsChange={(transitions) => onUpdate({ transitions })}
        scheduleBlocks={entry.scheduleBlocks ?? []}
        onScheduleBlocksChange={(blocks) =>
          onUpdate({ scheduleBlocks: blocks })
        }
        meals={entry.meals ?? []}
        onMealsChange={(meals) => onUpdate({ meals })}
        isCurrentDay={isCurrentDay}
      />

      <MealsSection
        meals={entry.meals ?? []}
        onMealsChange={(meals) => onUpdate({ meals })}
        editingMealId={editingMealId}
        onEditingMealIdChange={setEditingMealId}
      />

      <section className="p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
        <h2 className="text-xl font-semibold mb-4">Day overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={entry.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Day</label>
            <input
              type="text"
              value={entry.day}
              onChange={(e) => onUpdate({ day: e.target.value })}
              placeholder="e.g. Monday"
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Week</label>
            <select
              value={entry.week}
              onChange={(e) =>
                onUpdate({ week: Number(e.target.value) as WeekNumber })
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            >
              {WEEK_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Routines</label>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/routine/morning"
                className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 transition-colors font-medium"
              >
                Morning routine
              </Link>
              <Link
                href="/routine/bedtime"
                className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 transition-colors font-medium"
              >
                Bedtime routine
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DayScheduleDisplay
        date={entry.date}
        meals={entry.meals ?? []}
        onMealsChange={(meals) => onUpdate({ meals })}
        scheduleBlocks={entry.scheduleBlocks ?? []}
        onScheduleBlocksChange={(blocks) =>
          onUpdate({ scheduleBlocks: blocks })
        }
        onScheduleChoice={(itemId, choiceText) => {
          const choices = entry.scheduleChoices ?? {};
          onUpdate({
            scheduleChoices: { ...choices, [itemId]: choiceText },
          });
        }}
        weekendWakeupTime={entry.weekendWakeupTime}
        weekendLunchTime={entry.weekendLunchTime}
        weekendDinnerTime={entry.weekendDinnerTime}
        onWeekendTimesChange={(updates) => onUpdate(updates)}
      />
    </div>
  );
}

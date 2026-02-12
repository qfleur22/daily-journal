"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getEntryById, updateEntry } from "@/lib/day-store";
import { DayEntry } from "@/models/day-entry";
import { DayEntryForm } from "@/components/day/day-entry-form";
import { DayOverviewDisplay } from "@/components/day/day-overview-display";
import { MealsSection } from "@/components/day/meals-section";
import { RightNowUpNext } from "@/components/day/right-now-up-next";
import { DayScheduleDisplay } from "@/components/day/day-schedule-display";
import { getTimeContext } from "@/utils/get-time-context";
import { getHopewayScheduleForDay } from "@/utils/hopeway-to-schedule";

interface DayDetailProps {
  entryId: string;
  mode: "view" | "edit";
}

export function DayDetail({ entryId, mode }: DayDetailProps) {
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  useEffect(() => {
    const found = getEntryById({ id: entryId });
    setEntry(found ?? null);
  }, [entryId]);

  const handleUpdate = (updates: Partial<DayEntry>) => {
    if (!entry) {
      return;
    }
    const updated = updateEntry({ id: entry.id, updates });
    if (updated) {
      setEntry(updated);
    }
  };

  if (!entry) {
    return (
      <div className="text-slate-600">
        Entry not found. <Link href="/history" className="underline text-thistle">Back to history</Link>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const isCurrentDay = entry.date === today;
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {entry.date} — {entry.day}
        </h1>
        <div className="flex gap-2">
          <Link
            href="/history"
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
          >
            Back to history
          </Link>
          <button
            type="button"
            onClick={() => setIsEditMode((e) => !e)}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
          >
            {isEditMode ? "View" : "Edit"}
          </button>
        </div>
      </div>

      {isEditMode ? (
        <DayEntryForm
          entry={entry}
          onUpdate={handleUpdate}
          isCurrentDay={isCurrentDay}
        />
      ) : (
        <div className="space-y-6">
          <DayOverviewDisplay entry={entry} showMealsSummary={false} />
          <MealsSection
            meals={entry.meals ?? []}
            onMealsChange={(meals) => handleUpdate({ meals })}
          />
          {isCurrentDay && (
            <RightNowUpNext
              timeContext={timeContext}
              breakfastAte={entry.breakfastAte}
              onBreakfastChange={() => {}}
              dinnerNotes={entry.dinnerNotes}
              onDinnerNotesChange={() => {}}
              transitions={entry.transitions}
              onTransitionsChange={() => {}}
              scheduleBlocks={entry.scheduleBlocks ?? []}
              onScheduleBlocksChange={() => {}}
              meals={entry.meals ?? []}
              onMealsChange={() => {}}
              isCurrentDay={true}
              readOnly
            />
          )}
          <DayScheduleDisplay
            date={entry.date}
            meals={entry.meals ?? []}
            onMealsChange={(meals) => handleUpdate({ meals })}
            scheduleBlocks={entry.scheduleBlocks ?? []}
            onScheduleBlocksChange={(blocks) =>
              handleUpdate({ scheduleBlocks: blocks })
            }
            onScheduleChoice={(itemId, choiceText) => {
              const choices = entry.scheduleChoices ?? {};
              handleUpdate({
                scheduleChoices: { ...choices, [itemId]: choiceText },
              });
            }}
            weekendWakeupTime={entry.weekendWakeupTime}
            weekendLunchTime={entry.weekendLunchTime}
            weekendDinnerTime={entry.weekendDinnerTime}
            onWeekendTimesChange={(updates) => handleUpdate(updates)}
          />
        </div>
      )}
    </div>
  );
}

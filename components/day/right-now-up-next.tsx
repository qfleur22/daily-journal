"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { TimeContext } from "@/utils/get-time-context";
import { type Meal, type ScheduleTimeBlock } from "@/models/day-entry";
import { TransitionsChecklist } from "@/components/day/transitions-checklist";
import { MealLog } from "@/components/day/meal-log";
import { createMeal } from "@/utils/create-meal";

interface RightNowUpNextProps {
  timeContext: TimeContext;
  breakfastAte: boolean | null;
  onBreakfastChange: (ate: boolean) => void;
  dinnerNotes: string | null;
  onDinnerNotesChange: (notes: string) => void;
  transitions: {
    arrivedEarly: boolean;
    seatPicked: boolean;
    fidgetLoopsReady: boolean;
    resetAtCoffeeBreak: boolean;
  };
  onTransitionsChange: (transitions: RightNowUpNextProps["transitions"]) => void;
  scheduleBlocks: ScheduleTimeBlock[];
  onScheduleBlocksChange: (blocks: ScheduleTimeBlock[]) => void;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  isCurrentDay: boolean;
  readOnly?: boolean;
}

function formatTimeNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface FreeTimeBlockProps {
  scheduleBlocks: ScheduleTimeBlock[];
  onScheduleBlocksChange: (blocks: ScheduleTimeBlock[]) => void;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
}

function FreeTimeBlock({
  scheduleBlocks,
  onScheduleBlocksChange,
  meals,
  onMealsChange,
}: FreeTimeBlockProps) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [timeStart, setTimeStart] = useState(formatTimeNow());
  const [timeEnd, setTimeEnd] = useState(formatTimeNow());
  const [draftMeal, setDraftMeal] = useState<Meal | null>(null);
  const draftMealRef = useRef<Meal | null>(null);

  const handleAddActivity = () => {
    if (!title.trim()) {
      return;
    }
    const newBlock: ScheduleTimeBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      notes: notes.trim(),
      timeStart,
      timeEnd,
    };
    onScheduleBlocksChange([...(scheduleBlocks ?? []), newBlock]);
    setTitle("");
    setNotes("");
    setTimeStart(formatTimeNow());
    setTimeEnd(formatTimeNow());
    setShowActivityForm(false);
  };

  const handleAddMeal = () => {
    const newMeal = createMeal({});
    draftMealRef.current = newMeal;
    setDraftMeal(newMeal);
  };

  const handleDraftUpdate = (updates: Partial<Meal>) => {
    setDraftMeal((prev) => {
      if (!prev) {
        return null;
      }
      const next = { ...prev, ...updates };
      draftMealRef.current = next;
      return next;
    });
  };

  const handleDraftSave = () => {
    const toAdd = draftMealRef.current;
    if (toAdd) {
      onMealsChange([...(meals ?? []), toAdd]);
      draftMealRef.current = null;
      setDraftMeal(null);
    }
  };

  const handleDraftRemove = () => {
    draftMealRef.current = null;
    setDraftMeal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-700">
            Right now
          </p>
          <p className="text-slate-600 text-sm">Free time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={draftMeal ? () => setDraftMeal(null) : handleAddMeal}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
          >
            {draftMeal ? "Close meal" : "Add meal"}
          </button>
          <button
            type="button"
            onClick={() => setShowActivityForm((prev) => !prev)}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
          >
            {showActivityForm ? "Close activity" : "Add activity"}
          </button>
          <Link
            href="/self-care"
            className="text-sm text-slate-600 hover:text-thistle hover:underline"
          >
            Need activities?
          </Link>
        </div>
      </div>
      <div className="space-y-3">
        {showActivityForm && (
          <div className="rounded-lg border-2 border-thistle/40 p-4 bg-white/60 space-y-3 relative">
            <button
              type="button"
              onClick={() => setShowActivityForm(false)}
              className="absolute top-3 right-3 text-sm text-slate-500 hover:text-red-600"
            >
              Remove
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-0.5">
                  Start
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeStart("16:00")}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    4pm (planned)
                  </button>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeStart(formatTimeNow())}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    Now
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-0.5">
                  End
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeEnd("22:00")}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    10pm (planned)
                  </button>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeEnd(formatTimeNow())}
                    className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
                  >
                    Now
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowActivityForm(false)}
                className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-slate-100 text-slate-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {draftMeal && (
          <div className="pt-2 border-t border-thistle/40">
            <MealLog
              meal={draftMeal}
              onUpdate={handleDraftUpdate}
              onRemove={handleDraftRemove}
              onSaveSuccess={handleDraftSave}
            />
          </div>
        )}
      </div>
      <div>
        <p className="font-medium text-slate-700">
          Up next
        </p>
        <Link
          href="/routine/bedtime"
          className="inline-block mt-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 transition-colors font-medium"
        >
          Bedtime routine
        </Link>
      </div>
    </div>
  );
}

export function RightNowUpNext({
  timeContext,
  breakfastAte,
  onBreakfastChange,
  dinnerNotes,
  onDinnerNotesChange,
  transitions,
  onTransitionsChange,
  scheduleBlocks,
  onScheduleBlocksChange,
  meals,
  onMealsChange,
  isCurrentDay,
  readOnly = false,
}: RightNowUpNextProps) {
  if (!isCurrentDay) {
    return null;
  }

  if (readOnly) {
    return (
      <section className="mb-8 p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
        <h2 className="text-xl font-semibold mb-4">Right Now & Up Next</h2>
        <div className="space-y-2 text-slate-600">
          <p>
            <span className="font-medium text-slate-700">
              Right now:
            </span>{" "}
            {timeContext.isBeforeProgramming && "Morning / breakfast"}
            {timeContext.isDuringProgramming &&
              timeContext.currentGroup?.name !== "Free time" &&
              timeContext.currentGroup?.name !== "Depart" &&
              (timeContext.currentGroup?.name ?? "—")}
            {(timeContext.currentGroup?.name === "Free time" ||
              timeContext.currentGroup?.name === "Depart") && "Free time"}
            {timeContext.isAfterProgramming &&
              timeContext.currentGroup?.name !== "Free time" &&
              timeContext.currentGroup?.name !== "Depart" &&
              "Dinner"}
          </p>
          <p>
            <span className="font-medium text-slate-700">
              Up next:
            </span>{" "}
            {timeContext.isBeforeProgramming &&
              (timeContext.nextGroup?.name ?? "First group")}
            {timeContext.isDuringProgramming &&
              (timeContext.nextGroup?.name ?? "—")}
            {timeContext.isAfterProgramming && "Bed time routine"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
      <h2 className="text-xl font-semibold mb-4">Right Now & Up Next</h2>

      {timeContext.isBeforeProgramming && (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-slate-700">
              Right now
            </p>
            <div className="mt-2 space-y-2">
              <Link
                href="/routine/morning"
                className="inline-block px-3 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 transition-colors font-medium"
              >
                Morning routine
              </Link>
              <div>
                <p className="text-sm mb-2">Did you eat breakfast?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="breakfast"
                      checked={breakfastAte === true}
                      onChange={() => onBreakfastChange(true)}
                      className="rounded"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="breakfast"
                      checked={breakfastAte === false}
                      onChange={() => onBreakfastChange(false)}
                      className="rounded"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-700">
              Up next
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {timeContext.nextGroup?.name ?? "First group of the day"}
            </p>
          </div>
        </div>
      )}

      {timeContext.isDuringProgramming && (
        <>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-slate-700">
                Right now
              </p>
              <p className="text-slate-600">
                {timeContext.currentGroup?.name ?? "—"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700">
                Up next
              </p>
              <p className="text-slate-600">
                {timeContext.nextGroup?.name ?? "—"}
              </p>
            </div>
            <TransitionsChecklist
              transitions={transitions}
              onTransitionsChange={onTransitionsChange}
            />
          </div>
        </>
      )}

      {(timeContext.currentGroup?.name === "Free time" ||
        timeContext.currentGroup?.name === "Depart") && (
        <FreeTimeBlock
        scheduleBlocks={scheduleBlocks}
        onScheduleBlocksChange={onScheduleBlocksChange}
        meals={meals}
        onMealsChange={onMealsChange}
        />
      )}

    </section>
  );
}

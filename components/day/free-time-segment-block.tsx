"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { type Meal, type ScheduleTimeBlock } from "@/models/day-entry";
import { MealLog } from "@/components/day/meal-log";
import { createMeal } from "@/utils/create-meal";

function formatTimeNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface FreeTimeSegmentBlockProps {
  timeStart: string;
  timeEnd: string;
  scheduleBlocks: ScheduleTimeBlock[];
  onScheduleBlocksChange: (blocks: ScheduleTimeBlock[]) => void;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  formatTimeForDisplay: (time: string) => string;
}

export function FreeTimeSegmentBlock({
  timeStart,
  timeEnd,
  scheduleBlocks,
  onScheduleBlocksChange,
  meals,
  onMealsChange,
  formatTimeForDisplay,
}: FreeTimeSegmentBlockProps) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [activityTimeStart, setActivityTimeStart] = useState(timeStart);
  const [activityTimeEnd, setActivityTimeEnd] = useState(timeEnd);
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
      timeStart: activityTimeStart,
      timeEnd: activityTimeEnd,
    };
    onScheduleBlocksChange([...(scheduleBlocks ?? []), newBlock]);
    setTitle("");
    setNotes("");
    setActivityTimeStart(timeStart);
    setActivityTimeEnd(timeEnd);
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

  const openActivityForm = () => {
    setActivityTimeStart(timeStart);
    setActivityTimeEnd(timeEnd);
    setShowActivityForm(true);
  };

  return (
    <div className="rounded-lg p-4 bg-icy-blue/20 border border-icy-blue/40 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-extrabold text-slate-600">
            {formatTimeForDisplay(timeStart)} – {formatTimeForDisplay(timeEnd)}
          </p>
          <p className="font-extrabold text-slate-800">Free time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={showActivityForm ? () => setShowActivityForm(false) : openActivityForm}
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
          <button
            type="button"
            onClick={draftMeal ? handleDraftRemove : handleAddMeal}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
          >
            {draftMeal ? "Close meal" : "Add meal"}
          </button>
        </div>
      </div>
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
              <label className="block text-xs text-slate-500 mb-0.5">Start</label>
              <div className="flex gap-1">
                <input
                  type="time"
                  value={activityTimeStart}
                  onChange={(e) => setActivityTimeStart(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setActivityTimeStart(formatTimeNow())}
                  className="px-2 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium shrink-0"
                >
                  Now
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-0.5">End</label>
              <div className="flex gap-1">
                <input
                  type="time"
                  value={activityTimeEnd}
                  onChange={(e) => setActivityTimeEnd(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setActivityTimeEnd(formatTimeNow())}
                  className="px-2 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium shrink-0"
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
  );
}

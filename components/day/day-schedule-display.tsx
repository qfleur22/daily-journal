"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  type DayKey,
  type ScheduleItem,
} from "@/data/hopeway-schedule";
import { RESIDENTIAL_SCHEDULE } from "@/data/residential-schedule";
import {
  getDayLog,
  saveDayLog,
  incrementCupsOfTea,
  decrementCupsOfTea,
  type GroupLog,
} from "@/lib/hopeway-store";
import {
  type Meal,
  type MealType,
  type ScheduleTimeBlock,
} from "@/models/day-entry";
import { MealLog } from "@/components/day/meal-log";
import { MealSummaryContent } from "@/components/day/meal-summary";
import { createMeal } from "@/utils/create-meal";
import { CalendarSyncButton } from "@/components/calendar/calendar-sync-button";
import { CalendarImportedBlock } from "@/components/calendar/calendar-imported-block";
import {
  MORNING_ROUTINE_ITEMS,
  BEDTIME_ROUTINE_ITEMS,
} from "@/data/routine-content";

function formatOption(opt: { name: string; location: string }): string {
  return opt.location ? `${opt.name} (${opt.location})` : opt.name;
}

function formatMealTimeForDisplay(mealTime: string | null): string {
  if (!mealTime) {
    return "";
  }
  const [h, m] = mealTime.split(":").map(Number);
  if (h === 0) {
    return `12:${String(m).padStart(2, "0")} AM`;
  }
  if (h < 12) {
    return `${h}:${String(m).padStart(2, "0")} AM`;
  }
  if (h === 12) {
    return `12:${String(m).padStart(2, "0")} PM`;
  }
  return `${h - 12}:${String(m).padStart(2, "0")} PM`;
}

function parseScheduleTimeToMinutes(time: string): number {
  const periodMatch = time.match(/(AM|PM)/i);
  const period = periodMatch?.[0]?.toUpperCase();

  const firstTimeMatch = time.match(/^(\d{1,2}):(\d{2})/);
  if (firstTimeMatch) {
    let h = Number(firstTimeMatch[1]);
    const m = Number(firstTimeMatch[2]);
    if (period === "PM" && h < 12) {
      h += 12;
    }
    if (period === "AM" && h === 12) {
      h = 0;
    }
    return h * 60 + m;
  }
  const altMatch = time.match(/(\d{1,2}):(\d{2})/);
  if (altMatch) {
    let h = Number(altMatch[1]);
    const m = Number(altMatch[2]);
    if (period === "PM" && h < 12) {
      h += 12;
    }
    if (period === "AM" && h === 12) {
      h = 0;
    }
    return h * 60 + m;
  }
  return 0;
}

function parseMealTimeToMinutes(mealTime: string | null): number {
  if (!mealTime) {
    return 0;
  }
  const [h, m] = mealTime.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

const FREE_TIME_START_MINUTES = 16 * 60;
const FREE_TIME_END_MINUTES = 21 * 60;

function blockOverlapsFreeTime(block: ScheduleTimeBlock): boolean {
  const start = parseMealTimeToMinutes(block.timeStart);
  const end = parseMealTimeToMinutes(block.timeEnd);
  return end > FREE_TIME_START_MINUTES && start < FREE_TIME_END_MINUTES;
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getCompletedRoutineLabels({
  completedItemIds,
  itemsByTier,
}: {
  completedItemIds: string[];
  itemsByTier: Record<number, { id: string; label: string }[]>;
}): string[] {
  const allItems = Object.values(itemsByTier).flat();
  const idToLabel = new Map(allItems.map((i) => [i.id, i.label]));
  return completedItemIds
    .map((id) => idToLabel.get(id))
    .filter((label): label is string => !!label);
}

function getRoutineItemsForTier(
  itemsByTier: Record<number, { id: string; label: string }[]>,
  tier: number
): { id: string; label: string }[] {
  return itemsByTier[tier as keyof typeof itemsByTier] ?? [];
}

function RoutineColumns({
  routine,
  itemsByTier,
  onRoutineChange,
}: {
  routine: RoutineProgress | null | undefined;
  itemsByTier: Record<number, { id: string; label: string }[]>;
  onRoutineChange?: (routine: RoutineProgress) => void;
}) {
  const tier = routine?.tier ?? 0;
  const completedIds = new Set(routine?.completedItemIds ?? []);
  const allItems = getRoutineItemsForTier(itemsByTier, tier);
  const completedItems = allItems.filter((i) => completedIds.has(i.id));
  const incompleteItems = allItems.filter((i) => !completedIds.has(i.id));

  if (allItems.length === 0) {
    return null;
  }

  const handleCheck = (itemId: string) => {
    if (!onRoutineChange) {
      return;
    }
    const nextIds = [...(routine?.completedItemIds ?? []), itemId];
    onRoutineChange({
      tier: routine?.tier ?? 0,
      completedItemIds: nextIds,
    });
  };

  return (
    <div className="pt-2 border-t border-thistle/40">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">
            Completed
          </p>
          <ul className="text-sm text-slate-700 space-y-1">
            {completedItems.map((item) => (
              <li key={item.id}>• {item.label}</li>
            ))}
            {completedItems.length === 0 && (
              <li className="text-slate-500">None yet</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">
            To do
          </p>
          <ul className="text-sm text-slate-700 space-y-1">
            {incompleteItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => handleCheck(item.id)}
                  className="rounded border-thistle text-thistle shrink-0"
                />
                {item.label}
              </li>
            ))}
            {incompleteItems.length === 0 && (
              <li className="text-slate-500">All done</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getMealEndTime(meal: Meal): string {
  if (meal.mealTimeEnd) {
    return meal.mealTimeEnd;
  }
  if (!meal.mealTime) {
    return "";
  }
  const startMins = parseMealTimeToMinutes(meal.mealTime);
  const endMins = (startMins + 60) % (24 * 60);
  return formatMinutesToTime(endMins);
}

function getFreeTimeSegments(
  blocksInFreeTime: ScheduleTimeBlock[],
  dinnerAndSnackMeals: Meal[]
): { start: number; end: number }[] {
  const blockIntervals = blocksInFreeTime.map((b) => ({
    start: Math.max(
      parseMealTimeToMinutes(b.timeStart),
      FREE_TIME_START_MINUTES
    ),
    end: Math.min(parseMealTimeToMinutes(b.timeEnd), FREE_TIME_END_MINUTES),
  }));
  const mealIntervals = dinnerAndSnackMeals
    .filter((m) => m.mealTime)
    .map((m) => {
      const start = parseMealTimeToMinutes(m.mealTime);
      const end = parseMealTimeToMinutes(getMealEndTime(m));
      return {
        start: Math.max(start, FREE_TIME_START_MINUTES),
        end: Math.min(end, FREE_TIME_END_MINUTES),
      };
    })
    .filter((o) => o.end > o.start);
  const occupied = [...blockIntervals, ...mealIntervals]
    .filter((o) => o.end > o.start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const o of occupied) {
    const last = merged[merged.length - 1];
    if (last && o.start <= last.end) {
      last.end = Math.max(last.end, o.end);
    } else {
      merged.push({ ...o });
    }
  }

  const segments: { start: number; end: number }[] = [];
  let pos = FREE_TIME_START_MINUTES;
  for (const o of merged) {
    if (o.start > pos) {
      segments.push({ start: pos, end: o.start });
    }
    pos = Math.max(pos, o.end);
  }
  if (pos < FREE_TIME_END_MINUTES) {
    segments.push({ start: pos, end: FREE_TIME_END_MINUTES });
  }
  return segments;
}

interface ScheduleBlockEditFormProps {
  block: ScheduleTimeBlock;
  onSave: (updates: Partial<ScheduleTimeBlock>) => void;
  onCancel: () => void;
  onRemove: () => void;
  formatTimeNow: () => string;
}

function ScheduleBlockEditForm({
  block,
  onSave,
  onCancel,
  onRemove,
  formatTimeNow,
}: ScheduleBlockEditFormProps) {
  const [title, setTitle] = useState(block.title);
  const [notes, setNotes] = useState(block.notes);
  const [timeStart, setTimeStart] = useState(block.timeStart);
  const [timeEnd, setTimeEnd] = useState(block.timeEnd);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    onSave({ title: title.trim(), notes: notes.trim(), timeStart, timeEnd });
  };

  return (
    <div className="space-y-3">
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
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
            <button
              type="button"
              onClick={() => setTimeStart(formatTimeNow())}
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
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
            />
            <button
              type="button"
              onClick={() => setTimeEnd(formatTimeNow())}
              className="px-2 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium shrink-0"
            >
              Now
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-slate-100 text-slate-700 font-medium"
          >
            Cancel
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-red-100 text-red-600 font-medium shrink-0"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function getScheduleForDate(date: string): ScheduleItem[] {
  const d = new Date(date + "T12:00:00");
  const dayNum = d.getDay();
  const dayKeys: DayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayKey = dayKeys[dayNum];
  return RESIDENTIAL_SCHEDULE[dayKey] ?? [];
}

interface RoutineProgress {
  tier: 0 | 1 | 2;
  completedItemIds: string[];
}

interface DayScheduleDisplayProps {
  date: string;
  meals?: Meal[];
  onMealsChange?: (meals: Meal[]) => void;
  onScheduleChoice?: (itemId: string, choiceText: string) => void;
  scheduleBlocks?: ScheduleTimeBlock[];
  onScheduleBlocksChange?: (blocks: ScheduleTimeBlock[]) => void;
  weekendWakeupTime?: string | null;
  weekendLunchTime?: string | null;
  weekendDinnerTime?: string | null;
  onWeekendTimesChange?: (updates: {
    weekendWakeupTime?: string | null;
    weekendLunchTime?: string | null;
    weekendDinnerTime?: string | null;
  }) => void;
  morningRoutine?: RoutineProgress | null;
  bedtimeRoutine?: RoutineProgress | null;
  onMorningRoutineChange?: (routine: RoutineProgress) => void;
  onBedtimeRoutineChange?: (routine: RoutineProgress) => void;
}

function isWeekend(date: string): boolean {
  const d = new Date(date + "T12:00:00");
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function DayScheduleDisplay({
  date,
  meals,
  onMealsChange,
  onScheduleChoice,
  scheduleBlocks = [],
  onScheduleBlocksChange,
  weekendWakeupTime,
  weekendLunchTime,
  weekendDinnerTime,
  onWeekendTimesChange,
  morningRoutine,
  bedtimeRoutine,
  onMorningRoutineChange,
  onBedtimeRoutineChange,
}: DayScheduleDisplayProps) {
  const [logs, setLogs] = useState<Record<string, GroupLog>>({});
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [cupsOfTea, setCupsOfTea] = useState(0);
  const [editingNotesForItemId, setEditingNotesForItemId] = useState<
    string | null
  >(null);
  const [editingGroupForItemId, setEditingGroupForItemId] = useState<
    string | null
  >(null);
  const [editingTakeMeds, setEditingTakeMeds] = useState(false);
  const [editingScheduleBlockId, setEditingScheduleBlockId] = useState<
    string | null
  >(null);
  const [showFreeTimeAddActivity, setShowFreeTimeAddActivity] = useState(false);
  const [freeTimeActivityTitle, setFreeTimeActivityTitle] = useState("");
  const [freeTimeActivityNotes, setFreeTimeActivityNotes] = useState("");
  const [freeTimeActivityStart, setFreeTimeActivityStart] = useState(
    () =>
      `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`
  );
  const [freeTimeActivityEnd, setFreeTimeActivityEnd] = useState(
    () =>
      `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`
  );

  const baseItems = getScheduleForDate(date).filter(
    (item) => item.options[0]?.name !== "Free Time"
  );
  const hasPhpSchedule = baseItems.length > 0;
  const showExtended = true;
  const showMorningBlocks = true;
  const lunchMeals = (meals ?? []).filter((m) => m.mealType === "lunch");

  useEffect(() => {
    const dayLog = getDayLog({ date });
    setLogs(dayLog?.logs ?? {});
    setCupsOfTea(dayLog?.cupsOfTea ?? 0);
  }, [date]);

  const handleLogChange = (itemId: string, update: Partial<GroupLog>) => {
    const current = logs[itemId] ?? {
      itemId,
      attended: false,
      notes: "",
    };
    const next = { ...logs, [itemId]: { ...current, ...update } };
    setLogs(next);
    saveDayLog({ date, logs: next });
  };

  const handleChoice = (
    itemId: string,
    item: ScheduleItem,
    chosenIndex: number
  ) => {
    const opt = item.options[chosenIndex];
    if (opt) {
      const choiceText = formatOption(opt);
      onScheduleChoice?.(itemId, `Chose: ${choiceText}`);
    }
  };

  const canAddMeals = onMealsChange !== undefined;

  const handleAddMealInBlock = (
    mealType: MealType,
    initialMealTime?: string | null
  ) => {
    if (!onMealsChange) {
      return;
    }
    const isExpandedForType =
      expandedMeal?.mealType === mealType && expandedMealId !== null;
    if (isExpandedForType) {
      setExpandedMealId(null);
      return;
    }
    const newMeal = createMeal({
      mealType,
      mealTime: initialMealTime ?? null,
    });
    onMealsChange([...(meals ?? []), newMeal]);
    setExpandedMealId(newMeal.id);
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    if (onMealsChange) {
      onMealsChange(
        (meals ?? []).map((m) => (m.id === id ? { ...m, ...updates } : m))
      );
    }
  };

  const removeMeal = (id: string) => {
    if (onMealsChange) {
      onMealsChange((meals ?? []).filter((m) => m.id !== id));
    }
    if (expandedMealId === id) {
      setExpandedMealId(null);
    }
  };

  const updateScheduleBlock = (
    id: string,
    updates: Partial<ScheduleTimeBlock>
  ) => {
    if (onScheduleBlocksChange) {
      onScheduleBlocksChange(
        (scheduleBlocks ?? []).map((b) =>
          b.id === id ? { ...b, ...updates } : b
        )
      );
    }
  };

  const removeScheduleBlock = (id: string) => {
    if (onScheduleBlocksChange) {
      onScheduleBlocksChange(
        (scheduleBlocks ?? []).filter((b) => b.id !== id)
      );
    }
    if (editingScheduleBlockId === id) {
      setEditingScheduleBlockId(null);
    }
  };

  const formatTimeNow = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const expandedMeal = (meals ?? []).find((m) => m.id === expandedMealId);
  const isWeekendDay = isWeekend(date);

  const buttonClass =
    "rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium transition-colors";

  const handleDrinkTea = () => {
    const next = incrementCupsOfTea({ date });
    setCupsOfTea(next);
  };

  const handleDecrementTea = () => {
    const next = decrementCupsOfTea({ date });
    setCupsOfTea(next);
  };

  const renderTeaCounter = () => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrementTea}
        disabled={cupsOfTea <= 0}
        className="w-8 h-8 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 font-medium flex items-center justify-center"
      >
        −
      </button>
      <span className="text-sm font-medium text-slate-800 min-w-[2ch]">
        {cupsOfTea} cup{cupsOfTea !== 1 ? "s" : ""}
      </span>
      <button
        type="button"
        onClick={handleDrinkTea}
        className="w-8 h-8 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium flex items-center justify-center"
      >
        +
      </button>
    </div>
  );

  const renderDrinkTeaButton = () => (
    <button
      type="button"
      onClick={handleDrinkTea}
      className={`px-3 py-2 text-sm ${buttonClass}`}
    >
      Drink cup of tea
    </button>
  );

  const takeMedsLog = logs["take-meds"] ?? {
    itemId: "take-meds",
    attended: false,
    notes: "",
  };

  const takeMedsDisplayTime = takeMedsLog.recordedTime
    ? formatMealTimeForDisplay(takeMedsLog.recordedTime)
    : "7:00 AM";
  const takeMedsShowEditor = !takeMedsLog.attended || editingTakeMeds;

  const renderTakeMedsBlock = () => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <p className="font-mono text-sm font-extrabold text-slate-600">{takeMedsDisplayTime}</p>
        <p className="font-extrabold text-slate-800">Take meds</p>
      </div>
      <div className="flex flex-col gap-3 shrink-0">
        {takeMedsShowEditor ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleLogChange("take-meds", {
                    ...takeMedsLog,
                    recordedTime: "07:00",
                  })
                }
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                7am (planned)
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const v = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                  handleLogChange("take-meds", {
                    ...takeMedsLog,
                    recordedTime: v,
                  });
                }}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                Now
              </button>
              <input
                type="time"
                value={takeMedsLog.recordedTime ?? ""}
                onChange={(e) =>
                  handleLogChange("take-meds", {
                    ...takeMedsLog,
                    recordedTime: e.target.value || undefined,
                  })
                }
                className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const time = takeMedsLog.recordedTime ?? "07:00";
                handleLogChange("take-meds", {
                  ...takeMedsLog,
                  attended: true,
                  recordedTime: time,
                });
                setEditingTakeMeds(false);
              }}
              className="px-3 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium w-fit"
            >
              Mark taken
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditingTakeMeds(true)}
            className="px-3 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium w-fit"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );

  const handleNowClick = (field: "weekendWakeupTime" | "weekendLunchTime" | "weekendDinnerTime") => {
    const now = new Date();
    const v = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    onWeekendTimesChange?.({ [field]: v });
  };

  const renderTimeRow = (
    field: "weekendWakeupTime" | "weekendLunchTime" | "weekendDinnerTime",
    value: string
  ) => (
    <div className="flex items-center gap-2">
      <input
        type="time"
        value={value}
        onChange={(e) =>
          onWeekendTimesChange?.({ [field]: e.target.value || null })
        }
        className="px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
      />
      <button
        type="button"
        onClick={() => handleNowClick(field)}
        className={`px-3 py-2 text-sm ${buttonClass}`}
      >
        Now
      </button>
    </div>
  );

  const renderMealSummaries = (
    mealsToShow: Meal[],
    blockClassName = "rounded-lg border border-thistle/40 p-3 bg-white/60",
    options?: { onEdit?: (meal: Meal) => void }
  ) => {
    if (mealsToShow.length === 0) {
      return null;
    }
    return (
      <div className="mt-3 pt-2 border-t border-thistle/40 space-y-2">
        {mealsToShow.map((meal) => (
          <div
            key={meal.id}
            className={`${blockClassName} flex items-start justify-between gap-3`}
          >
            <MealSummaryContent meal={meal} />
            {options?.onEdit && canAddMeals && (
              <button
                type="button"
                onClick={() => options.onEdit?.(meal)}
                className={`shrink-0 px-3 py-1.5 text-sm ${buttonClass}`}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBlockAddMeal = (
    mealType: MealType,
    label: string,
    extraButtons?: React.ReactNode,
    initialMealTime?: string | null,
    summaryBlockClassName?: string
  ) => {
    const isExpanded =
      expandedMeal?.mealType === mealType && expandedMealId !== null;
    const mealsOfType = (meals ?? []).filter((m) => m.mealType === mealType);
    const hideAddWhenMealExists =
      (mealType === "breakfast" || mealType === "lunch") &&
      mealsOfType.length > 0;
    const showAddButton = canAddMeals && !hideAddWhenMealExists;
    return (
      <div className="mt-3 space-y-3">
        {showAddButton && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                handleAddMealInBlock(mealType, initialMealTime)
              }
              className={`px-3 py-2 text-sm ${buttonClass}`}
            >
              + Add meal ({label})
            </button>
            {extraButtons}
          </div>
        )}
        {isExpanded && expandedMeal && (
          <div className="pt-2 border-t border-thistle/40">
            <MealLog
              meal={expandedMeal}
              onUpdate={(updates) => updateMeal(expandedMeal.id, updates)}
              onRemove={() => removeMeal(expandedMeal.id)}
              onSaveSuccess={() => setExpandedMealId(null)}
            />
          </div>
        )}
        {renderMealSummaries(
          mealsOfType,
          summaryBlockClassName ??
            "rounded-lg border border-thistle/40 p-3 bg-white/60",
          {
            onEdit: (meal) => setExpandedMealId(meal.id),
          }
        )}
      </div>
    );
  };

  if (isWeekendDay) {
    return (
      <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-semibold">Daily schedule</h2>
            <p className="text-sm text-slate-600">Weekend</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Tea today:</span>
            {renderTeaCounter()}
          </div>
        </div>
        <ul className="space-y-4">
          <li className="rounded-lg p-4 bg-icy-blue/40 border border-icy-blue/60">
            <p className="font-extrabold text-slate-800 mb-3">Morning</p>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Wakeup time
            </label>
            {renderTimeRow(
              "weekendWakeupTime",
              weekendWakeupTime ?? ""
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/routine/morning"
                className={`inline-flex px-4 py-2 text-sm ${buttonClass}`}
              >
                Morning routine →
              </Link>
              {renderDrinkTeaButton()}
            </div>
            {renderBlockAddMeal(
              "breakfast",
              "Breakfast",
              undefined,
              weekendWakeupTime ?? "08:00",
              "rounded-lg border border-sky-blue/50 p-3 bg-sky-blue/20"
            )}
            <RoutineColumns
              routine={morningRoutine}
              itemsByTier={MORNING_ROUTINE_ITEMS}
              onRoutineChange={onMorningRoutineChange}
            />
          </li>
          <li className="rounded-lg p-4 bg-pastel-petal/30 border border-pastel-petal/50">
            <p className="font-extrabold text-slate-800 mb-3">Lunch</p>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Meal time
            </label>
            {renderTimeRow("weekendLunchTime", weekendLunchTime ?? "")}
            {lunchMeals.length === 0 && canAddMeals && (
              <button
                type="button"
                onClick={() =>
                  handleAddMealInBlock("lunch", weekendLunchTime)
                }
                className={`px-3 py-2 text-sm ${buttonClass}`}
              >
                + Add meal (Lunch)
              </button>
            )}
            {expandedMeal?.mealType === "lunch" && expandedMeal && (
              <div className="pt-2 border-t border-thistle/40">
                <MealLog
                  meal={expandedMeal}
                  onUpdate={(u) => updateMeal(expandedMeal.id, u)}
                  onRemove={() => removeMeal(expandedMeal.id)}
                  onSaveSuccess={() => setExpandedMealId(null)}
                />
              </div>
            )}
          </li>
          <li className="rounded-lg p-4 bg-sky-blue/30 border border-sky-blue/50">
            <p className="font-extrabold text-slate-800 mb-3">Dinner</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dinner time
                </label>
                {renderTimeRow("weekendDinnerTime", weekendDinnerTime ?? "")}
              </div>
              <div className="flex flex-wrap gap-3">
                {canAddMeals && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAddMealInBlock("dinner", weekendDinnerTime)
                    }
                    className={`px-3 py-2 text-sm ${buttonClass}`}
                  >
                    + Add meal (Dinner)
                  </button>
                )}
                <Link
                  href="/routine/bedtime"
                  className={`inline-flex px-4 py-2 text-sm ${buttonClass}`}
                >
                  Routine
                </Link>
              </div>
            </div>
            {expandedMeal?.mealType === "dinner" && expandedMeal && (
              <div className="mt-3 pt-2 border-t border-thistle/40">
                <MealLog
                  meal={expandedMeal}
                  onUpdate={(u) => updateMeal(expandedMeal.id, u)}
                  onRemove={() => removeMeal(expandedMeal.id)}
                  onSaveSuccess={() => setExpandedMealId(null)}
                />
              </div>
            )}
          </li>
        </ul>
      </section>
    );
  }

  if (baseItems.length === 0 && !showExtended) {
    return (
      <section className="p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
        <h2 className="text-xl font-semibold mb-4">Daily schedule</h2>
        {showMorningBlocks && (
          <ul className="space-y-4 mb-4">
            <li className="rounded-lg p-4 bg-pastel-petal/30 border border-pastel-petal/50">
              {renderTakeMedsBlock()}
            </li>
            <li className="rounded-lg p-4 bg-icy-blue/40 border border-icy-blue/60">
              <p className="font-mono text-sm font-extrabold text-slate-600">8:00 AM</p>
              <p className="font-extrabold text-slate-800">Wakeup</p>
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/routine/morning"
                    className={`inline-flex px-4 py-2 text-sm ${buttonClass}`}
                  >
                    Morning routine →
                  </Link>
                  {renderDrinkTeaButton()}
                </div>
                {renderBlockAddMeal(
                  "breakfast",
                  "Breakfast",
                  undefined,
                  "08:00",
                  "rounded-lg border border-sky-blue/50 p-3 bg-sky-blue/20"
                )}
                <RoutineColumns
                  routine={morningRoutine}
                  itemsByTier={MORNING_ROUTINE_ITEMS}
                  onRoutineChange={onMorningRoutineChange}
                />
              </div>
            </li>
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-slate-600">No PHP groups scheduled.</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Tea today:</span>
            {renderTeaCounter()}
          </div>
        </div>
      </section>
    );
  }

  const freeTimeLog = logs["free-time"] ?? {
    itemId: "free-time",
    attended: false,
    notes: "",
  };

  const departItem = baseItems.find((i) => i.options[0]?.name === "Depart");
  const departLog = departItem ? logs[departItem.id] : null;
  const departRecordedMinutes =
    departLog?.attended && departLog?.recordedTime
      ? parseMealTimeToMinutes(departLog.recordedTime)
      : null;

  const dinnerAndSnackMeals = (meals ?? []).filter(
    (m) =>
      (m.mealType === "dinner" || m.mealType === "snack") && m.mealTime
  );

  const blocksInFreeTime = (scheduleBlocks ?? []).filter(blockOverlapsFreeTime);
  const blocksOutsideFreeTime = (scheduleBlocks ?? []).filter(
    (b) => !blockOverlapsFreeTime(b)
  );

  const timelineEntries: Array<
    | { type: "php"; item: ScheduleItem; sortOrder: number }
    | { type: "meal"; meal: Meal; sortOrder: number }
    | { type: "scheduleBlock"; block: ScheduleTimeBlock; sortOrder: number }
    | { type: "takeMeds"; sortOrder: number }
    | { type: "wakeup"; sortOrder: number }
    | { type: "freeTime"; sortOrder: number }
  > = [
    {
      type: "takeMeds" as const,
      sortOrder: parseMealTimeToMinutes(
        takeMedsLog.recordedTime ?? "07:00"
      ),
    },
    ...(showMorningBlocks
      ? [{ type: "wakeup" as const, sortOrder: 8 * 60 }]
      : []),
    ...baseItems.map((item) => {
      const isDepartItem = item.options[0]?.name === "Depart";
      const departLog = isDepartItem ? logs[item.id] : null;
      const departTime = departLog?.recordedTime;
      const sortOrder = isDepartItem && departTime
        ? parseMealTimeToMinutes(departTime)
        : parseScheduleTimeToMinutes(item.time);
      return {
        type: "php" as const,
        item,
        sortOrder,
      };
    }),
    ...dinnerAndSnackMeals.map((meal) => ({
      type: "meal" as const,
      meal,
      sortOrder: parseMealTimeToMinutes(meal.mealTime),
    })),
    ...blocksOutsideFreeTime.map((block) => ({
      type: "scheduleBlock" as const,
      block,
      sortOrder: parseMealTimeToMinutes(block.timeStart),
    })),
    ...blocksInFreeTime.map((block) => ({
      type: "scheduleBlock" as const,
      block,
      sortOrder: parseMealTimeToMinutes(block.timeStart),
    })),
    { type: "freeTime" as const, sortOrder: FREE_TIME_START_MINUTES },
  ];
  timelineEntries.sort((a, b) => a.sortOrder - b.sortOrder);

  const blockExtendsToFreeTimeEnd = (block: ScheduleTimeBlock): boolean => {
    const endMins = parseMealTimeToMinutes(block.timeEnd);
    return endMins >= FREE_TIME_END_MINUTES;
  };

  const timelineBeforeFreeTime = timelineEntries.filter(
    (e) =>
      e.type !== "scheduleBlock" ||
      !blocksInFreeTime.some((b) => b.id === e.block.id) ||
      !blockExtendsToFreeTimeEnd(e.block)
  );
  const timelineAfterFreeTime = timelineEntries.filter(
    (e) =>
      e.type === "scheduleBlock" &&
      blocksInFreeTime.some((b) => b.id === e.block.id) &&
      blockExtendsToFreeTimeEnd(e.block)
  );

  return (
    <section className="rounded-xl border-2 border-thistle/60 bg-white/80 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Daily schedule</h2>
          <p className="text-sm text-slate-600">Hopeway Residential Track #1</p>
        </div>
        <div className="flex items-center gap-2">
          {onScheduleBlocksChange && (
            <CalendarSyncButton
              date={date}
              scheduleBlocks={scheduleBlocks ?? []}
              onScheduleBlocksChange={(blocks) =>
                onScheduleBlocksChange(blocks)
              }
            />
          )}
          <span className="text-sm text-slate-600">Tea today:</span>
          {renderTeaCounter()}
        </div>
      </div>
      <ul className="space-y-4">
        {timelineBeforeFreeTime.map((entry) => {
          if (entry.type === "takeMeds") {
            return (
              <li
                key="take-meds"
                className="rounded-lg p-4 bg-pastel-petal/30 border border-pastel-petal/50"
              >
                {renderTakeMedsBlock()}
              </li>
            );
          }
          if (entry.type === "wakeup") {
            const morningLabels =
              morningRoutine?.completedItemIds?.length
                ? getCompletedRoutineLabels({
                    completedItemIds: morningRoutine.completedItemIds,
                    itemsByTier: MORNING_ROUTINE_ITEMS,
                  })
                : [];
            return (
              <li
                key="wakeup"
                className="rounded-lg p-4 bg-icy-blue/40 border border-icy-blue/60"
              >
                <p className="font-mono text-sm font-extrabold text-slate-600">
                  8:00 AM
                </p>
                <p className="font-extrabold text-slate-800">Wakeup</p>
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/routine/morning"
                      className={`inline-flex px-4 py-2 text-sm ${buttonClass}`}
                    >
                      Morning routine →
                    </Link>
                    {renderDrinkTeaButton()}
                  </div>
                  <RoutineColumns
                    routine={morningRoutine}
                    itemsByTier={MORNING_ROUTINE_ITEMS}
                    onRoutineChange={onMorningRoutineChange}
                  />
                </div>
              </li>
            );
          }
          if (entry.type === "freeTime") {
            if (!showExtended) {
              return null;
            }
            return (
              <li
                key="free-time"
                className="rounded-lg p-4 bg-sky-blue/30 border border-sky-blue/50"
              >
                <p className="font-mono text-sm font-extrabold text-slate-600">
                  4:00 PM – 9:00 PM
                </p>
                <p className="font-extrabold text-slate-800">Free time</p>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    What did you spend your time doing?
                  </label>
                  <textarea
                    value={freeTimeLog.notes}
                    onChange={(e) =>
                      handleLogChange("free-time", {
                        ...freeTimeLog,
                        notes: e.target.value,
                      })
                    }
                    placeholder="e.g. rest, TV, walk, reading..."
                    className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px]"
                    rows={2}
                  />
                </div>
                {onScheduleBlocksChange && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFreeTimeAddActivity((p) => !p)}
                      className={`px-3 py-2 text-sm ${buttonClass}`}
                    >
                      {showFreeTimeAddActivity
                        ? "Close activity"
                        : "+ Add activity"}
                    </button>
                    <Link
                      href="/self-care"
                      className="text-sm text-slate-600 hover:text-thistle hover:underline"
                    >
                      Need activities?
                    </Link>
                  </div>
                )}
                {showFreeTimeAddActivity && onScheduleBlocksChange && (
                  <div className="mt-3 rounded-lg border-2 border-thistle/40 p-4 bg-white/60 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => setShowFreeTimeAddActivity(false)}
                      className="absolute top-3 right-3 text-sm text-slate-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                    <input
                      type="text"
                      value={freeTimeActivityTitle}
                      onChange={(e) => setFreeTimeActivityTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                    />
                    <textarea
                      value={freeTimeActivityNotes}
                      onChange={(e) =>
                        setFreeTimeActivityNotes(e.target.value)
                      }
                      placeholder="Notes"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                    />
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-0.5">
                          Start
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="time"
                            value={freeTimeActivityStart}
                            onChange={(e) =>
                              setFreeTimeActivityStart(e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFreeTimeActivityStart(formatTimeNow())
                            }
                            className={`px-2 py-2 text-sm shrink-0 ${buttonClass}`}
                          >
                            Now
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-0.5">
                          End
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="time"
                            value={freeTimeActivityEnd}
                            onChange={(e) =>
                              setFreeTimeActivityEnd(e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFreeTimeActivityEnd(formatTimeNow())
                            }
                            className={`px-2 py-2 text-sm shrink-0 ${buttonClass}`}
                          >
                            Now
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!freeTimeActivityTitle.trim()) {
                            return;
                          }
                          const newBlock: ScheduleTimeBlock = {
                            id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                            title: freeTimeActivityTitle.trim(),
                            notes: freeTimeActivityNotes.trim(),
                            timeStart: freeTimeActivityStart,
                            timeEnd: freeTimeActivityEnd,
                          };
                          onScheduleBlocksChange([
                            ...(scheduleBlocks ?? []),
                            newBlock,
                          ]);
                          setFreeTimeActivityTitle("");
                          setFreeTimeActivityNotes("");
                          setFreeTimeActivityStart(formatTimeNow());
                          setFreeTimeActivityEnd(formatTimeNow());
                          setShowFreeTimeAddActivity(false);
                        }}
                        disabled={!freeTimeActivityTitle.trim()}
                        className={`px-4 py-2 text-sm ${buttonClass}`}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFreeTimeAddActivity(false)}
                        className="px-4 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-slate-100 text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          }
          if (entry.type === "meal") {
            const meal = entry.meal;
            return (
              <li
                key={`meal-${meal.id}`}
                className="rounded-lg p-4 bg-sky-blue/20 border border-sky-blue/50"
              >
                <div className="mt-0 pt-0">
                  <div className="rounded-lg border border-thistle/40 p-3 bg-white/60">
                    <MealSummaryContent meal={meal} />
                  </div>
                </div>
              </li>
            );
          }
          if (entry.type === "scheduleBlock") {
            const block = entry.block;
            const isCalendarBlock = block.source === "calendar";
            const isEditing = editingScheduleBlockId === block.id;

            if (isCalendarBlock) {
              return (
                <li key={`block-${block.id}`}>
                  <CalendarImportedBlock
                    block={block}
                    onUpdate={(updates) => updateScheduleBlock(block.id, updates)}
                    onRemove={() => removeScheduleBlock(block.id)}
                    formatTimeNow={formatTimeNow}
                    formatTimeForDisplay={formatMealTimeForDisplay}
                    buttonClass={buttonClass}
                  />
                </li>
              );
            }

            return (
              <li
                key={`block-${block.id}`}
                className="rounded-lg p-4 bg-thistle/30 border border-thistle/50"
              >
                {isEditing ? (
                  <ScheduleBlockEditForm
                    block={block}
                    onSave={(updates) => {
                      updateScheduleBlock(block.id, updates);
                      setEditingScheduleBlockId(null);
                    }}
                    onCancel={() => setEditingScheduleBlockId(null)}
                    onRemove={() => removeScheduleBlock(block.id)}
                    formatTimeNow={formatTimeNow}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-extrabold text-slate-600">
                          {formatMealTimeForDisplay(block.timeStart)} –{" "}
                          {formatMealTimeForDisplay(block.timeEnd)}
                        </p>
                        <p className="font-extrabold text-slate-800">
                          {block.title}
                        </p>
                        {block.notes && (
                          <p className="text-sm text-slate-600 mt-2">
                            {block.notes}
                          </p>
                        )}
                      </div>
                      {onScheduleBlocksChange && (
                        <button
                          type="button"
                          onClick={() =>
                            setEditingScheduleBlockId(block.id)
                          }
                          className="shrink-0 px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          }
          const item = entry.item;
          const isBreakfast =
            item.isBreak && item.options[0]?.name === "Breakfast";
          const isLunch =
            item.isBreak && item.options[0]?.name === "Lunch";
          const isDinner =
            item.isBreak && item.options[0]?.name === "Dinner";
          const isCoffeeBreak =
            item.isBreak && item.options[0]?.name === "Coffee Break";
          const isDepart = item.options[0]?.name === "Depart";
          const blockMinutes = parseScheduleTimeToMinutes(item.time);
          const isMissed =
            departRecordedMinutes !== null &&
            !isDepart &&
            blockMinutes >= departRecordedMinutes;
          const log = logs[item.id] ?? {
            attended: false,
            notes: "",
            chosenOptionIndex: item.options.length > 1 ? undefined : 0,
          };
          const hasMultipleOptions = item.options.length > 1;
          const isGroupSaved =
            hasMultipleOptions &&
            log.attended &&
            log.chosenOptionIndex !== undefined;
          const isEditingGroup = editingGroupForItemId === item.id;
          return (
            <li
              key={item.id}
              className={`rounded-lg p-4 ${
                item.isBreak
                  ? "bg-icy-blue/40 border border-icy-blue/60"
                  : "bg-pastel-petal/30 border border-pastel-petal/50"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm font-extrabold text-slate-600">
                    {isDepart && log.recordedTime
                      ? formatMealTimeForDisplay(log.recordedTime)
                      : item.time}
                  </p>
                  {item.options.length === 1 ? (
                    <>
                      <p className="font-extrabold text-slate-800 flex items-center gap-2 flex-wrap">
                        {isMissed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                            Missed
                          </span>
                        )}
                        {formatOption(item.options[0])}
                      </p>
                      {isDepart && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              handleLogChange(item.id, {
                                ...log,
                                attended: true,
                                recordedTime: "16:00",
                              });
                            }}
                            className="px-3 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
                          >
                            Planned (4pm)
                          </button>
                          <input
                            type="time"
                            value={log.recordedTime ?? ""}
                            onChange={(e) => {
                              const v = e.target.value || undefined;
                              handleLogChange(item.id, {
                                ...log,
                                attended: !!v,
                                recordedTime: v,
                              });
                            }}
                            className="px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const now = new Date();
                              const v = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                              handleLogChange(item.id, {
                                ...log,
                                attended: true,
                                recordedTime: v,
                              });
                            }}
                            className="px-3 py-2 text-sm rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium"
                          >
                            Now
                          </button>
                        </div>
                      )}
                    </>
                  ) : isGroupSaved && !isEditingGroup ? (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="font-extrabold text-slate-800 flex items-center gap-2 flex-wrap">
                        {isMissed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                            Missed
                          </span>
                        )}
                        Chose{" "}
                        {formatOption(
                          item.options[log.chosenOptionIndex ?? 0] ?? item.options[0]
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingGroupForItemId(item.id)}
                        className="text-sm text-thistle hover:underline font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  ) : hasMultipleOptions && isEditingGroup ? (
                    <div className="mt-2">
                      {isMissed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/90 text-white mb-2">
                          Missed
                        </span>
                      )}
                      <p className="text-sm text-slate-600 mb-2">Choose one:</p>
                      <div className="flex flex-wrap gap-3 items-center">
                        {item.options.map((opt, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`${item.id}-option`}
                              checked={log.chosenOptionIndex === idx}
                              onChange={() => {
                                handleLogChange(item.id, {
                                  ...log,
                                  chosenOptionIndex: idx,
                                });
                                handleChoice(item.id, item, idx);
                              }}
                              className="rounded-full border-thistle text-thistle"
                            />
                            <span className="text-sm font-extrabold">{formatOption(opt)}</span>
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingGroupForItemId(null)}
                          className="text-sm text-thistle hover:underline font-medium"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {isMissed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/90 text-white mb-2">
                          Missed
                        </span>
                      )}
                      <p className="text-sm text-slate-600 mb-2">Choose one:</p>
                      <div className="flex flex-wrap gap-3">
                        {item.options.map((opt, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`${item.id}-option`}
                              checked={log.chosenOptionIndex === idx}
                              onChange={() => {
                                handleLogChange(item.id, {
                                  ...log,
                                  chosenOptionIndex: idx,
                                });
                                handleChoice(item.id, item, idx);
                              }}
                              className="rounded-full border-thistle text-thistle"
                            />
                            <span className="text-sm font-extrabold">{formatOption(opt)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {(!item.isBreak && !isDepart) || isDepart || isMissed ? (
                  <div className="flex items-center gap-2 shrink-0">
                    {isMissed ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (editingNotesForItemId === item.id) {
                            setEditingNotesForItemId(null);
                          } else {
                            setEditingNotesForItemId(item.id);
                          }
                        }}
                        className={`px-3 py-2 text-sm ${buttonClass}`}
                      >
                        {editingNotesForItemId === item.id ? "Save" : "Edit"}
                      </button>
                    ) : isDepart ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (log.attended && editingNotesForItemId === item.id) {
                            setEditingNotesForItemId(null);
                          } else if (log.attended) {
                            setEditingNotesForItemId(item.id);
                          } else {
                            const time = log.recordedTime ?? "16:00";
                            handleLogChange(item.id, {
                              ...log,
                              attended: true,
                              recordedTime: time,
                            });
                            setEditingNotesForItemId(item.id);
                          }
                        }}
                        className={`px-3 py-2 text-sm ${buttonClass}`}
                      >
                        {log.attended
                          ? editingNotesForItemId === item.id
                            ? "Save"
                            : "Edit note"
                          : "Mark left and save note"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                        if (log.attended && editingNotesForItemId === item.id) {
                          setEditingNotesForItemId(null);
                          setEditingGroupForItemId(null);
                        } else if (log.attended) {
                          setEditingNotesForItemId(item.id);
                        } else {
                          handleLogChange(item.id, {
                            ...log,
                            attended: true,
                          });
                          setEditingNotesForItemId(null);
                          setEditingGroupForItemId(null);
                        }
                      }}
                        className={`px-3 py-2 text-sm ${buttonClass}`}
                      >
                      {log.attended
                        ? editingNotesForItemId === item.id
                          ? "Save"
                          : "Edit note"
                          : "Mark Attended and Save note"}
                        </button>
                    )}
                  </div>
                ) : null}
              </div>
              {isBreakfast ? (
                renderBlockAddMeal(
                  "breakfast",
                  "Breakfast",
                  undefined,
                  "08:00",
                  "rounded-lg border border-sky-blue/50 p-3 bg-sky-blue/20"
                )
              ) : isLunch ? (
                renderBlockAddMeal("lunch", "Lunch")
              ) : isDinner ? (
                renderBlockAddMeal("dinner", "Dinner", undefined, "18:00")
              ) : isMissed ? (
                editingNotesForItemId === item.id && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Note
                    </label>
                    <textarea
                      value={log.notes}
                      onChange={(e) =>
                        handleLogChange(item.id, {
                          ...log,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Optional note about missed block..."
                      className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm min-h-[60px]"
                      rows={2}
                    />
                  </div>
                )
              ) : (
                !item.isBreak && (
                  <div className="mt-3">
                    {editingNotesForItemId === item.id ? (
                      <>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={log.notes}
                          onChange={(e) =>
                            handleLogChange(item.id, {
                              ...log,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Add notes..."
                          className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm min-h-[60px]"
                          rows={2}
                        />
                      </>
                    ) : log.attended && log.notes ? (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {log.notes}
                      </p>
                    ) : log.attended ? (
                      <button
                        type="button"
                        onClick={() => setEditingNotesForItemId(item.id)}
                        className="text-sm text-thistle hover:underline"
                      >
                        Add note
                      </button>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={log.notes}
                          onChange={(e) =>
                            handleLogChange(item.id, {
                              ...log,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Add notes..."
                          className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm min-h-[60px]"
                          rows={2}
                        />
                      </>
                    )}
                  </div>
                )
              )}
              {item.isBreak &&
                item.options[0]?.name !== "Lunch" &&
                item.options[0]?.name !== "Breakfast" &&
                item.options[0]?.name !== "Dinner" &&
                !isMissed && (
                <div className="mt-3 space-y-3">
                  {isCoffeeBreak && (
                    <div>{renderDrinkTeaButton()}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={log.notes}
                      onChange={(e) =>
                        handleLogChange(item.id, {
                          ...log,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 text-sm min-h-[60px]"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}

        {showExtended && timelineAfterFreeTime.map((entry) => {
              if (entry.type !== "scheduleBlock") {
                return null;
              }
              const block = entry.block;
              if (block.source === "calendar") {
                return (
                  <li key={`block-${block.id}`}>
                    <CalendarImportedBlock
                      block={block}
                      onUpdate={(updates) =>
                        updateScheduleBlock(block.id, updates)
                      }
                      onRemove={() => removeScheduleBlock(block.id)}
                      formatTimeNow={formatTimeNow}
                      formatTimeForDisplay={formatMealTimeForDisplay}
                      buttonClass={buttonClass}
                    />
                  </li>
                );
              }
              const isEditing = editingScheduleBlockId === block.id;
              return (
                <li
                  key={`block-${block.id}`}
                  className="rounded-lg p-4 bg-thistle/30 border border-thistle/50"
                >
                  {isEditing ? (
                    <ScheduleBlockEditForm
                      block={block}
                      onSave={(updates) => {
                        updateScheduleBlock(block.id, updates);
                        setEditingScheduleBlockId(null);
                      }}
                      onCancel={() => setEditingScheduleBlockId(null)}
                      onRemove={() => removeScheduleBlock(block.id)}
                      formatTimeNow={formatTimeNow}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-extrabold text-slate-600">
                            {formatMealTimeForDisplay(block.timeStart)} –{" "}
                            {formatMealTimeForDisplay(block.timeEnd)}
                          </p>
                          <p className="font-extrabold text-slate-800">
                            {block.title}
                          </p>
                          {block.notes && (
                            <p className="text-sm text-slate-600 mt-2">
                              {block.notes}
                            </p>
                          )}
                        </div>
                        {onScheduleBlocksChange && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditingScheduleBlockId(block.id)
                            }
                            className="shrink-0 px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
        <li className="rounded-lg p-4 bg-icy-blue/40 border border-icy-blue/60">
          <p className="font-mono text-sm text-slate-600">10:00 PM</p>
          <p className="font-extrabold text-slate-800">Bedtime</p>
          <div className="mt-3 space-y-3">
            <Link
              href="/routine/bedtime"
              className={`inline-flex px-4 py-2 text-sm ${buttonClass}`}
            >
              Open bedtime routine →
            </Link>
            <RoutineColumns
              routine={bedtimeRoutine}
              itemsByTier={BEDTIME_ROUTINE_ITEMS}
              onRoutineChange={onBedtimeRoutineChange}
            />
          </div>
        </li>
      </ul>
    </section>
  );
}

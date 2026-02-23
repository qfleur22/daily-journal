"use client";

import { useState } from "react";
import { type Meal, type MealType } from "@/models/day-entry";

const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

const FOOD_WIN_ITEMS: { key: keyof Meal["foodWins"]; label: string }[] = [
  { key: "calories", label: "calories" },
  { key: "protein", label: "protein" },
  { key: "salt", label: "salt" },
  { key: "usedSafeFood", label: "used safe food" },
  { key: "drinkableOption", label: "drinkable option" },
  { key: "hadAtLeast2Bites", label: "had at least 2 bites" },
  { key: "ateUntilFull", label: "ate until full" },
];

interface MealLogProps {
  meal: Meal;
  onUpdate: (updates: Partial<Meal>) => void;
  onRemove?: () => void;
  onSaveSuccess?: () => void;
}

export function MealLog({
  meal,
  onUpdate,
  onRemove,
  onSaveSuccess,
}: MealLogProps) {
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleSave = () => {
    onUpdate({
      whatIAte: meal.whatIAte,
      whatIDrank: meal.whatIDrank ?? "",
      caffeinated: meal.caffeinated ?? false,
      mealTime: meal.mealTime ?? null,
      mealTimeEnd: meal.mealTimeEnd ?? null,
    });
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onSaveSuccess?.();
    }, 500);
  };

  const handleFoodWinToggle = (key: keyof Meal["foodWins"]) => {
    onUpdate({
      foodWins: {
        ...meal.foodWins,
        [key]: !meal.foodWins[key],
      },
    });
  };

  return (
    <div className="rounded-lg border-2 border-pastel-petal/50 bg-white/60 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={meal.mealType ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onUpdate({ mealType: (v === "" ? null : v) as MealType | null });
          }}
          className="px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-white/80 font-medium text-sm"
        >
          <option value="">Select meal</option>
          {MEAL_TYPE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Time</label>
            {meal.mealType === "lunch" && (
              <button
                type="button"
                onClick={() => onUpdate({ mealTime: "12:00", mealTimeEnd: "13:00" })}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                Noon (planned)
              </button>
            )}
            {meal.mealType === "dinner" && (
              <button
                type="button"
                onClick={() => {
                  onUpdate({ mealTime: "17:30", mealTimeEnd: "18:30" });
                }}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                5:30–6:30 (planned)
              </button>
            )}
            {meal.mealType === "snack" && (
              <button
                type="button"
                onClick={() => onUpdate({ mealTime: "16:00" })}
                className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
              >
                4pm (planned)
              </button>
            )}
            <input
              type="time"
              value={meal.mealTime ?? ""}
              onChange={(e) => onUpdate({ mealTime: e.target.value || null })}
              className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const h = String(now.getHours()).padStart(2, "0");
                const m = String(now.getMinutes()).padStart(2, "0");
                const start = `${h}:${m}`;
                const needsEnd =
                  meal.mealType === "dinner" || meal.mealType === "lunch";
                if (needsEnd) {
                  const endMins =
                    (now.getHours() * 60 + now.getMinutes() + 60) % (24 * 60);
                  const endH = Math.floor(endMins / 60);
                  const endMm = endMins % 60;
                  onUpdate({
                    mealTime: start,
                    mealTimeEnd: `${String(endH).padStart(2, "0")}:${String(endMm).padStart(2, "0")}`,
                  });
                } else {
                  onUpdate({ mealTime: start });
                }
              }}
              className="px-2 py-1 text-xs rounded border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800"
            >
              Now
            </button>
          </div>
          {(meal.mealType === "dinner" || meal.mealType === "lunch") &&
            meal.mealTime && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">End</label>
                <input
                  type="time"
                  value={meal.mealTimeEnd ?? ""}
                  onChange={(e) =>
                    onUpdate({ mealTimeEnd: e.target.value || null })
                  }
                  className="px-2 py-1 rounded border-2 border-thistle/50 bg-white/80 text-sm"
                />
              </div>
            )}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-slate-500 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ARFID/Appetite (0–10)</label>
        <input
          type="range"
          min={0}
          max={10}
          value={meal.arfidAppetite ?? 5}
          onChange={(e) =>
            onUpdate({ arfidAppetite: Number(e.target.value) })
          }
          className="w-full h-3 rounded-lg cursor-pointer accent-thistle"
        />
        <div className="flex gap-1 text-sm text-slate-600">
          <span>0</span>
          <span className="flex-1" />
          <span className="font-medium">{meal.arfidAppetite ?? 5}</span>
          <span className="flex-1" />
          <span>10</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Food wins</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {FOOD_WIN_ITEMS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={meal.foodWins[key] ?? false}
                onChange={() => handleFoodWinToggle(key)}
                className="rounded border-thistle text-thistle"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium flex-1">What I ate</label>
          <button
            type="button"
            onClick={handleSave}
            className="shrink-0 px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
          >
            {saveFeedback ? "Saved!" : "Save"}
          </button>
        </div>
        <textarea
          value={meal.whatIAte}
          onChange={(e) => onUpdate({ whatIAte: e.target.value })}
          placeholder="e.g. ramen, two bites of toast, electrolyte drink..."
          className="w-full px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[60px] text-sm"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">What I drank</label>
        <div className="flex items-start gap-3">
          <textarea
            value={meal.whatIDrank ?? ""}
            onChange={(e) => onUpdate({ whatIDrank: e.target.value })}
            placeholder="e.g. water, tea, coffee..."
            className="flex-1 px-3 py-2 rounded-lg border-2 border-thistle/50 bg-white/80 min-h-[50px] text-sm"
            rows={1}
          />
          <label className="flex items-center gap-2 cursor-pointer text-sm shrink-0 mt-2">
            <input
              type="checkbox"
              checked={meal.caffeinated ?? false}
              onChange={(e) =>
                onUpdate({ caffeinated: e.target.checked })
              }
              className="rounded border-thistle text-thistle"
            />
            Caffeinated
          </label>
        </div>
      </div>
    </div>
  );
}

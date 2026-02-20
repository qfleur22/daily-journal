"use client";

import { useState } from "react";
import { type Meal } from "@/models/day-entry";
import { MealLog } from "@/components/day/meal-log";
import { MealSummaryContent } from "@/components/day/meal-summary";
import { createMeal } from "@/utils/create-meal";

interface MealsSectionProps {
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  editingMealId?: string | null;
  onEditingMealIdChange?: (id: string | null) => void;
}

export function MealsSection({
  meals,
  onMealsChange,
  editingMealId: controlledEditingId,
  onEditingMealIdChange,
}: MealsSectionProps) {
  const [internalEditingId, setInternalEditingId] = useState<string | null>(null);
  const editingMealId =
    controlledEditingId !== undefined ? controlledEditingId : internalEditingId;
  const setEditingMealId =
    onEditingMealIdChange ?? setInternalEditingId;

  const addMeal = () => {
    const newMeal = createMeal({});
    onMealsChange([...meals, newMeal]);
    setEditingMealId(newMeal.id);
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    onMealsChange(
      meals.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const removeMeal = (id: string) => {
    onMealsChange(meals.filter((m) => m.id !== id));
    if (editingMealId === id) {
      setEditingMealId(null);
    }
  };

  const editingMeal = meals.find((m) => m.id === editingMealId);

  return (
    <section className="p-6 rounded-xl border-2 border-thistle/60 bg-white/80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Meals</h2>
        <button
          type="button"
          onClick={addMeal}
          className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 font-medium text-sm"
        >
          + Add meal
        </button>
      </div>

      {editingMeal ? (
        <MealLog
          meal={editingMeal}
          onUpdate={(updates) => updateMeal(editingMeal.id, updates)}
          onRemove={() => removeMeal(editingMeal.id)}
          onSaveSuccess={() => setEditingMealId(null)}
        />
      ) : meals.length === 0 ? (
        <p className="text-slate-600 text-sm py-4">
          No meals logged yet. Add a meal to track ARFID/appetite and food wins.
        </p>
      ) : (
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-lg border-2 border-thistle/40 p-4 bg-white/60"
            >
              <div className="flex justify-between items-start gap-3">
                <MealSummaryContent meal={meal} />
                <button
                  type="button"
                  onClick={() => setEditingMealId(meal.id)}
                  className="shrink-0 px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

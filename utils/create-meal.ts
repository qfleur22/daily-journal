import { type Meal, type MealType } from "@/models/day-entry";

const DEFAULT_FOOD_WINS: Meal["foodWins"] = {
  calories: false,
  protein: false,
  salt: false,
  usedSafeFood: false,
  drinkableOption: false,
  hadAtLeast2Bites: false,
  ateUntilFull: false,
};

export function createMeal({
  mealType = null,
  mealTime = null,
  mealTimeEnd = null,
}: {
  mealType?: MealType | null;
  mealTime?: string | null;
  mealTimeEnd?: string | null;
}): Meal {
  return {
    id: `meal-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mealType,
    mealTime,
    mealTimeEnd,
    arfidAppetite: 5,
    foodWins: { ...DEFAULT_FOOD_WINS },
    whatIAte: "",
    whatIDrank: "",
    caffeinated: false,
  };
}

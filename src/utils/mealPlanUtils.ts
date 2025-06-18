
import { format, addDays, startOfWeek } from 'date-fns';

export interface MealPlan {
  id: string;
  week_start_date: string;
  user_id: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  created_at: string;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id: string;
  day_number: number;
  meal_type: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: any;
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  image_url?: string;
  youtube_search_term?: string;
  alternatives?: any;
  recipe_fetched?: boolean;
  created_at: string;
}

export const getCurrentWeekStartDate = (offset: number = 0): string => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday
  const targetWeek = addDays(weekStart, offset * 7);
  return format(targetWeek, 'yyyy-MM-dd');
};

export const formatWeekRange = (weekStartDate: string): string => {
  const startDate = new Date(weekStartDate);
  const endDate = addDays(startDate, 6);
  return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}`;
};

export const getMealTypeOrder = (mealType: string): number => {
  const order: Record<string, number> = {
    breakfast: 1,
    snack_morning: 2,
    lunch: 3,
    snack_afternoon: 4,
    dinner: 5,
    snack_evening: 6,
  };
  return order[mealType] || 99;
};

export const groupMealsByDay = (meals: DailyMeal[]) => {
  const grouped: Record<number, DailyMeal[]> = {};
  
  meals.forEach(meal => {
    if (!grouped[meal.day_number]) {
      grouped[meal.day_number] = [];
    }
    grouped[meal.day_number].push(meal);
  });

  // Sort meals within each day by meal type
  Object.keys(grouped).forEach(day => {
    grouped[parseInt(day)].sort((a, b) => 
      getMealTypeOrder(a.meal_type) - getMealTypeOrder(b.meal_type)
    );
  });

  return grouped;
};

export const calculateDayTotals = (meals: DailyMeal[]) => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber - 1] || '';
};

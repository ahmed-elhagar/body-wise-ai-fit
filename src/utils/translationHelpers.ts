
import { useI18n } from "@/hooks/useI18n";

export const useMealPlanTranslation = () => {
  const { t } = useI18n();
  
  const mealPlanT = (key: string) => {
    // Map meal plan specific keys to translation keys
    const keyMap: Record<string, string> = {
      'title': 'Meal Plan',
      'dailyView': 'Daily View',
      'weeklyView': 'Weekly View',
      'addSnack': 'Add Snack',
      'shoppingList': 'Shopping List',
      'calories': 'Calories',
      'protein': 'Protein',
      'carbs': 'Carbs',
      'fat': 'Fat',
      'complete': 'Complete',
      'dailyViewHelper': 'View daily meal details',
      'weeklyViewHelper': 'View weekly overview'
    };
    
    return t(keyMap[key] || key);
  };
  
  return { mealPlanT };
};

export const useExerciseTranslation = () => {
  const { t } = useI18n();
  
  const exerciseT = (key: string) => {
    const keyMap: Record<string, string> = {
      'title': 'Exercise Program',
      'home': 'Home Workout',
      'gym': 'Gym Workout',
      'exercises': 'Exercises',
      'sets': 'Sets',
      'reps': 'Reps',
      'rest': 'Rest'
    };
    
    return t(keyMap[key] || key);
  };
  
  return { exerciseT };
};

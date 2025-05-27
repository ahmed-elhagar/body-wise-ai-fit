
import type { Meal, Ingredient } from "@/types/meal";

export const getMealTime = (mealType: string) => {
  const times: { [key: string]: string } = {
    'breakfast': '8:00 AM',
    'lunch': '1:00 PM',
    'dinner': '7:00 PM',
    'snack': '3:00 PM'
  };
  return times[mealType.toLowerCase()] || '12:00 PM';
};

export const getMealEmoji = (mealType: string) => {
  const emojis: { [key: string]: string } = {
    'breakfast': '🥣',
    'lunch': '🥗',
    'dinner': '🍽️',
    'snack': '🍎'
  };
  return emojis[mealType.toLowerCase()] || '🍽️';
};

export const getCategoryForIngredient = (ingredient: string) => {
  const categories = {
    'protein': ['chicken', 'salmon', 'beef', 'turkey', 'eggs', 'tofu'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
    'vegetables': ['broccoli', 'spinach', 'tomatoes', 'cucumber', 'asparagus'],
    'fruits': ['apple', 'banana', 'berries'],
    'grains': ['rice', 'quinoa', 'oats', 'bread'],
    'pantry': ['oil', 'salt', 'pepper', 'herbs', 'spices']
  };
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.toLowerCase().includes(item))) {
      return category;
    }
  }
  return 'other';
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getCurrentDayOfWeek = () => {
  const today = new Date();
  const currentDay = today.getDay() === 0 ? 7 : today.getDay();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[currentDay - 1];
};

export const transformDailyMealsToMeals = (dailyMeals: any[], selectedDayNumber: number): Meal[] => {
  return dailyMeals
    ?.filter(meal => meal.day_number === selectedDayNumber)
    ?.map(meal => {
      const ingredients: Ingredient[] = Array.isArray(meal.ingredients) 
        ? meal.ingredients 
        : [];
      
      const instructions: string[] = Array.isArray(meal.instructions)
        ? meal.instructions
        : [];

      return {
        type: meal.meal_type,
        time: getMealTime(meal.meal_type),
        name: meal.name,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        ingredients,
        instructions,
        cookTime: meal.cook_time || 0,
        prepTime: meal.prep_time || 0,
        servings: meal.servings || 1,
        image: getMealEmoji(meal.meal_type),
        youtubeId: meal.youtube_search_term || "dQw4w9WgXcQ"
      };
    }) || [];
};


import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DailyMeal, WeeklyMealPlan } from "./useMealPlanData";

interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

interface MealPlanCalculationsReturn {
  todaysMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  convertMealsToShoppingItems: (meals: DailyMeal[]) => ShoppingItem[];
}

export const useMealPlanCalculations = (
  currentWeekPlan: { weeklyPlan: WeeklyMealPlan; dailyMeals: DailyMeal[] } | null,
  selectedDayNumber: number
): MealPlanCalculationsReturn => {
  const { language } = useLanguage();

  // Get today's meals for the selected day
  const todaysMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    
    return currentWeekPlan.dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  // Calculate total calories and protein for today
  const { totalCalories, totalProtein } = useMemo(() => {
    const calories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const protein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    
    return { totalCalories: calories, totalProtein: protein };
  }, [todaysMeals]);

  // Calculate target daily calories (this could be enhanced with user profile data)
  const targetDayCalories = useMemo(() => {
    if (currentWeekPlan?.weeklyPlan?.total_calories) {
      return Math.round(currentWeekPlan.weeklyPlan.total_calories / 7);
    }
    return 2000; // Default fallback
  }, [currentWeekPlan?.weeklyPlan?.total_calories]);

  // Enhanced shopping list conversion with proper categorization
  const convertMealsToShoppingItems = useMemo(() => {
    return (meals: DailyMeal[]): ShoppingItem[] => {
      const items: ShoppingItem[] = [];
      
      if (!meals || meals.length === 0) {
        console.log('🛒 No meals provided for shopping list');
        return items;
      }

      console.log('🛒 Converting meals to shopping items:', meals.length, 'meals');

      meals.forEach((meal, mealIndex) => {
        console.log(`🛒 Processing meal ${mealIndex + 1}:`, meal.name, 'ingredients:', meal.ingredients);
        
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach((ingredient, ingredientIndex) => {
            // Handle both string and object ingredients
            let ingredientData: { name: string; quantity?: string; unit?: string } = { name: '' };
            
            if (typeof ingredient === 'string') {
              ingredientData = { name: ingredient, quantity: '1', unit: 'piece' };
            } else if (ingredient && typeof ingredient === 'object') {
              ingredientData = {
                name: ingredient.name || `Ingredient ${ingredientIndex + 1}`,
                quantity: ingredient.quantity || '1',
                unit: ingredient.unit || 'piece'
              };
            }

            if (ingredientData.name) {
              // Categorize ingredients based on type
              const category = categorizeIngredient(ingredientData.name, language);
              
              items.push({
                name: ingredientData.name,
                quantity: ingredientData.quantity || '1',
                unit: ingredientData.unit || 'piece',
                category
              });
              
              console.log(`🛒 Added ingredient: ${ingredientData.name} (${ingredientData.quantity} ${ingredientData.unit}) - Category: ${category}`);
            }
          });
        } else {
          console.warn(`🛒 Meal "${meal.name}" has no valid ingredients array:`, meal.ingredients);
        }
      });

      console.log('🛒 Total shopping items generated:', items.length);
      return items;
    };
  }, [language]);

  return {
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    convertMealsToShoppingItems
  };
};

// Helper function to categorize ingredients
const categorizeIngredient = (ingredientName: string, language: string): string => {
  const name = ingredientName.toLowerCase();
  
  // Define categories in both languages
  const categories = {
    en: {
      proteins: ['chicken', 'beef', 'fish', 'egg', 'tofu', 'turkey', 'salmon', 'tuna', 'shrimp', 'lamb', 'pork'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'yoghurt'],
      vegetables: ['tomato', 'onion', 'garlic', 'pepper', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber', 'potato'],
      fruits: ['apple', 'banana', 'orange', 'berry', 'lemon', 'lime', 'grape', 'strawberry'],
      grains: ['rice', 'bread', 'pasta', 'oats', 'quinoa', 'wheat', 'flour'],
      spices: ['salt', 'pepper', 'oregano', 'basil', 'cinnamon', 'cumin', 'paprika', 'garlic powder'],
      oils: ['olive oil', 'oil', 'butter', 'coconut oil'],
      nuts: ['almond', 'walnut', 'cashew', 'peanut', 'pecan']
    },
    ar: {
      proteins: ['دجاج', 'لحم', 'سمك', 'بيض', 'تونة', 'سلمون', 'جمبري', 'لحم ضأن'],
      dairy: ['حليب', 'جبن', 'زبادي', 'زبدة', 'كريمة', 'لبن'],
      vegetables: ['طماطم', 'بصل', 'ثوم', 'فلفل', 'جزر', 'بروكلي', 'سبانخ', 'خس', 'خيار', 'بطاطس'],
      fruits: ['تفاح', 'موز', 'برتقال', 'توت', 'ليمون', 'عنب', 'فراولة'],
      grains: ['أرز', 'خبز', 'مكرونة', 'شوفان', 'كينوا', 'قمح', 'دقيق'],
      spices: ['ملح', 'فلفل', 'أوريجانو', 'ريحان', 'قرفة', 'كمون', 'بابريكا'],
      oils: ['زيت زيتون', 'زيت', 'زبدة', 'زيت جوز الهند'],
      nuts: ['لوز', 'جوز', 'كاجو', 'فول سوداني', 'جوز محمص']
    }
  };

  const langCategories = categories[language as keyof typeof categories] || categories.en;

  // Check each category
  for (const [category, items] of Object.entries(langCategories)) {
    if (items.some(item => name.includes(item))) {
      // Return localized category names
      const categoryNames = {
        en: {
          proteins: 'Proteins',
          dairy: 'Dairy',
          vegetables: 'Vegetables',
          fruits: 'Fruits',
          grains: 'Grains & Carbs',
          spices: 'Spices & Seasonings',
          oils: 'Oils & Fats',
          nuts: 'Nuts & Seeds'
        },
        ar: {
          proteins: 'البروتينات',
          dairy: 'منتجات الألبان',
          vegetables: 'الخضراوات',
          fruits: 'الفواكه',
          grains: 'الحبوب والكربوهيدرات',
          spices: 'التوابل والبهارات',
          oils: 'الزيوت والدهون',
          nuts: 'المكسرات والبذور'
        }
      };

      return categoryNames[language as keyof typeof categoryNames]?.[category as keyof typeof categoryNames.en] || 
             categoryNames.en[category as keyof typeof categoryNames.en] || 
             'Other';
    }
  }

  return language === 'ar' ? 'أخرى' : 'Other';
};

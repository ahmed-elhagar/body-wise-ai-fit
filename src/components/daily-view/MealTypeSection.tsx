
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import CompactMealCard from "./CompactMealCard";
import type { Meal } from "@/types/meal";

interface MealTypeSectionProps {
  mealType: string;
  meals: Meal[];
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
}

const MealTypeSection = ({
  mealType,
  meals,
  onShowRecipe,
  onExchangeMeal
}: MealTypeSectionProps) => {
  const { t, isRTL } = useLanguage();

  // Filter meals properly to avoid snacks appearing in dinner section
  const filteredMeals = meals.filter(meal => {
    if (mealType === 'snack') {
      // Only show meals that are explicitly snacks (have 🍎 emoji or snack in name)
      return meal.name?.includes('🍎') || 
             (meal.meal_type || meal.type)?.includes('snack');
    } else if (mealType === 'dinner') {
      // Exclude snacks from dinner section
      return !meal.name?.includes('🍎') && 
             !(meal.meal_type || meal.type)?.includes('snack');
    } else {
      // For breakfast and lunch, show normally
      return (meal.meal_type || meal.type) === mealType;
    }
  });

  if (filteredMeals.length === 0) return null;

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-orange-50 to-orange-100 border-orange-200 text-orange-800';
      case 'lunch': return 'from-blue-50 to-blue-100 border-blue-200 text-blue-800';
      case 'dinner': return 'from-purple-50 to-purple-100 border-purple-200 text-purple-800';
      case 'snack': return 'from-green-50 to-green-100 border-green-200 text-green-800';
      default: return 'from-gray-50 to-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const sectionCalories = filteredMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const colorClasses = getMealTypeColor(mealType);

  return (
    <div className="space-y-2">
      {/* Compact Section Header */}
      <div className={`flex items-center justify-between p-2 bg-gradient-to-r ${colorClasses} rounded-lg border ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-base" role="img" aria-label={mealType}>
            {getMealTypeIcon(mealType)}
          </span>
          <h3 className="font-semibold text-sm">{t(mealType)}</h3>
        </div>
        <Badge variant="secondary" className="bg-white/80 text-xs font-medium px-2 py-1">
          {sectionCalories} {t('cal')}
        </Badge>
      </div>

      {/* Compact Meals Grid */}
      <div className="space-y-1">
        {filteredMeals.map((meal, index) => (
          <CompactMealCard
            key={`${meal.id}-${index}`}
            meal={meal}
            index={index}
            mealType={mealType}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
        ))}
      </div>
    </div>
  );
};

export default MealTypeSection;

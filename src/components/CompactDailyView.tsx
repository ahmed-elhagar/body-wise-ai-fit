
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeftRight, Clock, Plus, ShoppingCart, Flame, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Meal } from "@/types/meal";

interface CompactDailyViewProps {
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  onGenerate: () => void;
}

const CompactDailyView = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  onShowShoppingList,
  onGenerate
}: CompactDailyViewProps) => {
  const { t, isRTL } = useLanguage();

  if (todaysMeals.length === 0) {
    return (
      <Card className="p-6 text-center bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('noMealsToday')}</h3>
        <p className="text-gray-600 mb-6 text-sm max-w-sm mx-auto leading-relaxed">{t('generateNewPlan')}</p>
        <Button 
          onClick={onGenerate} 
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3"
          aria-label={t('generateMealPlan')}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('generateMealPlan')}
        </Button>
      </Card>
    );
  }

  // Group meals by type for better organization
  const mealsByType = {
    breakfast: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'breakfast'),
    lunch: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'lunch'),
    dinner: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'dinner'),
    snack: todaysMeals.filter(meal => 
      (meal.meal_type || meal.type)?.includes('snack') || 
      meal.name?.includes('🍎')
    )
  };

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

  const renderCompactMealCard = (meal: Meal, index: number, mealType: string) => (
    <Card 
      key={`${meal.id}-${index}`} 
      className="p-3 bg-white/95 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-all duration-200 group rounded-lg"
      role="article"
      aria-labelledby={`meal-${meal.id}-title`}
    >
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Meal Icon & Image */}
        <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {meal.image || meal.image_url ? (
            <img 
              src={meal.image || meal.image_url} 
              alt=""
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          ) : (
            <span className="text-lg" role="img" aria-label={`${mealType} meal`}>
              {getMealTypeIcon(mealType)}
            </span>
          )}
        </div>

        {/* Meal Info */}
        <div className="flex-1 min-w-0">
          <h4 
            id={`meal-${meal.id}-title`}
            className="font-semibold text-gray-800 text-sm mb-1 truncate"
          >
            {meal.name}
          </h4>
          
          {/* Compact Nutrition Row */}
          <div className={`flex items-center gap-3 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-500" />
              <span className="font-medium">{meal.calories}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-green-500" />
              <span className="font-medium">{meal.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>{(meal.prepTime || 0) + (meal.cookTime || 0)}m</span>
            </div>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors rounded-lg"
            onClick={() => onShowRecipe(meal)}
            aria-label={`${t('recipe')} for ${meal.name}`}
          >
            <ChefHat className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600 transition-colors rounded-lg"
            onClick={() => onExchangeMeal(meal, index)}
            aria-label={`${t('exchange')} ${meal.name}`}
          >
            <ArrowLeftRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderMealTypeSection = (mealType: string, meals: Meal[]) => {
    if (meals.length === 0) return null;

    const sectionCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const colorClasses = getMealTypeColor(mealType);

    return (
      <div key={mealType} className="space-y-2">
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
          {meals.map((meal, index) => renderCompactMealCard(meal, index, mealType))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3" role="main" aria-label={t('todaysMeals')}>
      {/* Compact Summary Card */}
      <Card className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-lg rounded-lg">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="font-bold text-gray-800 text-base mb-1">{t('todaysSummary')}</h2>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{totalCalories}</span>
                <span className="text-xs">{t('calories')}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{totalProtein}g</span>
                <span className="text-xs">{t('protein')}</span>
              </div>
            </div>
          </div>
          
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 shadow-sm rounded-lg"
              onClick={onShowShoppingList}
              aria-label={t('shoppingList')}
            >
              <ShoppingCart className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="hidden sm:inline">{t('shoppingList')}</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs bg-white hover:bg-green-50 border-green-200 text-green-700 shadow-sm rounded-lg"
              onClick={onAddSnack}
              aria-label={t('addSnack.title')}
            >
              <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="hidden sm:inline">{t('addSnack.title')}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Compact Meal Sections */}
      <div className="space-y-2">
        {Object.entries(mealsByType).map(([mealType, meals]) => 
          renderMealTypeSection(mealType, meals)
        )}
      </div>
    </div>
  );
};

export default CompactDailyView;

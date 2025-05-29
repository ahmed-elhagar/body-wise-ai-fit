
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChefHat, ArrowLeftRight, Clock, Users, Utensils, Plus, ShoppingCart } from "lucide-react";
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
      <Card className="p-6 text-center bg-white/80 backdrop-blur-sm">
        <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('noMealsToday')}</h3>
        <p className="text-gray-600 mb-4 text-sm">{t('generateNewPlan')}</p>
        <Button onClick={onGenerate} className="bg-fitness-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('generateMealPlan')}
        </Button>
      </Card>
    );
  }

  const mealsByType = {
    breakfast: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'breakfast'),
    lunch: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'lunch'),
    dinner: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'dinner'),
    snack: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'snack')
  };

  const renderMealCard = (meal: Meal, index: number) => (
    <Card key={`${meal.id}-${index}`} className="p-3 bg-gradient-to-r from-white to-gray-50 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Meal Image */}
        <div className="w-full sm:w-20 h-16 sm:h-16 bg-gradient-to-br from-fitness-primary/10 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
          {meal.image || meal.image_url ? (
            <img 
              src={meal.image || meal.image_url} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Utensils className="w-6 h-6 text-fitness-primary" />
          )}
        </div>

        {/* Meal Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{meal.name}</h4>
          
          {/* Nutrition */}
          <div className={`flex flex-wrap gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              {meal.calories} {t('cal')}
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {meal.protein}g {t('protein')}
            </Badge>
          </div>

          {/* Quick Info */}
          <div className={`flex items-center gap-3 text-xs text-gray-500 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-3 h-3" />
              <span>{(meal.prepTime || 0) + (meal.cookTime || 0)} {t('min')}</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className="w-3 h-3" />
              <span>{meal.servings}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 h-8 text-xs bg-white hover:bg-fitness-primary hover:text-white transition-colors"
              onClick={() => onShowRecipe(meal)}
            >
              <ChefHat className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('recipe')}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 h-8 text-xs bg-white hover:bg-orange-500 hover:text-white transition-colors"
              onClick={() => onExchangeMeal(meal, index)}
            >
              <ArrowLeftRight className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('exchange')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-fitness-primary/5 to-pink-50 border-0">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{t('todaysSummary')}</h3>
            <div className={`flex gap-4 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs text-gray-600">{totalCalories} {t('calories')}</span>
              <span className="text-xs text-gray-600">{totalProtein}g {t('protein')}</span>
            </div>
          </div>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
              onClick={onShowShoppingList}
            >
              <ShoppingCart className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('shoppingList')}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs bg-white hover:bg-green-50 border-green-200 text-green-700"
              onClick={onAddSnack}
            >
              <Plus className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('addSnack')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Meals Accordion */}
      <Accordion type="multiple" defaultValue={['breakfast', 'lunch', 'dinner']} className="space-y-2">
        {Object.entries(mealsByType).map(([mealType, meals]) => {
          if (meals.length === 0) return null;

          return (
            <AccordionItem key={mealType} value={mealType} className="border-0">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50 transition-colors">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 text-xs font-medium ${
                        mealType === 'breakfast' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        mealType === 'lunch' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        mealType === 'dinner' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      {t(mealType)}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)} {t('cal')}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 pt-2">
                    {meals.map((meal, index) => renderMealCard(meal, index))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CompactDailyView;

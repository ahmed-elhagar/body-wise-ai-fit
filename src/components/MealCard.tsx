
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Meal {
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  imageUrl?: string;
  image: string;
}

interface MealCardProps {
  meal: Meal;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealCard = ({ meal, onShowRecipe, onExchangeMeal }: MealCardProps) => {
  const { t, isRTL } = useLanguage();

  const getMealTypeIcon = (type: string) => {
    if (meal.name.includes('🍎') || type === 'snack') return '🍎';
    switch (type.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return meal.image || '🍽️';
    }
  };

  const getMealTypeColor = (type: string) => {
    if (meal.name.includes('🍎') || type === 'snack') return 'bg-green-100 text-green-800';
    switch (type.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSnack = meal.name.includes('🍎') || meal.type === 'snack';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        {/* Gradient Header */}
        <div className={`h-2 bg-gradient-to-r ${isSnack ? 'from-green-400 to-emerald-500' : 'from-fitness-primary to-pink-500'}`} />
        
        <div className={`p-4 sm:p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Meal Icon & Info */}
            <div className={`flex items-start gap-3 sm:gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-3xl sm:text-4xl flex-shrink-0">
                {getMealTypeIcon(meal.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Header with badges */}
                <div className={`flex flex-wrap items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge className={`${getMealTypeColor(meal.type)} font-medium text-xs px-2 py-1`}>
                    {isSnack ? t('mealPlan.snack') : t(`mealPlan.${meal.type.toLowerCase()}`)}
                  </Badge>
                  <div className={`flex items-center text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-3 h-3 mx-1" />
                    <span>{meal.time}</span>
                  </div>
                  {isSnack && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {t('mealPlan.aiGenerated')}
                    </Badge>
                  )}
                </div>
                
                {/* Meal Name */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-fitness-primary transition-colors">
                  {meal.name.replace('🍎 ', '')}
                </h3>
                
                {/* Enhanced Nutrition Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 sm:p-3 rounded-lg text-center">
                    <div className={`flex items-center justify-center gap-1 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Flame className="w-3 h-3 text-red-600" />
                      <p className="text-xs text-red-700 font-medium">{t('mealPlan.calories')}</p>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-red-800">{meal.calories}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-3 rounded-lg text-center">
                    <p className="text-xs text-green-700 mb-1 font-medium">{t('mealPlan.protein')}</p>
                    <p className="text-sm sm:text-base font-bold text-green-800">{meal.protein}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-3 rounded-lg text-center">
                    <p className="text-xs text-blue-700 mb-1 font-medium">{t('mealPlan.carbs')}</p>
                    <p className="text-sm sm:text-base font-bold text-blue-800">{meal.carbs}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 sm:p-3 rounded-lg text-center">
                    <p className="text-xs text-orange-700 mb-1 font-medium">{t('mealPlan.fat')}</p>
                    <p className="text-sm sm:text-base font-bold text-orange-800">{meal.fat}g</p>
                  </div>
                </div>

                {/* Meal Details */}
                <div className={`flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Clock className="w-3 h-3" />
                    <span>{(meal.prepTime || 0) + (meal.cookTime || 0)} {t('mealPlan.min')}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-3 h-3" />
                    <span>{meal.servings} {t('mealPlan.serving')}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Utensils className="w-3 h-3" />
                    <span>{(meal.ingredients || []).length} {t('mealPlan.ingredients')}</span>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div className={`flex flex-wrap gap-1 sm:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {(meal.ingredients || []).slice(0, 3).map((ingredient, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                      {typeof ingredient === 'string' ? ingredient : ingredient.name}
                    </Badge>
                  ))}
                  {(meal.ingredients || []).length > 3 && (
                    <Badge variant="outline" className="text-xs bg-fitness-primary/10 text-fitness-primary">
                      +{(meal.ingredients || []).length - 3} {t('mealPlan.more')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex flex-col gap-2 flex-shrink-0 ${isRTL ? 'items-start' : 'items-end'}`}>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/90 hover:bg-fitness-primary hover:text-white transition-all duration-200 shadow-sm"
                onClick={() => onShowRecipe(meal)}
              >
                <ChefHat className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{t('mealPlan.recipe')}</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/90 hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
                onClick={() => onExchangeMeal(meal)}
              >
                <span className="text-xs">⇄</span>
                <span className="hidden sm:inline ml-1">{t('mealPlan.exchange')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;

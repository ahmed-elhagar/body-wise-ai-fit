
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils, Flame, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

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
  const [mealImage, setMealImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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

  const getMealTypeText = (type: string) => {
    if (meal.name.includes('🍎') || type === 'snack') return t('mealPlan.snack');
    switch (type.toLowerCase()) {
      case 'breakfast': return t('mealPlan.breakfast');
      case 'lunch': return t('mealPlan.lunch');
      case 'dinner': return t('mealPlan.dinner');
      case 'snack': return t('mealPlan.snack');
      default: return type;
    }
  };

  const generateMealImage = async () => {
    if (isLoadingImage || mealImage) return;
    
    setIsLoadingImage(true);
    try {
      const response = await fetch('/api/generate-meal-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealName: meal.name.replace('🍎 ', ''),
          ingredients: meal.ingredients.slice(0, 3).map(ing => ing.name).join(', ')
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMealImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate meal image:', error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  useEffect(() => {
    // Auto-generate image for meals
    const timer = setTimeout(() => {
      generateMealImage();
    }, Math.random() * 2000); // Stagger image generation

    return () => clearTimeout(timer);
  }, []);

  const isSnack = meal.name.includes('🍎') || meal.type === 'snack';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        {/* Meal Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {mealImage ? (
            <img 
              src={mealImage} 
              alt={meal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : isLoadingImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="animate-spin w-8 h-8 border-2 border-fitness-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
              onClick={generateMealImage}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{getMealTypeIcon(meal.type)}</div>
                <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{t('mealPlan.generateImage')}</p>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Meal Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getMealTypeColor(meal.type)} font-medium text-xs px-3 py-1`}>
              {getMealTypeText(meal.type)}
            </Badge>
          </div>
          
          {/* Time Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/20 text-white border-0 backdrop-blur-sm">
              {meal.time}
            </Badge>
          </div>
          
          {/* AI Generated Badge for Snacks */}
          {isSnack && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="text-xs bg-green-50/90 text-green-700 border-green-200 backdrop-blur-sm">
                {t('mealPlan.aiGenerated')}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Meal Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-fitness-primary transition-colors">
            {meal.name.replace('🍎 ', '')}
          </h3>
          
          {/* Nutrition Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-2 rounded-lg text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Flame className="w-3 h-3 text-red-600" />
              </div>
              <p className="text-xs text-red-700 font-medium">{t('mealPlan.calories')}</p>
              <p className="text-sm font-bold text-red-800">{meal.calories}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded-lg text-center">
              <p className="text-xs text-green-700 mb-1 font-medium">{t('mealPlan.protein')}</p>
              <p className="text-sm font-bold text-green-800">{meal.protein}g</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg text-center">
              <p className="text-xs text-blue-700 mb-1 font-medium">{t('mealPlan.carbs')}</p>
              <p className="text-sm font-bold text-blue-800">{meal.carbs}g</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 rounded-lg text-center">
              <p className="text-xs text-orange-700 mb-1 font-medium">{t('mealPlan.fat')}</p>
              <p className="text-sm font-bold text-orange-800">{meal.fat}g</p>
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
          <div className={`flex flex-wrap gap-1 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
          
          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-white/90 hover:bg-fitness-primary hover:text-white transition-all duration-200 shadow-sm"
              onClick={() => onShowRecipe(meal)}
            >
              <ChefHat className="w-3 h-3 mr-1" />
              {t('mealPlan.recipe')}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 bg-white/90 hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-sm"
              onClick={() => onExchangeMeal(meal)}
            >
              <span className="text-xs mr-1">⇄</span>
              {t('mealPlan.exchange')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;

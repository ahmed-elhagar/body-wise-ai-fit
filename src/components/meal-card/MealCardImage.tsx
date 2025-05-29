
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface MealCardImageProps {
  meal: {
    name: string;
    type: string;
    time: string;
    ingredients: any[];
  };
  mealImage: string | null;
  isLoadingImage: boolean;
  onGenerateImage: () => void;
}

const MealCardImage = ({ meal, mealImage, isLoadingImage, onGenerateImage }: MealCardImageProps) => {
  const { t } = useLanguage();

  const getMealTypeIcon = (type: string) => {
    if (meal.name.includes('🍎') || type === 'snack') return '🍎';
    switch (type.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
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

  const isSnack = meal.name.includes('🍎') || meal.type === 'snack';

  return (
    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {mealImage ? (
        <img 
          src={mealImage} 
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : isLoadingImage ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-fitness-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
          onClick={onGenerateImage}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-2">{getMealTypeIcon(meal.type)}</div>
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500 px-2">{t('mealPlan.generateImage')}</p>
          </div>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Meal Type Badge */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
        <Badge className={`${getMealTypeColor(meal.type)} font-medium text-xs px-2 sm:px-3 py-1`}>
          {getMealTypeText(meal.type)}
        </Badge>
      </div>
      
      {/* Time Badge */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <Badge variant="secondary" className="bg-black/20 text-white border-0 backdrop-blur-sm text-xs">
          {meal.time}
        </Badge>
      </div>
      
      {/* AI Generated Badge for Snacks */}
      {isSnack && (
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          <Badge variant="outline" className="text-xs bg-green-50/90 text-green-700 border-green-200 backdrop-blur-sm">
            {t('mealPlan.aiGenerated')}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default MealCardImage;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Apple, Utensils } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface QuickAddSectionProps {
  onAddFood: (food: any) => void;
}

const QUICK_FOODS = [
  { name: 'Water (1 glass)', calories: 0, protein: 0, carbs: 0, fat: 0, icon: '💧' },
  { name: 'Coffee (black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, icon: '☕' },
  { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, icon: '🍎' },
  { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, icon: '🍌' },
  { name: 'Almonds (10 pieces)', calories: 69, protein: 2.6, carbs: 2.6, fat: 6, icon: '🥜' },
  { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fat: 0, icon: '🥛' }
];

export const QuickAddSection = ({ onAddFood }: QuickAddSectionProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Utensils className="w-4 h-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">
          {t('foodTracker:quickAdd') || 'Quick Add'}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {QUICK_FOODS.map((food, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onAddFood(food)}
            className={`h-auto p-3 ${isRTL ? 'text-right' : 'text-left'} justify-start hover:bg-gray-50`}
          >
            <div className={`flex items-center gap-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-lg">{food.icon}</span>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="font-medium text-sm truncate">{food.name}</div>
                <div className="text-xs text-gray-500">{food.calories} cal</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="text-center pt-2">
        <Badge variant="secondary" className="text-xs">
          {t('foodTracker:commonFoods') || 'Common foods for quick tracking'}
        </Badge>
      </div>
    </div>
  );
};

export default QuickAddSection;

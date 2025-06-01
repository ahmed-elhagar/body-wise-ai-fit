import React from 'react';
import { Card } from "@/components/ui/card";
import { useI18n } from "@/hooks/useI18n";

interface NutritionDisplayProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionDisplay = ({ calories, protein, carbs, fat }: NutritionDisplayProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('nutritionFacts')}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium text-gray-800">{t('calories')}:</span> {calories} kcal
        </div>
        <div>
          <span className="font-medium text-gray-800">{t('protein')}:</span> {protein}g
        </div>
        <div>
          <span className="font-medium text-gray-800">{t('carbohydrates')}:</span> {carbs}g
        </div>
        <div>
          <span className="font-medium text-gray-800">{t('fat')}:</span> {fat}g
        </div>
      </div>
    </Card>
  );
};

export default NutritionDisplay;

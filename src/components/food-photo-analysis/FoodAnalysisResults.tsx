
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Flame, MoreVertical } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface FoodAnalysisResultsProps {
  results: {
    foods: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      confidence: number;
    }>;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
}

export const FoodAnalysisResults = ({ results }: FoodAnalysisResultsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`space-y-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Flame className="w-5 h-5 text-orange-500" />
            {t('foodAnalysis:nutritionSummary') || 'Nutrition Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{results.totalCalories}</div>
              <div className="text-sm text-red-700">{t('common:calories') || 'Calories'}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.totalProtein}g</div>
              <div className="text-sm text-green-700">{t('common:protein') || 'Protein'}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.totalCarbs}g</div>
              <div className="text-sm text-blue-700">{t('common:carbs') || 'Carbs'}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{results.totalFat}g</div>
              <div className="text-sm text-orange-700">{t('common:fat') || 'Fat'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Utensils className="w-5 h-5 text-blue-500" />
            {t('foodAnalysis:detectedFoods') || 'Detected Foods'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.foods.map((food, index) => (
              <div key={index} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h4 className="font-medium text-gray-900">{food.name}</h4>
                    <div className={`flex gap-2 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{food.calories} cal</span>
                      <span>{food.protein}g protein</span>
                    </div>
                  </div>
                </div>
                <Badge variant={food.confidence > 0.8 ? 'default' : 'secondary'}>
                  {Math.round(food.confidence * 100)}% {t('foodAnalysis:confidence') || 'confidence'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodAnalysisResults;

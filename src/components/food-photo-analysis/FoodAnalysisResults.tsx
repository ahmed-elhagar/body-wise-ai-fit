
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface FoodAnalysisResultsProps {
  results: any;
  onAddToLog?: (food: any) => void;
  onFoodSelected?: (food: any) => void;
  className?: string;
}

const FoodAnalysisResults = ({ 
  results, 
  onAddToLog, 
  onFoodSelected,
  className = '' 
}: FoodAnalysisResultsProps) => {
  const { t } = useI18n();

  if (!results || !results.foods || results.foods.length === 0) {
    return null;
  }

  const handleAddFood = (food: any) => {
    if (onAddToLog) {
      onAddToLog(food);
    } else if (onFoodSelected) {
      onFoodSelected(food);
    }
  };

  return (
    <Card className={`bg-white shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {t('foodAnalysis:results') || 'Analysis Results'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.foods.map((food: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{food.name}</h4>
              <div className="flex gap-3 mt-2">
                <Badge variant="secondary">
                  {food.calories} cal
                </Badge>
                <Badge variant="outline">
                  {food.protein}g protein
                </Badge>
                <Badge variant="outline">
                  {food.carbs}g carbs
                </Badge>
                <Badge variant="outline">
                  {food.fat}g fat
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => handleAddFood(food)}
              className="ml-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('common:add') || 'Add'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FoodAnalysisResults;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Clock, Zap } from 'lucide-react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DetectedFood {
  name: string;
  confidence: number;
  estimatedQuantityG: number;
  nutrition: NutritionInfo;
}

interface FoodAnalysisData {
  detectedFoods: DetectedFood[];
  totalNutrition: NutritionInfo;
  overallConfidence: number;
  cuisineType?: string;
  mealType?: string;
  suggestions?: string;
}

interface FoodAnalysisResultsProps {
  analysisData: FoodAnalysisData;
  onSaveToLog?: (foodData: any) => void;
  isLoading?: boolean;
}

const FoodAnalysisResults: React.FC<FoodAnalysisResultsProps> = ({
  analysisData,
  onSaveToLog,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Analyzing food...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return null;
  }

  const { detectedFoods, totalNutrition, overallConfidence, cuisineType, suggestions } = analysisData;

  const handleSaveFood = (food: DetectedFood) => {
    if (onSaveToLog) {
      onSaveToLog({
        name: food.name,
        quantity: food.estimatedQuantityG,
        nutrition: food.nutrition
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalNutrition.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalNutrition.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalNutrition.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalNutrition.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant={overallConfidence > 0.8 ? "default" : overallConfidence > 0.6 ? "secondary" : "destructive"}>
              {Math.round(overallConfidence * 100)}% Confidence
            </Badge>
            {cuisineType && (
              <Badge variant="outline">{cuisineType}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detected Foods */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Foods ({detectedFoods.length.toString()})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detectedFoods.map((food, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-600">
                    ~{food.estimatedQuantityG}g | {food.nutrition.calories} cal
                  </div>
                  <Badge size="sm" variant={food.confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(food.confidence * 100)}% sure
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleSaveFood(food)}
                  className="ml-2"
                >
                  Add to Log
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{suggestions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodAnalysisResults;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Utensils, 
  Zap, 
  Target, 
  Scale,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Plus
} from "lucide-react";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface FoodItem {
  name: string;
  confidence: number;
  nutrition: NutritionInfo;
  portion_size?: string;
  category?: string;
}

interface FoodAnalysisResultsProps {
  results: {
    foods: FoodItem[];
    total_nutrition: NutritionInfo;
    analysis_confidence: number;
    suggestions?: string[];
  };
  onAddToMealPlan?: (food: FoodItem) => void;
  onRetakePhoto?: () => void;
  className?: string;
}

const FoodAnalysisResults: React.FC<FoodAnalysisResultsProps> = ({
  results,
  onAddToMealPlan,
  onRetakePhoto,
  className = ""
}) => {
  const { foods, total_nutrition, analysis_confidence, suggestions } = results;

  const getNutritionColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 30) return "text-green-600";
    if (percentage < 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.6) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analysis Confidence Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Utensils className="w-5 h-5 text-blue-600" />
              Food Analysis Results
            </CardTitle>
            <div className={`flex items-center gap-2 ${getConfidenceColor(analysis_confidence)}`}>
              {getConfidenceIcon(analysis_confidence)}
              <span className="font-semibold">
                {Math.round(analysis_confidence * 100)}% Confidence
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Individual Food Items */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Detected Foods ({foods.length})
        </h3>
        
        {foods.map((food, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {food.name}
                    </h4>
                    <Badge 
                      variant={food.confidence >= 0.8 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {Math.round(food.confidence * 100)}%
                    </Badge>
                  </div>
                  
                  {food.portion_size && (
                    <p className="text-sm text-gray-600 mb-2">
                      Portion: {food.portion_size}
                    </p>
                  )}
                  
                  {food.category && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {food.category}
                    </Badge>
                  )}
                </div>
                
                {onAddToMealPlan && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToMealPlan(food)}
                    className="ml-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              {/* Nutrition Info for Individual Food */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-gray-900">{food.nutrition.calories}</div>
                  <div className="text-gray-600">Calories</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-blue-600">{food.nutrition.protein}g</div>
                  <div className="text-gray-600">Protein</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-green-600">{food.nutrition.carbs}g</div>
                  <div className="text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-yellow-600">{food.nutrition.fat}g</div>
                  <div className="text-gray-600">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Nutrition Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Total Nutrition Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {total_nutrition.calories}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4" />
                Calories
              </div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {total_nutrition.protein}g
              </div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {total_nutrition.carbs}g
              </div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {total_nutrition.fat}g
              </div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>

          {/* Additional Nutrition Info */}
          {(total_nutrition.fiber || total_nutrition.sugar || total_nutrition.sodium) && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                {total_nutrition.fiber && (
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{total_nutrition.fiber}g</div>
                    <div className="text-gray-600">Fiber</div>
                  </div>
                )}
                {total_nutrition.sugar && (
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{total_nutrition.sugar}g</div>
                    <div className="text-gray-600">Sugar</div>
                  </div>
                )}
                {total_nutrition.sodium && (
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{total_nutrition.sodium}mg</div>
                    <div className="text-gray-600">Sodium</div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onRetakePhoto && (
          <Button variant="outline" onClick={onRetakePhoto} className="flex-1">
            <Clock className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        )}
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Save to Food Log
        </Button>
      </div>
    </div>
  );
};

export default FoodAnalysisResults;

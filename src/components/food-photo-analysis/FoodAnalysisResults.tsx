
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, ChefHat, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIFoodAnalysisResult } from "@/types/aiAnalysis";

interface FoodAnalysisResultsProps {
  result: AIFoodAnalysisResult;
  onAddToLog?: (food: any) => void;
  className?: string;
}

const FoodAnalysisResults = ({ result, onAddToLog, className = "" }: FoodAnalysisResultsProps) => {
  const { t } = useLanguage();

  const confidenceColor = result.overallConfidence > 0.8 ? "text-green-600" : 
                         result.overallConfidence > 0.6 ? "text-yellow-600" : "text-red-600";

  const confidenceLabel = result.overallConfidence > 0.8 ? t('High Confidence') : 
                         result.overallConfidence > 0.6 ? t('Medium Confidence') : t('Low Confidence');

  return (
    <Card className={`p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{t('Analysis Complete')}</h3>
              <p className="text-sm text-gray-600">
                {result.foodItems?.length || 0} {t('items detected')}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm font-semibold ${confidenceColor}`}>
              {confidenceLabel}
            </div>
            <Progress 
              value={(result.overallConfidence || 0) * 100} 
              className="w-20 h-2 mt-1"
            />
          </div>
        </div>

        {/* Meal Overview */}
        {(result.mealType || result.cuisineType) && (
          <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-green-200">
            {result.mealType && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {result.mealType}
                </span>
              </div>
            )}
            {result.cuisineType && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 capitalize">
                  {result.cuisineType} {t('cuisine')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Nutrition Summary */}
        {result.totalNutrition && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'calories', label: t('Calories'), value: result.totalNutrition.calories, unit: '', color: 'orange' },
              { key: 'protein', label: t('Protein'), value: result.totalNutrition.protein, unit: 'g', color: 'green' },
              { key: 'carbs', label: t('Carbs'), value: result.totalNutrition.carbs, unit: 'g', color: 'blue' },
              { key: 'fat', label: t('Fat'), value: result.totalNutrition.fat, unit: 'g', color: 'purple' }
            ].map(({ key, label, value, unit, color }) => (
              <div key={key} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className={`text-lg font-bold text-${color}-600`}>
                  {Math.round(value || 0)}{unit}
                </div>
                <div className="text-xs text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Individual Food Items */}
        {result.foodItems && result.foodItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-800">{t('Detected Foods')}</h4>
            </div>
            
            <div className="space-y-2">
              {result.foodItems.map((food: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-medium text-gray-900">{food.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {food.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>{food.calories || 0} cal</span>
                      <span>{food.protein || 0}g protein</span>
                      <span>{food.carbs || 0}g carbs</span>
                      <span>{food.fat || 0}g fat</span>
                    </div>
                    
                    {food.quantity && (
                      <p className="text-xs text-green-600 mt-1">
                        {t('Portion')}: {food.quantity}
                      </p>
                    )}
                  </div>

                  {onAddToLog && (
                    <Button
                      size="sm"
                      onClick={() => onAddToLog(food)}
                      className="ml-3 bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
                    >
                      {t('Add to Log')}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              {t('Nutritionist Recommendations')}
            </h4>
            <p className="text-sm text-blue-700">{result.recommendations}</p>
          </div>
        )}

        {/* AI Credits Info */}
        {result.remainingCredits !== undefined && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {result.remainingCredits === -1 
                ? t('Unlimited AI credits remaining') 
                : t('{{count}} AI credits remaining', { count: result.remainingCredits })
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FoodAnalysisResults;

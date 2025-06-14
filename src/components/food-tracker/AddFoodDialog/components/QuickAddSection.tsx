
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Utensils, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface QuickAddSectionProps {
  todaysFoodItems: any[];
  isLoading: boolean;
  onSelectFood: (food: any) => void;
  selectedFood: any;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const QuickAddSection = ({ 
  todaysFoodItems, 
  isLoading, 
  onSelectFood, 
  selectedFood,
  onRefresh,
  isRefreshing 
}: QuickAddSectionProps) => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-blue-800">{t('Loading today\'s foods...')}</span>
        </div>
      </div>
    );
  }

  if (todaysFoodItems.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <Utensils className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">{t('No foods logged today yet')}</p>
          <p className="text-xs text-gray-500 mt-1">
            {t('Add some food or check your meal plan to see quick options here')}
          </p>
        </div>
      </div>
    );
  }

  const FoodCard = ({ food }: { food: any }) => (
    <Card 
      className={`p-3 cursor-pointer transition-all hover:shadow-md border ${
        selectedFood?.id === food.id 
          ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-200' 
          : 'hover:border-blue-200'
      }`}
      onClick={() => onSelectFood(food)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 text-sm">{food.name}</h4>
            <Badge variant="outline" className={`text-xs ${
              food.source === 'meal_plan' 
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <Clock className="w-3 h-3 mr-1" />
              {food.source === 'meal_plan' ? t('Meal Plan') : t('Recent')}
            </Badge>
          </div>
          {food.brand && food.brand !== 'Meal Plan' && (
            <p className="text-xs text-gray-500">{food.brand}</p>
          )}
          {food.lastConsumed && (
            <p className="text-xs text-gray-400 mt-1">
              {food.source === 'meal_plan' 
                ? t('From today\'s meal plan')
                : `${t('Last eaten')}: ${format(new Date(food.lastConsumed), 'HH:mm')}`
              }
            </p>
          )}
        </div>
        <div className="text-right text-xs text-gray-600">
          <div className="font-medium">{Math.round(food.calories_per_100g || 0)} cal</div>
          <div className="text-xs text-gray-500">per 100g</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg">
      <div className="p-3 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900 text-sm">{t('Today\'s Foods - Quick Add')}</h3>
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
              {todaysFoodItems.length} items
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
          {todaysFoodItems.slice(0, 6).map((food) => (
            <FoodCard key={`today-${food.id}`} food={food} />
          ))}
          {todaysFoodItems.length > 6 && (
            <p className="text-xs text-blue-600 text-center py-2">
              {t('Showing first 6 items')} ({todaysFoodItems.length} total)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickAddSection;

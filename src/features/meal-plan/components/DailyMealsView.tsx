import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Clock, 
  Target, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  Loader2
} from 'lucide-react';
import type { DailyMeal } from '../types';

interface DailyMealsViewProps {
  dailyMeals: DailyMeal[];
  selectedDayNumber: number;
  completedMeals: Set<string>;
  onMealComplete: (mealId: string) => void;
  onViewRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onShowAIModal: () => void;
  onAddSnack: () => void;
  isGenerating: boolean;
}

export const DailyMealsView: React.FC<DailyMealsViewProps> = ({
  dailyMeals,
  selectedDayNumber,
  completedMeals,
  onMealComplete,
  onViewRecipe,
  onExchangeMeal,
  onShowAIModal,
  onAddSnack,
  isGenerating
}) => {
  const selectedDayMeals = dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  
  const mealsByType = {
    breakfast: selectedDayMeals.filter(meal => meal.meal_type === 'breakfast'),
    lunch: selectedDayMeals.filter(meal => meal.meal_type === 'lunch'),
    dinner: selectedDayMeals.filter(meal => meal.meal_type === 'dinner'),
    snacks: selectedDayMeals.filter(meal => 
      meal.meal_type === 'snack' || 
      meal.meal_type === 'snack1' || 
      meal.meal_type === 'snack2'
    )
  };

  const mealTypeConfig = [
    { key: 'breakfast', name: 'Breakfast', color: 'orange', gradient: 'from-orange-400 to-amber-500' },
    { key: 'lunch', name: 'Lunch', color: 'green', gradient: 'from-green-400 to-emerald-500' },
    { key: 'dinner', name: 'Dinner', color: 'blue', gradient: 'from-blue-400 to-indigo-500' },
    { key: 'snacks', name: 'Snacks', color: 'purple', gradient: 'from-purple-400 to-pink-500' }
  ];

  const MealCard = ({ meal }: { meal: DailyMeal }) => {
    const isCompleted = completedMeals.has(meal.id);
    
    return (
      <Card className={`p-4 transition-all hover:shadow-lg ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-brand-neutral-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-brand-neutral-900 mb-1">{meal.name}</h4>
            <p className="text-sm text-brand-neutral-600 line-clamp-2">
              {meal.instructions.length > 0 ? meal.instructions[0] : `${meal.calories} kcal • ${meal.prep_time} min prep`}
            </p>
          </div>
          <button
            onClick={() => onMealComplete(meal.id)}
            className={`ml-3 p-2 rounded-full transition-all ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-brand-neutral-100 text-brand-neutral-600 hover:bg-brand-neutral-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </div>

        {/* Meal Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-brand-neutral-600">
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>{meal.calories || 0} kcal</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{meal.prep_time || 0}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChefHat className="h-4 w-4" />
            <span>Easy</span>
          </div>
        </div>

        {/* Nutrition Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            P: {meal.protein || 0}g
          </Badge>
          <Badge variant="secondary" className="text-xs">
            C: {meal.carbs || 0}g
          </Badge>
          <Badge variant="secondary" className="text-xs">
            F: {meal.fat || 0}g
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewRecipe(meal)}
            className="flex-1 border-brand-neutral-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            Recipe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExchangeMeal(meal)}
            className="flex-1 border-brand-neutral-300"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Exchange
          </Button>
        </div>
      </Card>
    );
  };

  const EmptyMealTypeCard = ({ mealType }: { mealType: string }) => (
    <Card className="p-6 border-2 border-dashed border-brand-neutral-200 bg-brand-neutral-50 text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
        <Plus className="h-6 w-6 text-white" />
      </div>
      <h4 className="font-semibold text-brand-neutral-900 mb-1">
        No {mealType} planned
      </h4>
      <p className="text-sm text-brand-neutral-600 mb-3">
        {mealType === 'Snacks' 
          ? 'Add snacks to complement your daily nutrition' 
          : 'Generate a meal plan to see your meals here'
        }
      </p>
      {mealType === 'Snacks' ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddSnack}
          className="border-brand-primary-300 text-brand-primary-600 hover:bg-brand-primary-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Snack
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowAIModal}
          disabled={isGenerating}
          className="border-brand-neutral-300"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-1" />
          )}
          Generate Meal Plan
        </Button>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {selectedDayMeals.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-brand-neutral-900 mb-2">No Meals for This Day</h3>
            <p className="text-brand-neutral-600 mb-6">
              Generate an AI-powered meal plan to get started with your daily nutrition.
            </p>
            <Button 
              onClick={onShowAIModal}
              disabled={isGenerating}
              className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white border-0 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        mealTypeConfig.map((mealType) => {
          const meals = mealsByType[mealType.key as keyof typeof mealsByType];
          
          return (
            <Card key={mealType.key} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-brand-neutral-900 flex items-center">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${mealType.gradient} mr-3`}></div>
                  {mealType.name}
                  <Badge variant="secondary" className="ml-2">
                    {meals.length} meals
                  </Badge>
                </h3>
                
                {mealType.key === 'snacks' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddSnack}
                    className="border-brand-primary-300 text-brand-primary-600 hover:bg-brand-primary-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Snack
                  </Button>
                )}
                
                {meals.length > 0 && mealType.key !== 'snacks' && (
                  <div className="text-sm text-brand-neutral-600">
                    {meals.filter(meal => completedMeals.has(meal.id)).length} of {meals.length} completed
                  </div>
                )}
                
                {meals.length > 0 && mealType.key === 'snacks' && (
                  <div className="text-sm text-brand-neutral-600 mr-3">
                    {meals.filter(meal => completedMeals.has(meal.id)).length} of {meals.length} completed
                  </div>
                )}
              </div>
              
              {meals.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex-1 min-w-[300px]">
                      <MealCard meal={meal} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyMealTypeCard mealType={mealType.name} />
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}; 
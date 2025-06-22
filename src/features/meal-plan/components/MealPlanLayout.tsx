import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Utensils, ShoppingCart } from 'lucide-react';
import { MealPlanHeader } from './MealPlanHeader';
import { MealPlanOverview } from './MealPlanOverview';
import { DailyMealsView } from './DailyMealsView';
import { ShoppingListView } from './ShoppingListView';
import { LoadingState } from './loading/LoadingState';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface MealPlanLayoutProps {
  isLoading: boolean;
  currentWeekPlan: WeeklyMealPlan | undefined;
  dailyMeals: DailyMeal[];
  selectedDayNumber: number;
  currentWeekOffset: number;
  completedMeals: Set<string>;
  onDaySelect: (dayNumber: number) => void;
  onWeekOffsetChange: (offset: number) => void;
  onMealComplete: (mealId: string) => void;
  onShowAIModal: () => void;
  onShuffleMeals: () => void;
  onSendShoppingList: () => void;
  onViewRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
}

export const MealPlanLayout: React.FC<MealPlanLayoutProps> = ({
  isLoading,
  currentWeekPlan,
  dailyMeals,
  selectedDayNumber,
  currentWeekOffset,
  completedMeals,
  onDaySelect,
  onWeekOffsetChange,
  onMealComplete,
  onShowAIModal,
  onShuffleMeals,
  onSendShoppingList,
  onViewRecipe,
  onExchangeMeal,
  onAddSnack,
  isGenerating,
  isShuffling
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'shopping'>('overview');

  const sideMenuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'daily', label: 'Daily Meals', icon: Utensils },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        {/* Tab Navigation - Keep visible during loading */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-1">
            {sideMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white shadow-lg'
                    : 'text-brand-neutral-700 hover:bg-brand-neutral-100'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Header - Keep visible during loading */}
        <MealPlanHeader
          activeTab={activeTab}
          currentWeekOffset={currentWeekOffset}
          currentWeekPlan={currentWeekPlan}
          dailyMeals={dailyMeals}
          selectedDayNumber={selectedDayNumber}
          onWeekOffsetChange={onWeekOffsetChange}
          onShowAIModal={onShowAIModal}
          onShuffleMeals={onShuffleMeals}
          onSendShoppingList={onSendShoppingList}
          isGenerating={isGenerating}
          isShuffling={isShuffling}
        />

        {/* Inline Loading State - Replace content area only */}
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-1">
          {sideMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white shadow-lg'
                  : 'text-brand-neutral-700 hover:bg-brand-neutral-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Header */}
      <MealPlanHeader
        activeTab={activeTab}
        currentWeekOffset={currentWeekOffset}
        currentWeekPlan={currentWeekPlan}
        dailyMeals={dailyMeals}
        selectedDayNumber={selectedDayNumber}
        onWeekOffsetChange={onWeekOffsetChange}
        onShowAIModal={onShowAIModal}
        onShuffleMeals={onShuffleMeals}
        onSendShoppingList={onSendShoppingList}
        isGenerating={isGenerating}
        isShuffling={isShuffling}
      />

      {/* Content Area */}
      {activeTab === 'overview' && (
        <MealPlanOverview
          currentWeekPlan={currentWeekPlan}
          dailyMeals={dailyMeals}
          selectedDayNumber={selectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          completedMeals={completedMeals}
          onDaySelect={onDaySelect}
          onMealComplete={onMealComplete}
          onShowAIModal={onShowAIModal}
          onAddSnack={onAddSnack}
          isGenerating={isGenerating}
        />
      )}

      {activeTab === 'daily' && (
        <DailyMealsView
          dailyMeals={dailyMeals}
          selectedDayNumber={selectedDayNumber}
          completedMeals={completedMeals}
          onMealComplete={onMealComplete}
          onViewRecipe={onViewRecipe}
          onExchangeMeal={onExchangeMeal}
          onShowAIModal={onShowAIModal}
          onAddSnack={onAddSnack}
          isGenerating={isGenerating}
        />
      )}

      {activeTab === 'shopping' && (
        <ShoppingListView
          currentWeekPlan={currentWeekPlan}
          dailyMeals={dailyMeals}
          onSendShoppingList={onSendShoppingList}
          onShowAIModal={onShowAIModal}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
}; 
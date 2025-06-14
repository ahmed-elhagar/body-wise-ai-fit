import React from 'react';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanHeader } from './MealPlanHeader';
import { MealPlanLoadingState } from './LoadingState';
import { MealPlanErrorState } from './ErrorState';

interface MealPlanPageLayoutProps {
  // Data props
  currentWeekPlan: any;
  dailyMeals: any[] | null;
  todaysMeals: any[] | null;
  totalCalories: number | null;
  totalProtein: number | null;
  targetDayCalories: number;
  
  // Navigation props
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  
  // Loading states
  isLoading: boolean;
  error: any;
  isGenerating: boolean;
  
  // Credits
  userCredits: number;
  isPro: boolean;
  hasCredits: boolean;
  
  // Dialog states
  showAIDialog: boolean;
  showRecipeDialog: boolean;
  showExchangeDialog: boolean;
  showAddSnackDialog: boolean;
  showShoppingListDialog: boolean;
  
  // Selected items
  selectedMeal: any;
  selectedMealIndex: number | null;
  
  // AI preferences
  aiPreferences: any;
  updateAIPreferences: (prefs: any) => void;
  
  // Actions
  refetch: () => void;
  handleGenerateAIPlan: () => Promise<boolean>;
  
  // Dialog handlers
  openAIDialog: () => void;
  closeAIDialog: () => void;
  openRecipeDialog: (meal: any) => void;
  closeRecipeDialog: () => void;
  openExchangeDialog: (meal: any) => void;
  closeExchangeDialog: () => void;
  openAddSnackDialog: () => void;
  closeAddSnackDialog: () => void;
  openShoppingListDialog: () => void;
  closeShoppingListDialog: () => void;
}

export const MealPlanPageLayout = (props: MealPlanPageLayoutProps) => {
  const {
    isLoading,
    error,
    handleGenerateAIPlan,
    // ... destructure other props
  } = props;

  if (isLoading) {
    return <MealPlanLoadingState />;
  }

  if (error) {
    return <MealPlanErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto">
        <MealPlanHeader {...props} />
        <MealPlanContent 
          {...props} 
          onGenerateAIPlan={async () => {
            const result = await handleGenerateAIPlan();
            return result;
          }}
        />
      </div>
    </div>
  );
};

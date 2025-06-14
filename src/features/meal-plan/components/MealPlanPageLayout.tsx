import React, { useState, useRef } from 'react';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatWeekRange, getDayName } from '@/utils/mealPlanUtils';
import MealPlanHeader from './MealPlanHeader';
import { MealPlanContent } from './MealPlanContent';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';
import { MealPlanViewToggle } from './MealPlanViewToggle';
import { MealExchangeDialog } from './dialogs/MealExchangeDialog';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { EnhancedRecipeDialog } from './EnhancedRecipeDialog';
import EnhancedAddSnackDialog from './dialogs/EnhancedAddSnackDialog';
import ModernShoppingListDrawer from '@/components/shopping-list/ModernShoppingListDrawer';
import { MealPlanAILoadingDialog } from './dialogs/MealPlanAILoadingDialog';

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
  handleGenerateAIPlan: () => Promise<void>;
  
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

export const MealPlanPageLayout = ({
  currentWeekPlan,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  currentWeekOffset,
  setCurrentWeekOffset,
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  isLoading,
  error,
  isGenerating,
  showAIDialog,
  showRecipeDialog,
  showExchangeDialog,
  showAddSnackDialog,
  showShoppingListDialog,
  selectedMeal,
  aiPreferences,
  updateAIPreferences,
  refetch,
  handleGenerateAIPlan,
  openAIDialog,
  closeAIDialog,
  openRecipeDialog,
  closeRecipeDialog,
  openExchangeDialog,
  closeExchangeDialog,
  openAddSnackDialog,
  closeAddSnackDialog,
  openShoppingListDialog,
  closeShoppingListDialog
}: MealPlanPageLayoutProps) => {
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  // Keep track of the last successfully loaded data to show during transitions
  const lastLoadedDataRef = useRef(currentWeekPlan);

  // Update the ref when we have new data and not loading
  if (currentWeekPlan && !isLoading) {
    lastLoadedDataRef.current = currentWeekPlan;
  }

  // Enhanced shuffle handler
  const handleShuffle = async () => {
    if (!currentWeekPlan?.weeklyPlan?.id) {
      console.error('❌ No weekly plan ID available for shuffle');
      return;
    }
    
    console.log('🔄 Starting enhanced shuffle for plan:', currentWeekPlan.weeklyPlan.id);
    const success = await shuffleMeals(currentWeekPlan.weeklyPlan.id);
    
    if (success) {
      // Refetch the meal plan data to show updated distribution
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  };

  // Enhanced week change handler that manages loading states properly
  const handleWeekChange = async (offset: number) => {
    console.log('📅 Week change initiated');
    await setCurrentWeekOffset(offset);
  };

  // Determine what data to display
  const displayData = currentWeekPlan || lastLoadedDataRef.current;

  // Only show full error state if there's an error and no existing data
  if (error && !displayData) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Only show full loading state on initial load (no existing data)
  if (isLoading && !displayData) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header - Always visible */}
        <MealPlanHeader 
          onGenerateAI={() => openAIDialog()}
          onShuffle={handleShuffle}
          onShowShoppingList={() => openShoppingListDialog()}
          onRegeneratePlan={() => openAIDialog()}
          isGenerating={isGenerating}
          isShuffling={isShuffling}
          hasWeeklyPlan={!!displayData?.weeklyPlan}
        />
        
        {/* Navigation Card - Always visible */}
        <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(currentWeekOffset - 1)}
                className="h-10 w-10 p-0 border-gray-300"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  {formatWeekRange(weekStartDate)}
                </h3>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWeekChange(currentWeekOffset + 1)}
                className="h-10 w-10 p-0 border-gray-300"
                aria-label="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <MealPlanViewToggle 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          
          {/* Days Navigation - Always visible */}
          <div className="grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
              const isSelected = selectedDayNumber === dayNumber;
              const dayName = getDayName(dayNumber);
              
              return (
                <Button
                  key={dayNumber}
                  variant="ghost"
                  className={`h-14 p-2 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg scale-105 border-0' 
                      : 'bg-gray-50/80 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 border border-gray-200/50'
                  }`}
                  onClick={() => setSelectedDayNumber(dayNumber)}
                >
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className={`text-xs font-medium ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                      {dayName.slice(0, 3)}
                    </span>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {dayName}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>
        
        {/* Content Area with Loading Overlay - Only over meal content */}
        <div className="relative">
          {/* Main Content - Always rendered with last known data */}
          <MealPlanContent
            viewMode={viewMode}
            currentWeekPlan={displayData}
            selectedDayNumber={selectedDayNumber}
            dailyMeals={dailyMeals}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            targetDayCalories={targetDayCalories}
            weekStartDate={weekStartDate}
            currentWeekOffset={currentWeekOffset}
            isGenerating={isGenerating}
            onViewMeal={(meal) => openRecipeDialog(meal)}
            onExchangeMeal={(meal) => openExchangeDialog(meal)}
            onAddSnack={() => openAddSnackDialog()}
            onGenerateAI={() => openAIDialog()}
            setCurrentWeekOffset={handleWeekChange}
            setSelectedDayNumber={setSelectedDayNumber}
          />
          
          {/* Loading Overlay - Only shows when loading and we have existing data */}
          {isLoading && displayData && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[400px]">
              <div className="flex flex-col items-center gap-3 bg-white rounded-lg shadow-lg p-6 border">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                <p className="text-sm text-gray-700 font-medium">Loading meals...</p>
                <p className="text-xs text-gray-500">Please wait while we fetch your meal plan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Loading Dialog - Step-by-step loading experience */}
      <MealPlanAILoadingDialog 
        isGenerating={isGenerating}
        onClose={() => refetch()}
        position="top-right"
      />

      {/* Modern Shopping List Drawer */}
      <ModernShoppingListDrawer
        isOpen={showShoppingListDialog}
        onClose={() => closeShoppingListDialog()}
        weeklyPlan={currentWeekPlan}
        weekId={currentWeekPlan?.weeklyPlan?.id}
        onShoppingListUpdate={() => {
          console.log('🛒 Shopping list updated');
          refetch();
        }}
      />

      {/* AI Generation Dialog */}
      <AIGenerationDialog
        open={showAIDialog}
        onClose={() => closeAIDialog()}
        preferences={aiPreferences}
        onPreferencesChange={updateAIPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
        hasExistingPlan={!!displayData?.weeklyPlan}
      />

      {/* Enhanced Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => closeAddSnackDialog()}
        selectedDay={selectedDayNumber}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={() => refetch()}
      />

      {/* Enhanced Meal Exchange Dialog */}
      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={() => closeExchangeDialog()}
        meal={selectedMeal}
        onExchangeComplete={() => {
          refetch();
          closeExchangeDialog();
        }}
      />

      {/* Enhanced Recipe Dialog */}
      <EnhancedRecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => closeRecipeDialog()}
        meal={selectedMeal}
        onRecipeUpdated={() => refetch()}
      />
    </>
  );
};

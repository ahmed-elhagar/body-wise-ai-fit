
import MealPlanLayout from "@/components/MealPlanLayout";
import MealPlanHeader from "@/components/MealPlanHeader";
import MealPlanMainContent from "@/components/MealPlanMainContent";
import MealPlanDialogs from "@/components/MealPlanDialogs";

interface MealPlanPageContentProps {
  currentDate: string;
  currentDay: string;
  onShowAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  dietType?: string;
  totalWeeklyCalories?: number;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  viewMode: 'daily' | 'weekly';
  setViewMode: (mode: 'daily' | 'weekly') => void;
  setShowAddSnackDialog: (show: boolean) => void;
  currentWeekPlan: any;
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  setShowShoppingListDialog: (show: boolean) => void;
  handleShowRecipe: (meal: any) => void;
  handleExchangeMeal: (meal: any, index: number) => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (preferences: any) => void;
  handleGenerateAIPlan: () => void;
  showAddSnackDialog: boolean;
  setShowAddSnackDialog: (show: boolean) => void;
  refetch: () => void;
  showShoppingListDialog: boolean;
  setShowShoppingListDialog: (show: boolean) => void;
  convertMealsToShoppingItems: (meals: any[]) => any[];
  showRecipeDialog: boolean;
  setShowRecipeDialog: (show: boolean) => void;
  selectedMeal: any;
  showExchangeDialog: boolean;
  setShowExchangeDialog: (show: boolean) => void;
  selectedMealIndex: number;
  handleRecipeGenerated: () => void;
}

const MealPlanPageContent = (props: MealPlanPageContentProps) => {
  return (
    <MealPlanLayout>
      <div className="space-y-4 sm:space-y-6">
        <MealPlanHeader
          currentDate={props.currentDate}
          currentDay={props.currentDay}
          onShowAIDialog={() => props.setShowAIDialog(true)}
          onRegeneratePlan={props.onRegeneratePlan}
          isGenerating={props.isGenerating}
          isShuffling={props.isShuffling}
          dietType={props.currentWeekPlan?.weeklyPlan?.generation_prompt?.dietType}
          totalWeeklyCalories={props.currentWeekPlan?.weeklyPlan?.total_calories}
        />

        <MealPlanMainContent
          currentWeekOffset={props.currentWeekOffset}
          onWeekChange={props.setCurrentWeekOffset}
          weekStartDate={props.weekStartDate}
          selectedDayNumber={props.selectedDayNumber}
          onDaySelect={props.setSelectedDayNumber}
          viewMode={props.viewMode}
          onViewModeChange={props.setViewMode}
          onAddSnack={() => props.setShowAddSnackDialog(true)}
          onGenerate={() => props.setShowAIDialog(true)}
          currentWeekPlan={props.currentWeekPlan}
          todaysMeals={props.todaysMeals}
          totalCalories={props.totalCalories}
          totalProtein={props.totalProtein}
          onShowShoppingList={() => props.setShowShoppingListDialog(true)}
          onShowRecipe={props.handleShowRecipe}
          onExchangeMeal={props.handleExchangeMeal}
        />

        <MealPlanDialogs
          showAIDialog={props.showAIDialog}
          onCloseAIDialog={() => props.setShowAIDialog(false)}
          aiPreferences={props.aiPreferences}
          onPreferencesChange={props.setAiPreferences}
          onGenerateAI={props.handleGenerateAIPlan}
          isGenerating={props.isGenerating}
          showAddSnackDialog={props.showAddSnackDialog}
          onCloseAddSnackDialog={() => props.setShowAddSnackDialog(false)}
          selectedDay={props.selectedDayNumber}
          weeklyPlanId={props.currentWeekPlan?.weeklyPlan?.id || null}
          onSnackAdded={() => {
            props.refetch();
            props.setShowAddSnackDialog(false);
          }}
          currentDayCalories={props.totalCalories}
          targetDayCalories={2000}
          showShoppingListDialog={props.showShoppingListDialog}
          onCloseShoppingListDialog={() => props.setShowShoppingListDialog(false)}
          shoppingItems={props.convertMealsToShoppingItems(props.todaysMeals)}
          showRecipeDialog={props.showRecipeDialog}
          onCloseRecipeDialog={() => props.setShowRecipeDialog(false)}
          selectedMeal={props.selectedMeal}
          showExchangeDialog={props.showExchangeDialog}
          onCloseExchangeDialog={() => props.setShowExchangeDialog(false)}
          selectedMealIndex={props.selectedMealIndex}
          onExchange={() => {
            props.refetch();
            props.setShowExchangeDialog(false);
          }}
          onRecipeGenerated={props.handleRecipeGenerated}
        />
      </div>
    </MealPlanLayout>
  );
};

export default MealPlanPageContent;

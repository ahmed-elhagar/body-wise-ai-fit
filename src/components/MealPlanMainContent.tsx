
import CompactNavigation from "@/components/CompactNavigation";
import MealPlanContent from "@/components/MealPlanContent";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import ActionSection from "@/components/ActionSection";
import MealPlanGenerationLoading from "@/components/meal-plan/loading/MealPlanGenerationLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar } from "lucide-react";
import type { Meal } from "@/types/meal";

interface MealPlanMainContentProps {
  // Navigation
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
  
  // Day Selection
  selectedDayNumber: number;
  onDaySelect: (day: number) => void;
  
  // View Mode
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  
  // Actions
  onAddSnack: () => void;
  onGenerate: () => void;
  
  // Data
  currentWeekPlan: any;
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  
  // Loading states
  isGenerating?: boolean;
  isShuffling?: boolean;
  
  // Handlers
  onShowShoppingList: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealPlanMainContent = ({
  currentWeekOffset,
  onWeekChange,
  weekStartDate,
  selectedDayNumber,
  onDaySelect,
  viewMode,
  onViewModeChange,
  onAddSnack,
  onGenerate,
  currentWeekPlan,
  todaysMeals,
  totalCalories,
  totalProtein,
  isGenerating = false,
  isShuffling = false,
  onShowShoppingList,
  onShowRecipe,
  onExchangeMeal
}: MealPlanMainContentProps) => {
  return (
    <>
      {/* Generation Loading Overlay */}
      <MealPlanGenerationLoading 
        isGenerating={isGenerating} 
        generationType="initial"
      />

      <div className="space-y-3 px-2 sm:px-4 max-w-7xl mx-auto">
        {/* Enhanced Navigation Section */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm -mx-2 sm:-mx-4 px-2 sm:px-4 py-2 border-b border-gray-200/50 rounded-lg">
          <CompactNavigation
            weekStartDate={weekStartDate}
            selectedDayNumber={selectedDayNumber}
            onDaySelect={onDaySelect}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>

        {!currentWeekPlan ? (
          <div className="px-2 sm:px-0">
            <EmptyMealPlan onGenerate={onGenerate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Enhanced Weekly Overview Sidebar */}
            {viewMode === 'weekly' && (
              <div className="xl:col-span-1 order-2 xl:order-1">
                <div className="sticky top-24 space-y-4">
                  {/* Quick Stats */}
                  <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Weekly Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Total Calories</span>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {currentWeekPlan.weeklyPlan?.total_calories || 0}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Total Protein</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            {currentWeekPlan.weeklyPlan?.total_protein || 0}g
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">Total Meals</span>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                            {currentWeekPlan.dailyMeals?.length || 0}
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Daily Average
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {Math.round((currentWeekPlan.weeklyPlan?.total_calories || 0) / 7)}
                          </div>
                          <div className="text-xs text-gray-500">calories/day</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weekly Progress */}
                  <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Meals Planned</span>
                          <span className="font-semibold text-gray-900">{currentWeekPlan.dailyMeals?.length || 0}/21</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, ((currentWeekPlan.dailyMeals?.length || 0) / 21) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className={`${viewMode === 'weekly' ? 'xl:col-span-3 order-1 xl:order-2' : 'xl:col-span-4'}`}>
              {/* Action Section - Enhanced for weekly view */}
              {viewMode === 'weekly' && (
                <div className="mb-4">
                  <ActionSection
                    viewMode={viewMode}
                    totalCalories={totalCalories}
                    totalProtein={totalProtein}
                    onShowShoppingList={onShowShoppingList}
                    onAddSnack={onAddSnack}
                    showAddSnack={true}
                    showShoppingList={true}
                  />
                </div>
              )}

              {/* Main Content */}
              <div className="px-2 sm:px-0">
                {viewMode === 'weekly' ? (
                  <WeeklyMealPlanView
                    weeklyPlan={currentWeekPlan}
                    onShowRecipe={onShowRecipe}
                    onExchangeMeal={(meal: Meal, dayNumber: number, mealIndex: number) => onExchangeMeal(meal)}
                  />
                ) : (
                  <MealPlanContent
                    viewMode={viewMode}
                    currentWeekPlan={currentWeekPlan}
                    todaysMeals={todaysMeals}
                    onGenerate={onGenerate}
                    onShowRecipe={onShowRecipe}
                    onExchangeMeal={onExchangeMeal}
                    onAddSnack={onAddSnack}
                    onShowShoppingList={onShowShoppingList}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MealPlanMainContent;


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MealPlanLayout } from './MealPlanLayout';
import AIGenerationModal from './AIGenerationModal';
import { useEnhancedMealPlan } from '../hooks/useEnhancedMealPlan';
import { useEnhancedMealShuffle } from '../hooks/useEnhancedMealShuffle';
import { useMealExchange } from '../hooks/useMealExchange';
import { useMealRecipe } from '../hooks/useMealRecipe';
import { useEnhancedShoppingListEmail } from '../hooks/useEnhancedShoppingListEmail';
import type { WeeklyMealPlan, DailyMeal, MealPlanPreferences } from '../types';
import { format, addDays, startOfWeek } from 'date-fns';

// Import missing modal components
import AddSnackDialog from '@/features/food-tracker/components/AddSnackDialog';
import { RecipeViewModal } from './modals/RecipeViewModal';
import { ExchangeMealModal } from './modals/ExchangeMealModal';

export const MealPlanContainer: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [mealPlans, setMealPlans] = useState<WeeklyMealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [dailyMeals, setDailyMeals] = useState<DailyMeal[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  // New modal states
  const [showAddSnackModal, setShowAddSnackModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  // Enhanced hooks
  const { isGenerating, generateMealPlan, hasCredits } = useEnhancedMealPlan();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const { generateAlternatives, exchangeMeal, alternatives, isLoading: isExchanging } = useMealExchange();
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const { sendShoppingListEmail } = useEnhancedShoppingListEmail();

  // Get current week's meal plan
  const getWeekStartDate = (offset: number = 0) => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 6 });
    return addDays(startOfCurrentWeek, offset * 7);
  };

  const weekStartDate = getWeekStartDate(currentWeekOffset);
  const currentWeekPlan = mealPlans?.find(plan => 
    plan.week_start_date === format(weekStartDate, 'yyyy-MM-dd')
  );

  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchMealPlans();
    }
  }, [user?.id]);

  // Fetch daily meals when current week plan changes
  useEffect(() => {
    if (currentWeekPlan) {
      fetchDailyMeals();
    } else {
      setDailyMeals([]);
    }
  }, [currentWeekPlan]);

  // Refetch data when week offset changes
  useEffect(() => {
    if (user?.id) {
      console.log('Week offset changed to:', currentWeekOffset);
      fetchMealPlans(); // Refetch meal plans to get data for new week
    }
  }, [currentWeekOffset, user?.id]);

  // Progress tracking for generation
  useEffect(() => {
    if (isGenerating) {
      setGenerationProgress(0);
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 1000);

      return () => clearInterval(progressInterval);
    } else {
      setGenerationProgress(0);
    }
  }, [isGenerating]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const fetchMealPlans = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching meal plans for user:', user.id);
      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched meal plans:', data?.length || 0);
      
      // Safely convert data with proper type handling
      const convertedPlans: WeeklyMealPlan[] = (data || []).map(plan => ({
        ...plan,
        preferences: plan.generation_prompt || {},
        updated_at: plan.created_at // Use created_at as fallback for updated_at
      }));
      
      setMealPlans(convertedPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      setMealPlans([]);
      toast.error('Failed to load meal plans');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyMeals = async () => {
    if (!currentWeekPlan) return;
    
    try {
      console.log('Fetching daily meals for plan:', currentWeekPlan.id);
      const { data, error } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', currentWeekPlan.id)
        .order('day_number', { ascending: true })
        .order('meal_type', { ascending: true });

      if (error) throw error;
      console.log('Fetched daily meals:', data?.length || 0);
      
      // Safely convert data with proper type handling
      const convertedMeals: DailyMeal[] = (data || []).map(meal => ({
        ...meal,
        meal_type: meal.meal_type as "breakfast" | "lunch" | "dinner" | "snack" | "snack1" | "snack2",
        ingredients: Array.isArray(meal.ingredients) 
          ? meal.ingredients.map((ing: any) => ({
              name: ing?.name || 'Unknown',
              quantity: ing?.quantity || '1',
              unit: ing?.unit || 'piece'
            }))
          : [],
        alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : []
      }));
      
      setDailyMeals(convertedMeals);
    } catch (error) {
      console.error('Error fetching daily meals:', error);
      setDailyMeals([]);
      toast.error('Failed to load daily meals');
    }
  };

  const handleGenerateAIMealPlan = async (preferences: MealPlanPreferences) => {
    if (!hasCredits) {
      toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
      return;
    }

    // Close modal and start inline generation
    setShowAIModal(false);
    
    try {
      const success = await generateMealPlan(preferences, { weekOffset: currentWeekOffset });
      if (success) {
        setGenerationProgress(100);
        await fetchMealPlans(); // Refetch to get the new plan
        toast.success('Meal plan generated successfully!');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate meal plan');
    } finally {
      setGenerationProgress(0);
    }
  };

  const handleShuffleMeals = async () => {
    if (!currentWeekPlan) {
      toast.error('No meal plan to shuffle');
      return;
    }

    const success = await shuffleMeals(currentWeekPlan.id);
    if (success) {
      await fetchDailyMeals();
      toast.success('Meals shuffled successfully!');
    }
  };

  const handleViewRecipe = async (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeModal(true);
  };

  const handleExchangeMeal = async (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowExchangeModal(true);
  };

  const handleAddSnack = () => {
    if (!currentWeekPlan) {
      toast.error('Please generate a meal plan first to add snacks');
      return;
    }
    setShowAddSnackModal(true);
  };

  const handleSendShoppingList = async () => {
    if (!currentWeekPlan) {
      toast.error('No meal plan available for shopping list');
      return;
    }

    const weeklyPlanData = { weeklyPlan: currentWeekPlan, dailyMeals };
    const success = await sendShoppingListEmail(weeklyPlanData);
    if (success) {
      toast.success('Shopping list sent to your email!');
    }
  };

  const handleMealComplete = (mealId: string) => {
    const newCompleted = new Set(completedMeals);
    if (newCompleted.has(mealId)) {
      newCompleted.delete(mealId);
    } else {
      newCompleted.add(mealId);
    }
    setCompletedMeals(newCompleted);
    toast.success(newCompleted.has(mealId) ? 'Meal completed!' : 'Meal unmarked');
  };

  const handleDaySelect = (dayNumber: number) => {
    setSelectedDayNumber(dayNumber);
  };

  const handleWeekOffsetChange = (offset: number) => {
    console.log('Changing week offset from', currentWeekOffset, 'to', offset);
    setCurrentWeekOffset(offset);
  };

  const handleShowAIModal = () => {
    setShowAIModal(true);
  };

  const handleSnackAdded = () => {
    fetchDailyMeals(); // Refresh meals after adding snack
    setShowAddSnackModal(false);
  };

  const handleRecipeGenerated = () => {
    // Refresh meal data if needed
    fetchDailyMeals();
  };

  const handleMealExchanged = () => {
    fetchDailyMeals(); // Refresh meals after exchange
    setShowExchangeModal(false);
  };

  // Calculate remaining calories for snack
  const selectedDayMeals = dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  const currentDayCalories = selectedDayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const targetDayCalories = profile?.weight ? profile.weight * 30 : 2000;

  return (
    <>
      <MealPlanLayout
        isLoading={isLoading || isGenerating}
        currentWeekPlan={currentWeekPlan}
        dailyMeals={dailyMeals}
        selectedDayNumber={selectedDayNumber}
        currentWeekOffset={currentWeekOffset}
        completedMeals={completedMeals}
        onDaySelect={handleDaySelect}
        onWeekOffsetChange={handleWeekOffsetChange}
        onMealComplete={handleMealComplete}
        onShowAIModal={handleShowAIModal}
        onShuffleMeals={handleShuffleMeals}
        onSendShoppingList={handleSendShoppingList}
        onViewRecipe={handleViewRecipe}
        onExchangeMeal={handleExchangeMeal}
        onAddSnack={handleAddSnack}
        isGenerating={isGenerating}
        isShuffling={isShuffling}
      />

      {/* AI Generation Modal */}
      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateAIMealPlan}
        isGenerating={isGenerating}
        progress={generationProgress}
      />

      {/* Add Snack Modal - Only render when we have a valid plan */}
      {currentWeekPlan && (
        <AddSnackDialog
          isOpen={showAddSnackModal}
          onClose={() => setShowAddSnackModal(false)}
          selectedDay={selectedDayNumber}
          weeklyPlanId={currentWeekPlan.id}
          onSnackAdded={handleSnackAdded}
          currentDayCalories={currentDayCalories}
          targetDayCalories={targetDayCalories}
        />
      )}

      {/* Recipe View Modal */}
      <RecipeViewModal
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        meal={selectedMeal}
        onRecipeGenerated={handleRecipeGenerated}
      />

      {/* Exchange Meal Modal */}
      <ExchangeMealModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        meal={selectedMeal}
        onMealExchanged={handleMealExchanged}
      />
    </>
  );
}; 

export default MealPlanContainer;

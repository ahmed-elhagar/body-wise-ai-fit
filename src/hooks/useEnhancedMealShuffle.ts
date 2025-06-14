
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedMealShuffle = () => {
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleMeals = async (weeklyPlanId: string): Promise<boolean> => {
    if (!weeklyPlanId) {
      console.error('❌ No weekly plan ID provided for shuffle');
      return false;
    }

    setIsShuffling(true);
    
    try {
      console.log('🔄 Starting meal shuffle for plan:', weeklyPlanId);
      
      // Get all meals for this weekly plan
      const { data: meals, error: fetchError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlanId)
        .order('day_number', { ascending: true });

      if (fetchError) {
        console.error('❌ Error fetching meals for shuffle:', fetchError);
        throw fetchError;
      }

      if (!meals || meals.length === 0) {
        console.log('ℹ️ No meals found to shuffle');
        toast.error('No meals found to shuffle');
        return false;
      }

      // Group meals by type
      const mealsByType = meals.reduce((acc, meal) => {
        if (!acc[meal.meal_type]) {
          acc[meal.meal_type] = [];
        }
        acc[meal.meal_type].push(meal);
        return acc;
      }, {} as Record<string, any[]>);

      // Shuffle each meal type separately
      const shuffledMeals = [];
      for (const [mealType, typeMeals] of Object.entries(mealsByType)) {
        const shuffled = [...typeMeals].sort(() => Math.random() - 0.5);
        shuffledMeals.push(...shuffled);
      }

      // Update the meals with new day assignments
      const updates = shuffledMeals.map((meal, index) => ({
        id: meal.id,
        day_number: (index % 7) + 1
      }));

      // Batch update the meals
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('daily_meals')
          .update({ day_number: update.day_number })
          .eq('id', update.id);

        if (updateError) {
          console.error('❌ Error updating meal:', updateError);
          throw updateError;
        }
      }

      console.log('✅ Meal shuffle completed successfully');
      toast.success('Meals shuffled successfully!');
      return true;

    } catch (error) {
      console.error('❌ Meal shuffle failed:', error);
      toast.error('Failed to shuffle meals. Please try again.');
      return false;
    } finally {
      setIsShuffling(false);
    }
  };

  return {
    shuffleMeals,
    isShuffling
  };
};

import { useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from "@/hooks/useI18n";
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WeeklyMealPlan } from './useMealPlanData';

interface UseMealPlanActionsProps {
  weeklyPlanId: string | null;
}

export const useMealPlanActions = ({ weeklyPlanId }: UseMealPlanActionsProps) => {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMealPlanMutation = useMutation(
    async (planId: string) => {
      const { error } = await supabase
        .from('weekly_meal_plans')
        .delete()
        .eq('id', planId);

      if (error) {
        throw new Error(error.message || 'Failed to delete meal plan');
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['weeklyMealPlans']);
        toast.success(t('mealPlan.deleteSuccess') || 'Meal plan deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || t('mealPlan.deleteFailed') || 'Failed to delete meal plan.');
      },
      onMutate: () => {
        setIsDeleting(true);
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    }
  );

  const deleteMealPlan = async () => {
    if (!weeklyPlanId) {
      toast.error(t('mealPlan.noPlanToDelete') || 'No meal plan to delete.');
      return;
    }

    deleteMealPlanMutation.mutate(weeklyPlanId);
  };

  const regenerateMealPlan = async (weeklyPlan: WeeklyMealPlan) => {
    if (!weeklyPlanId) {
      toast.error(t('mealPlan.noPlanToRegenerate') || 'No meal plan to regenerate.');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('regenerate-meal-plan', {
        body: {
          weeklyPlanId: weeklyPlanId,
          weeklyPlan: weeklyPlan
        }
      });

      if (error) {
        console.error('❌ Error regenerating meal plan:', error);
        toast.error(t('mealPlan.regenerateFailed') || 'Failed to regenerate meal plan');
        return;
      }

      if (data?.success) {
        toast.success(data.message || t('mealPlan.regenerateSuccess') || 'Meal plan regenerated successfully!');
        queryClient.invalidateQueries(['weeklyMealPlans']);
      } else {
        console.error('❌ Regeneration failed:', data?.error);
        toast.error(data?.error || t('mealPlan.regenerateFailed') || 'Failed to regenerate meal plan');
      }
    } catch (error) {
      console.error('❌ Error regenerating meal plan:', error);
      toast.error(t('mealPlan.regenerateFailed') || 'Failed to regenerate meal plan');
    }
  };

  return {
    deleteMealPlan,
    isDeleting,
    regenerateMealPlan
  };
};

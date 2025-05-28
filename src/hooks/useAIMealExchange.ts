
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface MealAlternative {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
  ingredients: Array<{ name: string; quantity: string; unit: string }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
}

export const useAIMealExchange = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateAlternatives = useMutation({
    mutationFn: async (currentMeal: any) => {
      if (!user?.id) {
        throw new Error('Please sign in to get meal alternatives');
      }

      console.log('Generating meal alternatives for:', currentMeal.name);

      const { data, error } = await supabase.functions.invoke('generate-meal-alternatives', {
        body: {
          currentMeal,
          userProfile: profile || {},
          preferences: {
            dietaryRestrictions: profile?.dietary_restrictions || [],
            allergies: profile?.allergies || [],
            preferredFoods: profile?.preferred_foods || []
          }
        }
      });

      if (error) {
        console.error('Meal alternatives generation error:', error);
        throw new Error(error.message || 'Failed to generate meal alternatives');
      }

      return data.alternatives || [];
    },
    onError: (error: any) => {
      console.error('Error generating meal alternatives:', error);
      toast.error(`Failed to generate alternatives: ${error.message}`);
    },
  });

  return {
    generateAlternatives: generateAlternatives.mutate,
    isGenerating: generateAlternatives.isPending,
    alternatives: generateAlternatives.data || [],
  };
};


import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useAIMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateMealPlan = async (preferences: any) => {
    if (!user || !profile) {
      toast.error('Please complete your profile first');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating meal plan with preferences:', preferences);
      
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: {
            id: user.id,
            age: profile.age,
            gender: profile.gender,
            weight: profile.weight,
            height: profile.height,
            fitness_goal: profile.fitness_goal,
            activity_level: profile.activity_level,
            nationality: profile.nationality,
            allergies: profile.allergies,
            dietary_restrictions: profile.dietary_restrictions
          },
          preferences
        }
      });

      if (error) {
        throw error;
      }

      console.log('Meal plan generated successfully:', data);
      toast.success('Your personalized meal plan has been generated!');
      
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      toast.error(error.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating
  };
};

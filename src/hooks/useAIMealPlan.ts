
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { MealPlanPreferences } from '@/types/mealPlan';

export const useAIMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateMealPlan = async (preferences: MealPlanPreferences) => {
    if (!user || !profile) {
      toast.error('Please complete your profile first');
      return;
    }

    // Validate required profile data
    if (!profile.age || !profile.weight || !profile.height || !profile.fitness_goal) {
      toast.error('Please complete your profile with age, weight, height, and fitness goal');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting AI meal plan generation...');
      console.log('User Profile:', {
        id: user.id,
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: profile.height,
        fitness_goal: profile.fitness_goal,
        activity_level: profile.activity_level,
        nationality: profile.nationality
      });
      console.log('Preferences:', preferences);

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
            allergies: profile.allergies || [],
            dietary_restrictions: profile.dietary_restrictions || []
          },
          preferences: {
            duration: preferences.duration || '7',
            cuisine: preferences.cuisine || '',
            maxPrepTime: preferences.maxPrepTime || '45',
            mealTypes: preferences.mealTypes || 'all',
            dietaryRestrictions: preferences.dietaryRestrictions || [],
            allergies: preferences.allergies || []
          }
        }
      });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw error;
      }

      console.log('✅ Meal plan generated successfully!');
      
      // Show success message with generation count if available
      if (data?.generationsRemaining !== undefined) {
        toast.success(`Meal plan generated! ${data.generationsRemaining} AI generations remaining.`);
      } else {
        toast.success('Your personalized meal plan has been generated!');
      }
      
      // Force reload the meal plan data
      window.location.reload();
      
    } catch (error: any) {
      console.error('❌ Error generating meal plan:', error);
      
      // Handle specific error cases
      if (error.message?.includes('generations')) {
        toast.error('You have reached your AI generation limit. Please contact support.');
      } else if (error.message?.includes('profile')) {
        toast.error('Please complete your profile before generating a meal plan.');
      } else {
        toast.error(error.message || 'Failed to generate meal plan. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating
  };
};

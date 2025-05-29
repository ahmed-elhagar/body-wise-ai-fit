
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface GenerateMealPlanOptions {
  weekOffset?: number;
}

export const useAIMealPlan = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const generateMealPlan = async (preferences: any, options: GenerateMealPlanOptions = {}) => {
    if (!user?.id) {
      toast.error("Please log in to generate meal plans");
      return;
    }

    // Check if user has generations remaining
    if (profile?.ai_generations_remaining === 0) {
      toast.error("You have reached your AI generation limit. Please contact admin to increase your limit.");
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log("🚀 Starting AI meal plan generation...");
      console.log("User Profile:", {
        id: user.id,
        age: profile?.age,
        gender: profile?.gender,
        weight: profile?.weight,
        height: profile?.height,
        fitness_goal: profile?.fitness_goal,
        activity_level: profile?.activity_level,
        nationality: profile?.nationality
      });
      console.log("Preferences:", preferences);
      console.log("Week Offset:", options.weekOffset || 0);

      // Validate week offset
      const weekOffset = options.weekOffset || 0;
      if (weekOffset < -52 || weekOffset > 52) {
        throw new Error("Week offset must be between -52 and 52 weeks");
      }

      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          userProfile: {
            id: user.id,
            age: profile?.age,
            gender: profile?.gender,
            weight: profile?.weight,
            height: profile?.height,
            fitness_goal: profile?.fitness_goal,
            activity_level: profile?.activity_level,
            nationality: profile?.nationality,
            allergies: profile?.allergies || [],
            dietary_restrictions: profile?.dietary_restrictions || []
          },
          preferences: {
            ...preferences,
            allergies: profile?.allergies || [],
            dietary_restrictions: profile?.dietary_restrictions || [],
            weekOffset: weekOffset
          }
        }
      });

      if (error) {
        console.error("❌ Supabase function error:", error);
        throw error;
      }

      if (!data?.success) {
        console.error("❌ Generation failed:", data);
        throw new Error(data?.error || 'Failed to generate meal plan');
      }

      console.log("✅ Meal plan generated successfully:", data);
      toast.success(`✨ ${data.message || 'Meal plan generated successfully!'}`);
      
      return { ...data, weekOffset: weekOffset };
      
    } catch (error: any) {
      console.error("❌ Error generating meal plan:", error);
      
      // Handle specific error messages
      if (error.message?.includes('generation limit')) {
        toast.error("You have reached your AI generation limit. Please contact admin to increase your limit.");
      } else if (error.message?.includes('Authentication required')) {
        toast.error("Please log in again to generate meal plans.");
      } else if (error.message?.includes('Week offset')) {
        toast.error("Invalid week selection. Please choose a week within the allowed range.");
      } else if (error.message?.includes('timeout')) {
        toast.error("Generation is taking longer than expected. Please try again.");
      } else {
        toast.error(error.message || "Failed to generate meal plan. Please try again.");
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating
  };
};

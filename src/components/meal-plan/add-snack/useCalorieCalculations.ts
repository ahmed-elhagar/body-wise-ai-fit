
import { useProfile } from "@/hooks/useProfile";

export const useCalorieCalculations = (
  currentDayCalories: number,
  targetDayCalories: number
) => {
  const { profile } = useProfile();

  const getDynamicTargetCalories = () => {
    if (profile?.weight && profile?.height && profile?.age) {
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85;
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15;
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    return targetDayCalories || 2000;
  };

  const dynamicTargetCalories = getDynamicTargetCalories();
  const remainingCalories = Math.max(0, dynamicTargetCalories - currentDayCalories);
  const progressPercentage = Math.min((currentDayCalories / dynamicTargetCalories) * 100, 100);

  return {
    dynamicTargetCalories,
    remainingCalories,
    progressPercentage
  };
};

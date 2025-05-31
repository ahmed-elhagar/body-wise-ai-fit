
export const calculateDailyCalories = (userProfile: any): number => {
  if (!userProfile.age || !userProfile.weight || !userProfile.height || !userProfile.gender) {
    return 2000; // Default fallback
  }

  // Mifflin-St Jeor Equation
  let bmr: number;
  if (userProfile.gender === 'male') {
    bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
  } else {
    bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
  }

  // Activity level multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'lightly_active': 1.375,
    'moderately_active': 1.55,
    'very_active': 1.725,
    'extra_active': 1.9
  };

  const activityLevel = userProfile.activity_level || 'moderately_active';
  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55;

  return Math.round(bmr * multiplier);
};

export const calculateLifePhaseAdjustments = (userProfile: any): number => {
  let extraCalories = 0;

  // Pregnancy adjustments
  if (userProfile.pregnancy_trimester === 2) {
    extraCalories += 340;
  } else if (userProfile.pregnancy_trimester === 3) {
    extraCalories += 450;
  }

  // Breastfeeding adjustments
  if (userProfile.breastfeeding_level === 'exclusive') {
    extraCalories += 400;
  } else if (userProfile.breastfeeding_level === 'partial') {
    extraCalories += 250;
  }

  return extraCalories;
};

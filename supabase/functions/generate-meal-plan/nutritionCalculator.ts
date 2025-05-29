
interface UserProfile {
  gender?: string;
  weight?: number;
  height?: number;
  age?: number;
  activity_level?: string;
}

interface ActivityMultipliers {
  [key: string]: number;
}

export const calculateDailyCalories = (userProfile: UserProfile): number => {
  if (!userProfile.weight || !userProfile.height || !userProfile.age) {
    return 2000; // Default fallback
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = userProfile.gender === 'male' 
    ? 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)
    : 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);

  const activityMultipliers: ActivityMultipliers = {
    'sedentary': 1.2,
    'lightly_active': 1.375,
    'moderately_active': 1.55,
    'very_active': 1.725,
    'extremely_active': 1.9
  };

  const activityMultiplier = activityMultipliers[userProfile.activity_level || 'moderately_active'] || 1.55;
  return Math.round(bmr * activityMultiplier);
};

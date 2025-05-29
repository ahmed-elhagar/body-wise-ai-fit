
export const processRequest = async (req: Request) => {
  const { userData, preferences, userLanguage } = await req.json();
  
  const finalUserLanguage = userLanguage || userData?.preferred_language || preferences?.userLanguage || 'en';

  console.log('🚀 Exercise generation request received:', {
    userId: userData?.userId?.substring(0, 8) + '...',
    workoutType: preferences?.workoutType,
    weekStartDate: preferences?.weekStartDate,
    weekOffset: preferences?.weekOffset,
    goalType: preferences?.goalType,
    fitnessLevel: preferences?.fitnessLevel,
    userLanguage: finalUserLanguage
  });

  if (!userData?.userId) {
    throw new Error('User ID is required');
  }

  return { userData, preferences, finalUserLanguage };
};

export const enhanceUserData = (userData: any, userLanguage: string) => {
  return {
    ...userData,
    preferred_language: userLanguage
  };
};

export const enhancePreferences = (preferences: any, workoutType: string, userLanguage: string) => {
  return {
    ...preferences,
    userLanguage,
    workoutType,
    weekStartDate: preferences?.weekStartDate,
    weekOffset: preferences?.weekOffset
  };
};

export const validateWorkoutType = (workoutType: string) => {
  if (!['home', 'gym'].includes(workoutType)) {
    throw new Error('Invalid workout type. Must be "home" or "gym"');
  }
};

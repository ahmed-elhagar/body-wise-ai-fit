
export const generateMealPlanPrompt = (
  userProfile: any,
  preferences: any,
  dailyCalories: number,
  includeSnacks: boolean
): string => {
  const language = preferences?.language || userProfile?.preferred_language || 'en';
  const isArabic = language === 'ar';
  
  const mealsPerDay = includeSnacks ? 5 : 3;
  const mealTypes = includeSnacks 
    ? ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    : ['breakfast', 'lunch', 'dinner'];

  const culturalContext = buildCulturalContext(userProfile.nationality, language);
  const dietaryRestrictions = buildDietaryRestrictions(userProfile, language);

  const basePrompt = isArabic ? buildArabicPrompt() : buildEnglishPrompt();
  
  return `${basePrompt}

User Profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activity_level}
- Daily Calorie Target: ${dailyCalories} calories
- Nationality: ${userProfile.nationality || 'International'}

Preferences:
- Cuisine: ${preferences.cuisine || 'mixed'}
- Max Prep Time: ${preferences.maxPrepTime || '30'} minutes
- Meal Types: ${mealTypes.join(', ')}

${dietaryRestrictions}
${culturalContext}

Generate a complete 7-day meal plan with exactly ${mealsPerDay} meals per day.
Return as valid JSON with the specified structure.`;
};

const buildCulturalContext = (nationality: string, language: string): string => {
  const isArabic = language === 'ar';
  
  if (nationality?.includes('Saudi') || nationality?.includes('Arab') || nationality?.includes('Middle East')) {
    return isArabic 
      ? 'السياق الثقافي: ركز على الأطعمة العربية والشرق أوسطية، التمر، المكسرات، الأرز، اللحوم المشوية، والخضروات الطازجة.'
      : 'Cultural Context: Focus on Arabic and Middle Eastern foods including dates, nuts, rice, grilled meats, and fresh vegetables.';
  }
  
  return isArabic 
    ? 'السياق الثقافي: مزج من الأطعمة العالمية مع التركيز على التوازن الغذائي.'
    : 'Cultural Context: International mix of foods focusing on nutritional balance.';
};

const buildDietaryRestrictions = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  const restrictions = userProfile.dietary_restrictions || [];
  const allergies = userProfile.allergies || [];
  
  if (restrictions.length === 0 && allergies.length === 0) return '';
  
  const title = isArabic ? 'القيود الغذائية:' : 'Dietary Restrictions:';
  const restrictionText = restrictions.length > 0 
    ? `${isArabic ? 'قيود:' : 'Restrictions:'} ${restrictions.join(', ')}`
    : '';
  const allergyText = allergies.length > 0 
    ? `${isArabic ? 'حساسية:' : 'Allergies:'} ${allergies.join(', ')}`
    : '';
    
  return `${title}\n${restrictionText}\n${allergyText}`;
};

const buildEnglishPrompt = (): string => {
  return `You are a professional nutritionist AI specializing in personalized meal planning.
Create a comprehensive 7-day meal plan that is culturally appropriate and nutritionally balanced.`;
};

const buildArabicPrompt = (): string => {
  return `أنت خبير تغذية بالذكاء الاصطناعي متخصص في التخطيط المخصص للوجبات.
أنشئ خطة وجبات شاملة لمدة 7 أيام تكون مناسبة ثقافياً ومتوازنة غذائياً.`;
};

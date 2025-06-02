export const generateEnhancedMealPlanPrompt = (
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

  // Build enhanced user profile section
  const profileSection = buildEnhancedProfileSection(userProfile, language);
  const healthSection = buildHealthConditionsSection(userProfile, language);
  const specialConditionsSection = buildSpecialConditionsSection(userProfile, language);
  const culturalContext = buildCulturalContext(userProfile.nationality, language);
  const dietaryRestrictions = buildDietaryRestrictions(userProfile, language);

  const basePrompt = isArabic ? buildArabicPrompt() : buildEnglishPrompt();
  
  const enhancedPrompt = `${basePrompt}

${profileSection}

${healthSection}

${specialConditionsSection}

Preferences:
- Cuisine: ${preferences.cuisine || 'mixed'}
- Max Prep Time: ${preferences.maxPrepTime || '30'} minutes
- Meal Types: ${mealTypes.join(', ')}
- Include Snacks: ${includeSnacks ? 'Yes' : 'No'}
- Meals Per Day: ${mealsPerDay}

${dietaryRestrictions}
${culturalContext}

IMPORTANT MEAL STRUCTURE:
- Generate exactly ${mealsPerDay} meals per day for 7 days
- Meal types: ${mealTypes.join(', ')}
${includeSnacks ? '- Snack1: Mid-morning snack (150-200 calories)\n- Snack2: Afternoon snack (150-200 calories)' : ''}
- Each meal should have complete nutrition information
- Total daily calories should be approximately ${dailyCalories} calories

Generate a complete 7-day meal plan with exactly ${mealsPerDay} meals per day.
Return as valid JSON with the specified structure.`;

  return enhancedPrompt;
};

const buildEnhancedProfileSection = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  
  const title = isArabic ? 'الملف الشخصي للمستخدم:' : 'Enhanced User Profile:';
  
  return `${title}
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activity_level}
- Fitness Goal: ${userProfile.fitness_goal}
- Nationality: ${userProfile.nationality || 'International'}
- Language: ${userProfile.preferred_language || language}`;
};

const buildHealthConditionsSection = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  const healthConditions = userProfile.health_conditions || [];
  
  if (healthConditions.length === 0) return '';
  
  const title = isArabic ? 'الحالات الصحية:' : 'Health Conditions:';
  
  return `${title}
- Conditions: ${healthConditions.join(', ')}
- Special dietary considerations required for these conditions`;
};

const buildSpecialConditionsSection = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  const specialConditions = userProfile.special_conditions || [];
  
  let sections = [];
  
  // Pregnancy
  if (userProfile.pregnancy_trimester) {
    const title = isArabic ? 'الحمل:' : 'Pregnancy:';
    const trimesterText = isArabic ? `الثلث ${userProfile.pregnancy_trimester}` : `Trimester ${userProfile.pregnancy_trimester}`;
    sections.push(`${title} ${trimesterText} - Additional nutrition requirements`);
  }
  
  // Breastfeeding
  if (userProfile.breastfeeding_level) {
    const title = isArabic ? 'الرضاعة الطبيعية:' : 'Breastfeeding:';
    sections.push(`${title} ${userProfile.breastfeeding_level} - Increased caloric needs`);
  }
  
  // Fasting
  if (userProfile.fasting_type) {
    const title = isArabic ? 'الصيام:' : 'Fasting:';
    sections.push(`${title} ${userProfile.fasting_type} - Meal timing considerations`);
  }
  
  // Other special conditions
  if (specialConditions.length > 0) {
    const title = isArabic ? 'حالات خاصة أخرى:' : 'Other Special Conditions:';
    sections.push(`${title} ${specialConditions.join(', ')}`);
  }
  
  return sections.length > 0 ? `Special Conditions:\n${sections.join('\n')}` : '';
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
  return `You are a professional nutritionist AI specializing in personalized meal planning with advanced health condition awareness.
Create a comprehensive 7-day meal plan that is culturally appropriate, nutritionally balanced, and considers all health conditions and special circumstances.`;
};

const buildArabicPrompt = (): string => {
  return `أنت خبير تغذية بالذكاء الاصطناعي متخصص في التخطيط المخصص للوجبات مع الوعي المتقدم بالحالات الصحية.
أنشئ خطة وجبات شاملة لمدة 7 أيام تكون مناسبة ثقافياً ومتوازنة غذائياً وتراعي جميع الحالات الصحية والظروف الخاصة.`;
};

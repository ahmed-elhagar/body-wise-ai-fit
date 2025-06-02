
export const buildNutritionContext = (userProfile: any) => {
  const context = {
    isPregnant: !!userProfile.pregnancy_trimester,
    pregnancyTrimester: userProfile.pregnancy_trimester,
    isBreastfeeding: !!userProfile.breastfeeding_level,
    breastfeedingLevel: userProfile.breastfeeding_level,
    isMuslimFasting: userProfile.fasting_type === 'ramadan' || userProfile.fasting_type === 'islamic',
    fastingType: userProfile.fasting_type,
    hasHealthConditions: (userProfile.health_conditions || []).length > 0,
    healthConditions: userProfile.health_conditions || [],
    hasSpecialConditions: (userProfile.special_conditions || []).length > 0,
    specialConditions: userProfile.special_conditions || [],
    extraCalories: 0
  };

  // Calculate extra calories for pregnancy
  if (context.pregnancyTrimester === 2) {
    context.extraCalories += 340;
  } else if (context.pregnancyTrimester === 3) {
    context.extraCalories += 450;
  }

  // Calculate extra calories for breastfeeding
  if (context.breastfeedingLevel === 'exclusive') {
    context.extraCalories += 400;
  } else if (context.breastfeedingLevel === 'partial') {
    context.extraCalories += 250;
  }

  return context;
};

export const enhancePromptWithLifePhase = (basePrompt: string, nutritionContext: any, language: string): string => {
  const isArabic = language === 'ar';
  let enhancements = [];

  if (nutritionContext.isPregnant) {
    const pregnancyText = isArabic 
      ? `الحمل - الثلث ${nutritionContext.pregnancyTrimester}: تحتاج لتغذية إضافية للأم والجنين`
      : `Pregnancy - Trimester ${nutritionContext.pregnancyTrimester}: Requires additional nutrition for mother and baby`;
    enhancements.push(pregnancyText);
  }

  if (nutritionContext.isBreastfeeding) {
    const breastfeedingText = isArabic
      ? `الرضاعة الطبيعية (${nutritionContext.breastfeedingLevel}): تحتاج سعرات حرارية إضافية`
      : `Breastfeeding (${nutritionContext.breastfeedingLevel}): Requires additional calories`;
    enhancements.push(breastfeedingText);
  }

  if (nutritionContext.isMuslimFasting) {
    const fastingText = isArabic
      ? 'الصيام الإسلامي: يجب مراعاة أوقات الإفطار والسحور'
      : 'Islamic Fasting: Must consider Iftar and Suhur meal timing';
    enhancements.push(fastingText);
  }

  if (nutritionContext.hasHealthConditions) {
    const healthText = isArabic
      ? `حالات صحية: ${nutritionContext.healthConditions.join(', ')}`
      : `Health Conditions: ${nutritionContext.healthConditions.join(', ')}`;
    enhancements.push(healthText);
  }

  if (enhancements.length > 0) {
    const enhancementHeader = isArabic
      ? '\n\nاعتبارات خاصة مهمة:'
      : '\n\nIMPORTANT SPECIAL CONSIDERATIONS:';
    
    return basePrompt + enhancementHeader + '\n- ' + enhancements.join('\n- ');
  }

  return basePrompt;
};

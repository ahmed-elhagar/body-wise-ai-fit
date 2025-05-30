
interface LifePhaseContext {
  fastingType?: string;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  extraCalories: number;
  needsHydrationReminders: boolean;
  isRamadan: boolean;
}

export const buildNutritionContext = (userProfile: any): LifePhaseContext => {
  const extraCalories = calculateExtraCalories(userProfile);
  
  return {
    fastingType: userProfile.fasting_type,
    pregnancyTrimester: userProfile.pregnancy_trimester,
    breastfeedingLevel: userProfile.breastfeeding_level,
    extraCalories,
    needsHydrationReminders: !!(userProfile.fasting_type === 'ramadan' || userProfile.breastfeeding_level),
    isRamadan: userProfile.fasting_type === 'ramadan'
  };
};

export const calculateExtraCalories = (userProfile: any): number => {
  if (userProfile.pregnancy_trimester === 2) return 340;
  if (userProfile.pregnancy_trimester === 3) return 450;
  if (userProfile.breastfeeding_level === 'exclusive') return 400;
  if (userProfile.breastfeeding_level === 'partial') return 250;
  return 0;
};

export const enhancePromptWithLifePhase = (
  basePrompt: string, 
  nutritionContext: LifePhaseContext,
  language: string
): string => {
  let enhancedPrompt = basePrompt;

  // Add life-phase specific instructions
  if (nutritionContext.isRamadan) {
    enhancedPrompt += language === 'ar' ? 
      `\n\nتعليمات رمضان:\n- استبدل وجبة الإفطار بـ "السحور" ووجبة العشاء بـ "الإفطار"\n- ركز على الأطعمة المرطبة والمغذية\n- اقترح وجبة خفيفة ليلية إذا لزم الأمر` :
      `\n\nRamadan Instructions:\n- Replace breakfast with "Suhoor" and dinner with "Iftar"\n- Focus on hydrating and nutritious foods\n- Suggest a night snack if needed`;
  }

  if (nutritionContext.pregnancyTrimester) {
    enhancedPrompt += language === 'ar' ?
      `\n\nتعليمات الحمل (الثلث ${nutritionContext.pregnancyTrimester}):\n- أضف ${nutritionContext.extraCalories} سعرة حرارية إضافية\n- ركز على الأطعمة الغنية بالحديد وحمض الفوليك والكالسيوم\n- تجنب الأطعمة النيئة والأسماك عالية الزئبق` :
      `\n\nPregnancy Instructions (Trimester ${nutritionContext.pregnancyTrimester}):\n- Add ${nutritionContext.extraCalories} extra calories\n- Focus on iron-rich, folate, and calcium foods\n- Avoid raw foods and high-mercury fish`;
  }

  if (nutritionContext.breastfeedingLevel) {
    enhancedPrompt += language === 'ar' ?
      `\n\nتعليمات الرضاعة الطبيعية:\n- أضف ${nutritionContext.extraCalories} سعرة حرارية إضافية\n- ركز على الأطعمة المرطبة والغنية بالبروتين\n- اقترح وجبات خفيفة مغذية بين الوجبات` :
      `\n\nBreastfeeding Instructions:\n- Add ${nutritionContext.extraCalories} extra calories\n- Focus on hydrating and protein-rich foods\n- Suggest nutritious snacks between meals`;
  }

  if (nutritionContext.needsHydrationReminders) {
    enhancedPrompt += language === 'ar' ?
      `\n\nتذكير الترطيب: اقترح أطعمة غنية بالماء وتذكير بشرب السوائل` :
      `\n\nHydration Reminder: Suggest water-rich foods and fluid intake reminders`;
  }

  return enhancedPrompt;
};

export const validateLifePhaseMealPlan = (generatedPlan: any, nutritionContext: LifePhaseContext): boolean => {
  if (!generatedPlan?.days) return false;

  // Validate Ramadan schedule
  if (nutritionContext.isRamadan) {
    const sampleDay = generatedPlan.days[0];
    const hasSuhoor = sampleDay?.meals?.some((meal: any) => meal.type === 'suhoor' || meal.name?.toLowerCase().includes('suhoor'));
    const hasIftar = sampleDay?.meals?.some((meal: any) => meal.type === 'iftar' || meal.name?.toLowerCase().includes('iftar'));
    
    if (!hasSuhoor || !hasIftar) {
      console.warn('Ramadan meal plan validation failed: missing Suhoor or Iftar');
      return false;
    }
  }

  // Validate calorie adjustment
  if (nutritionContext.extraCalories > 0) {
    const weekSummary = generatedPlan.weekSummary;
    const expectedMinCalories = (2000 + nutritionContext.extraCalories) * 7; // Base assumption
    
    if (weekSummary?.totalCalories < expectedMinCalories * 0.9) { // 10% tolerance
      console.warn('Life-phase calorie adjustment validation failed');
      return false;
    }
  }

  return true;
};

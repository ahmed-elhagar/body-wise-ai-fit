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
  const dietarySection = buildDietaryRestrictionsSection(userProfile, language);
  const specialConditionsSection = buildSpecialConditionsSection(userProfile, language);
  const culturalContext = buildCulturalContext(userProfile.nationality, language);

  const basePrompt = isArabic ? buildArabicPrompt() : buildEnglishPrompt();
  
  const enhancedPrompt = `${basePrompt}

${profileSection}

${healthSection}

${dietarySection}

${specialConditionsSection}

Preferences:
- Cuisine: ${preferences.cuisine || 'mixed'}
- Max Prep Time: ${preferences.maxPrepTime || '30'} minutes
- Meal Types: ${mealTypes.join(', ')}
- Include Snacks: ${includeSnacks ? 'Yes' : 'No'}
- Meals Per Day: ${mealsPerDay}

${culturalContext}

CRITICAL HEALTH-AWARE MEAL PLANNING REQUIREMENTS:
- STRICTLY AVOID all ingredients that trigger allergies or health conditions
- PRIORITIZE foods that support the user's health conditions
- ENSURE each meal is medically appropriate for their conditions
- INCLUDE anti-inflammatory foods if relevant
- BALANCE macronutrients according to health needs
- CONSIDER medication interactions with foods
- ADAPT portion sizes and timing based on health conditions

CRITICAL MEAL STRUCTURE REQUIREMENTS:
- Generate exactly ${mealsPerDay} meals per day for 7 days (total: ${mealsPerDay * 7} meals)
- Meal types MUST be: ${mealTypes.join(', ')}
${includeSnacks ? '- Snack1: Mid-morning snack (150-200 calories)\n- Snack2: Afternoon snack (150-200 calories)' : ''}
- Each meal MUST have: name, type, calories, protein, carbs, fat, prep_time, cook_time, servings, ingredients (array), instructions (array), alternatives (array)
- Total daily calories should be approximately ${dailyCalories} calories
- Each day MUST have exactly ${mealsPerDay} meals with the correct meal types

JSON Structure Requirements:
- Return valid JSON with "days" array containing 7 day objects
- Each day has "day" number (1-7) and "meals" array
- Each meal object must include ALL required fields with correct data types
- ingredients: array of strings
- instructions: array of strings  
- alternatives: array of strings
- All numeric values (calories, protein, carbs, fat) must be numbers, not strings

Generate a complete 7-day meal plan with exactly ${mealsPerDay} meals per day that is SAFE and BENEFICIAL for the user's health conditions.`;

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
  
  const title = isArabic ? 'الحالات الصحية المهمة:' : 'CRITICAL HEALTH CONDITIONS:';
  
  const conditionGuidelines = healthConditions.map(condition => {
    return getHealthConditionGuidelines(condition, language);
  }).join('\n');
  
  return `${title}
- Diagnosed Conditions: ${healthConditions.join(', ')}
- CRITICAL: Meal plan MUST accommodate these conditions
${conditionGuidelines}`;
};

const buildDietaryRestrictionsSection = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  const restrictions = userProfile.dietary_restrictions || [];
  const allergies = userProfile.allergies || [];
  
  if (restrictions.length === 0 && allergies.length === 0) return '';
  
  const title = isArabic ? 'القيود الغذائية الصارمة:' : 'STRICT DIETARY RESTRICTIONS:';
  
  let content = `${title}\n`;
  
  if (allergies.length > 0) {
    content += `- ALLERGIES (MUST AVOID): ${allergies.join(', ')}\n`;
    content += `- WARNING: These ingredients are DANGEROUS and must be completely avoided\n`;
  }
  
  if (restrictions.length > 0) {
    content += `- DIETARY RESTRICTIONS: ${restrictions.join(', ')}\n`;
    content += `- IMPORTANT: These restrictions must be strictly followed\n`;
  }
    
  return content;
};

const buildSpecialConditionsSection = (userProfile: any, language: string): string => {
  const isArabic = language === 'ar';
  let sections = [];
  
  // Pregnancy
  if (userProfile.pregnancy_trimester) {
    const title = isArabic ? 'الحمل:' : 'Pregnancy:';
    const trimesterText = isArabic ? `الثلث ${userProfile.pregnancy_trimester}` : `Trimester ${userProfile.pregnancy_trimester}`;
    sections.push(`${title} ${trimesterText} - Increased folate, iron, calcium needs. Avoid raw fish, deli meats, high mercury fish.`);
  }
  
  // Breastfeeding
  if (userProfile.breastfeeding_level) {
    const title = isArabic ? 'الرضاعة الطبيعية:' : 'Breastfeeding:';
    sections.push(`${title} ${userProfile.breastfeeding_level} - Additional 500 calories needed. Focus on nutrient-dense foods.`);
  }
  
  // Fasting
  if (userProfile.fasting_type) {
    const title = isArabic ? 'الصيام:' : 'Fasting:';
    sections.push(`${title} ${userProfile.fasting_type} - Adjust meal timing and ensure adequate nutrition during eating windows.`);
  }
  
  // Other special conditions
  const specialConditions = userProfile.special_conditions || [];
  if (specialConditions.length > 0) {
    const title = isArabic ? 'حالات خاصة أخرى:' : 'Other Special Conditions:';
    sections.push(`${title} ${specialConditions.join(', ')}`);
  }
  
  return sections.length > 0 ? `Special Life Phase Considerations:\n${sections.join('\n')}` : '';
};

const getHealthConditionGuidelines = (condition: string, language: string): string => {
  const isArabic = language === 'ar';
  
  const guidelines: { [key: string]: { en: string; ar: string } } = {
    'PCOS': {
      en: '- PCOS: Low glycemic index foods, anti-inflammatory ingredients, avoid refined sugars and processed foods',
      ar: '- متلازمة تكيس المبايض: أطعمة منخفضة المؤشر الغلايسيمي، مكونات مضادة للالتهابات، تجنب السكريات المكررة والأطعمة المعالجة'
    },
    'Type 1 Diabetes': {
      en: '- Type 1 Diabetes: Consistent carbohydrate counting, avoid simple sugars, focus on complex carbs and fiber',
      ar: '- السكري النوع الأول: حساب الكربوهيدرات الثابت، تجنب السكريات البسيطة، التركيز على الكربوهيدرات المعقدة والألياف'
    },
    'Type 2 Diabetes': {
      en: '- Type 2 Diabetes: Low glycemic foods, portion control, high fiber, minimal processed foods',
      ar: '- السكري النوع الثاني: أطعمة منخفضة المؤشر الغلايسيمي، التحكم في الحصص، ألياف عالية، أطعمة معالجة قليلة'
    },
    'Hypertension': {
      en: '- Hypertension: Low sodium (under 2300mg/day), DASH diet principles, potassium-rich foods',
      ar: '- ارتفاع ضغط الدم: صوديوم منخفض (أقل من 2300 مجم/يوم)، مبادئ حمية DASH، أطعمة غنية بالبوتاسيوم'
    },
    'High Cholesterol': {
      en: '- High Cholesterol: Limit saturated fats, avoid trans fats, include omega-3 fatty acids and soluble fiber',
      ar: '- ارتفاع الكوليسترول: تقليل الدهون المشبعة، تجنب الدهون المتحولة، تشمل أحماض أوميغا-3 الدهنية والألياف القابلة للذوبان'
    },
    'Celiac Disease': {
      en: '- Celiac Disease: STRICTLY gluten-free, avoid wheat, barley, rye, and cross-contamination',
      ar: '- مرض السيلياك: خالي من الغلوتين بصرامة، تجنب القمح والشعير والجاودار والتلوث المتقاطع'
    },
    'IBS': {
      en: '- IBS: Low FODMAP foods, avoid trigger foods, gentle on digestive system',
      ar: '- متلازمة القولون العصبي: أطعمة منخفضة FODMAP، تجنب الأطعمة المحفزة، لطيفة على الجهاز الهضمي'
    },
    'Hypothyroidism': {
      en: '- Hypothyroidism: Iodine-rich foods, avoid goitrogens when raw, support metabolism',
      ar: '- قصور الغدة الدرقية: أطعمة غنية باليود، تجنب مثبطات الدرقية النيئة، دعم الأيض'
    },
    'Kidney Disease': {
      en: '- Kidney Disease: Limited protein, controlled phosphorus and potassium, reduced sodium',
      ar: '- مرض الكلى: بروتين محدود، فسفور وبوتاسيوم مضبوط، صوديوم مقلل'
    },
    'Heart Disease': {
      en: '- Heart Disease: Heart-healthy fats, omega-3s, low sodium, antioxidant-rich foods',
      ar: '- أمراض القلب: دهون صحية للقلب، أوميغا-3، صوديوم منخفض، أطعمة غنية بمضادات الأكسدة'
    }
  };
  
  const guideline = guidelines[condition];
  if (guideline) {
    return isArabic ? guideline.ar : guideline.en;
  }
  
  // Generic guideline for unlisted conditions
  return isArabic 
    ? `- ${condition}: يجب مراعاة هذه الحالة عند التخطيط للوجبات`
    : `- ${condition}: Must consider this condition when planning meals`;
};

const buildCulturalContext = (nationality: string, language: string): string => {
  const isArabic = language === 'ar';
  
  if (nationality?.includes('Saudi') || nationality?.includes('Arab') || nationality?.includes('Middle East')) {
    return isArabic 
      ? 'السياق الثقافي: ركز على الأطعمة العربية والشرق أوسطية الصحية، التمر، المكسرات، الأرز البني، اللحوم المشوية، والخضروات الطازجة.'
      : 'Cultural Context: Focus on healthy Arabic and Middle Eastern foods including dates, nuts, brown rice, grilled meats, and fresh vegetables.';
  }
  
  return isArabic 
    ? 'السياق الثقافي: مزج من الأطعمة العالمية الصحية مع التركيز على التوازن الغذائي والصحة.'
    : 'Cultural Context: Healthy international mix of foods focusing on nutritional balance and health support.';
};

const buildEnglishPrompt = (): string => {
  return `You are a professional nutritionist AI specializing in personalized meal planning with ADVANCED HEALTH CONDITION AWARENESS.
Create a comprehensive 7-day meal plan that is culturally appropriate, nutritionally balanced, and MEDICALLY SAFE for all health conditions.
PRIORITY: User's health and safety come first. Every ingredient and meal must be carefully selected to support their health conditions.`;
};

const buildArabicPrompt = (): string => {
  return `أنت خبير تغذية بالذكاء الاصطناعي متخصص في التخطيط المخصص للوجبات مع الوعي المتقدم بالحالات الصحية.
أنشئ خطة وجبات شاملة لمدة 7 أيام تكون مناسبة ثقافياً ومتوازنة غذائياً وآمنة طبياً لجميع الحالات الصحية.
الأولوية: صحة وسلامة المستخدم تأتي أولاً. يجب اختيار كل مكون ووجبة بعناية لدعم حالاتهم الصحية.`;
};

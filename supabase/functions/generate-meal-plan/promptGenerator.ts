
// Enhanced prompt templates for better JSON structure generation with multi-language support
const MEAL_PLAN_PROMPTS = {
  JSON_STRUCTURE_EXAMPLE: (includeSnacks: boolean, language: string = 'en') => {
    const isArabic = language === 'ar';
    const sampleMealName = isArabic ? "عجة إسبانية" : "Spanish Omelette";
    const sampleIngredients = isArabic ? 
      [
        { "name": "بيض", "quantity": "3", "unit": "حبات" },
        { "name": "بطاطس", "quantity": "2", "unit": "حبات متوسطة" },
        { "name": "بصل", "quantity": "1", "unit": "حبة صغيرة" }
      ] :
      [
        { "name": "eggs", "quantity": "3", "unit": "large" },
        { "name": "potatoes", "quantity": "2", "unit": "medium" },
        { "name": "onion", "quantity": "1", "unit": "small" }
      ];
    const sampleInstructions = isArabic ? 
      ["قلي البطاطس حتى تذبل", "اخفقي البيض", "اخلطي المكونات واطبخي"] : 
      ["Fry potatoes until tender", "Beat the eggs", "Mix ingredients and cook"];
    
    const snackName = isArabic ? "زبادي يوناني" : "Greek Yogurt";
    const snackIngredients = isArabic ? 
      [{ "name": "زبادي يوناني", "quantity": "1", "unit": "كوب" }, { "name": "عسل", "quantity": "1", "unit": "ملعقة كبيرة" }] :
      [{ "name": "Greek yogurt", "quantity": "1", "unit": "cup" }, { "name": "honey", "quantity": "1", "unit": "tablespoon" }];
    const snackInstructions = isArabic ? ["اخلط الزبادي مع العسل"] : ["Mix yogurt with honey"];
    
    return `
REQUIRED JSON STRUCTURE (copy this format exactly):
{
  "days": [
    {
      "dayNumber": 1,
      "dayName": "${isArabic ? 'السبت' : 'Saturday'}",
      "meals": [
        {
          "type": "breakfast",
          "name": "${sampleMealName}",
          "calories": 500,
          "protein": 25,
          "carbs": 40,
          "fat": 30,
          "ingredients": ${JSON.stringify(sampleIngredients, null, 2)},
          "instructions": ${JSON.stringify(sampleInstructions, null, 2)},
          "prepTime": 15,
          "cookTime": 30,
          "servings": 2
        }${includeSnacks ? `,
        {
          "type": "snack1",
          "name": "${snackName}",
          "calories": 150,
          "protein": 15,
          "carbs": 20,
          "fat": 5,
          "ingredients": ${JSON.stringify(snackIngredients, null, 2)},
          "instructions": ${JSON.stringify(snackInstructions, null, 2)},
          "prepTime": 2,
          "cookTime": 0,
          "servings": 1
        }` : ''}
      ]
    }
  ]
}

CRITICAL REQUIREMENTS FOR INGREDIENTS:
- ingredients MUST be an array of objects
- Each ingredient object MUST have: "name", "quantity", "unit"
- Example: {"name": "chicken breast", "quantity": "200", "unit": "grams"}
- DO NOT use simple strings for ingredients
- DO NOT use nested arrays`;
  },

  MEAL_TYPES: (includeSnacks: boolean) => 
    includeSnacks ? 'breakfast, lunch, dinner, snack1, snack2' : 'breakfast, lunch, dinner',
  
  SNACK_DISTRIBUTION: (breakfast: number, lunch: number, dinner: number, snack1: number, snack2: number, language: string = 'en') => {
    const isArabic = language === 'ar';
    return `
${isArabic ? 'توزيع الوجبات مع الوجبات الخفيفة:' : 'MEAL DISTRIBUTION WITH SNACKS:'}
- ${isArabic ? 'الإفطار' : 'Breakfast'}: ${breakfast} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'الغداء' : 'Lunch'}: ${lunch} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'العشاء' : 'Dinner'}: ${dinner} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'وجبة خفيفة (صباحية)' : 'Snack (morning)'}: ${snack1} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'وجبة خفيفة (مسائية)' : 'Snack (evening)'}: ${snack2} ${isArabic ? 'سعرة حرارية' : 'calories'}`;
  },

  NO_SNACK_DISTRIBUTION: (breakfast: number, lunch: number, dinner: number, language: string = 'en') => {
    const isArabic = language === 'ar';
    return `
${isArabic ? 'توزيع الوجبات بدون وجبات خفيفة:' : 'MEAL DISTRIBUTION WITHOUT SNACKS:'}
- ${isArabic ? 'الإفطار' : 'Breakfast'}: ${breakfast} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'الغداء' : 'Lunch'}: ${lunch} ${isArabic ? 'سعرة حرارية' : 'calories'}
- ${isArabic ? 'العشاء' : 'Dinner'}: ${dinner} ${isArabic ? 'سعرة حرارية' : 'calories'}`;
  }
};

export const generateMealPlanPrompt = (userProfile: any, preferences: any, dailyCalories: number, includeSnacks: boolean) => {
  const mealsPerDay = includeSnacks ? 5 : 3;
  const totalMeals = mealsPerDay * 7;
  const language = preferences?.language || userProfile?.preferred_language || 'en';
  const isArabic = language === 'ar';
  
  // Calculate meal distribution
  let distribution;
  if (includeSnacks) {
    const breakfast = Math.round(dailyCalories * 0.25);
    const lunch = Math.round(dailyCalories * 0.35);
    const dinner = Math.round(dailyCalories * 0.30);
    const snack1 = Math.round(dailyCalories * 0.05);
    const snack2 = Math.round(dailyCalories * 0.05);
    distribution = MEAL_PLAN_PROMPTS.SNACK_DISTRIBUTION(breakfast, lunch, dinner, snack1, snack2, language);
  } else {
    const breakfast = Math.round(dailyCalories * 0.25);
    const lunch = Math.round(dailyCalories * 0.40);
    const dinner = Math.round(dailyCalories * 0.35);
    distribution = MEAL_PLAN_PROMPTS.NO_SNACK_DISTRIBUTION(breakfast, lunch, dinner, language);
  }

  const promptLanguage = isArabic ? 
    `أنشئ خطة وجبات لمدة 7 أيام تبدأ من يوم السبت. يجب أن تتبع هذا الهيكل JSON بالضبط:

${MEAL_PLAN_PROMPTS.JSON_STRUCTURE_EXAMPLE(includeSnacks, language)}

${distribution}

المتطلبات الأساسية:
1. أنشئ بالضبط 7 أيام (رقم اليوم: 1-7، بدءاً من السبت)
2. كل يوم يجب أن يحتوي على ${mealsPerDay} وجبات بالضبط
3. أنواع الوجبات: ${MEAL_PLAN_PROMPTS.MEAL_TYPES(includeSnacks)}
4. أرجع JSON صحيح فقط يطابق الهيكل أعلاه تماماً
5. بدون تنسيق markdown، بدون تفسيرات، بدون نص إضافي
6. جميع القيم الرقمية يجب أن تكون أرقام وليس نصوص
7. اجعل أسماء الوجبات والمكونات والتعليمات باللغة العربية
8. ingredients يجب أن تكون array من objects مع name, quantity, unit
9. instructions يجب أن تكون array من strings
10. المطبخ: ${preferences?.cuisine || 'مختلط'}
11. وقت التحضير الأقصى: ${preferences?.maxPrepTime || 45} دقيقة

ملف المستخدم:
- العمر: ${userProfile?.age || 30}
- الجنس: ${userProfile?.gender || 'غير محدد'}
- الوزن: ${userProfile?.weight || 70}كجم
- الطول: ${userProfile?.height || 170}سم
- مستوى النشاط: ${userProfile?.activity_level || 'متوسط'}
- الهدف الصحي: ${userProfile?.fitness_goal || 'المحافظة'}
- الجنسية: ${userProfile?.nationality || 'دولي'}

القيود الغذائية: ${userProfile?.dietary_restrictions?.join(', ') || 'لا يوجد'}
الحساسية: ${userProfile?.allergies?.join(', ') || 'لا يوجد'}

أنشئ ${totalMeals} وجبة إجمالية تتبع هيكل JSON المحدد أعلاه بالضبط.` :

    `Generate a 7-day meal plan starting from Saturday. You MUST follow this exact JSON structure:

${MEAL_PLAN_PROMPTS.JSON_STRUCTURE_EXAMPLE(includeSnacks, language)}

${distribution}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 7 days (dayNumber: 1-7, starting Saturday)
2. Each day must have EXACTLY ${mealsPerDay} meals
3. Meal types: ${MEAL_PLAN_PROMPTS.MEAL_TYPES(includeSnacks)}
4. Return ONLY valid JSON matching the structure above exactly
5. No markdown formatting, no explanations, no additional text
6. All numeric values must be numbers, not strings
7. Make meal names, ingredients, and instructions in English
8. ingredients must be array of objects with name, quantity, unit properties
9. instructions must be array of strings
10. Cuisine: ${preferences?.cuisine || 'mixed'}
11. Max prep time: ${preferences?.maxPrepTime || 45} minutes

INGREDIENT FORMAT REQUIREMENT:
Each ingredient MUST be an object like this:
{"name": "ingredient name", "quantity": "amount", "unit": "measurement unit"}

User Profile:
- Age: ${userProfile?.age || 30}
- Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg
- Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Fitness Goal: ${userProfile?.fitness_goal || 'maintain'}
- Nationality: ${userProfile?.nationality || 'international'}

Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'none'}
Allergies: ${userProfile?.allergies?.join(', ') || 'none'}

Generate ${totalMeals} meals total following the exact JSON structure shown above.`;

  return promptLanguage;
};

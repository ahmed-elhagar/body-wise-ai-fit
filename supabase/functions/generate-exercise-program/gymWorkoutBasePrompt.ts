
export const createGymWorkoutBasePrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  return isArabic ? `
إنشاء برنامج تدريبي شامل في الصالة الرياضية لمدة أسبوع واحد للمعطيات التالية:

معلومات المتدرب:
- العمر: ${userData?.age || 25} سنة
- الجنس: ${userData?.gender || 'غير محدد'}
- الوزن: ${userData?.weight || 70} كيلو
- الطول: ${userData?.height || 170} سم
- مستوى النشاط: ${userData?.activity_level || 'متوسط النشاط'}
- الهدف الرياضي: ${preferences?.goalType || 'لياقة عامة'}
- مستوى اللياقة: ${preferences?.fitnessLevel || 'مبتدئ'}
- الوقت المتاح: ${preferences?.availableTime || 45} دقيقة لكل جلسة
- الحالات الصحية: ${userData?.health_conditions?.join(', ') || 'لا توجد'}

متطلبات البرنامج:
- إنشاء برنامج لمدة أسبوع واحد فقط (7 أيام)
- تحديد أيام التدريب وأيام الراحة بناءً على مستوى اللياقة والهدف
- للمبتدئين: 3-4 أيام تدريب، 3-4 أيام راحة
- للمتوسطين: 4-5 أيام تدريب، 2-3 أيام راحة
- للمتقدمين: 5-6 أيام تدريب، 1-2 يوم راحة
- استخدام معدات الصالة الرياضية (أوزان، آلات، كابلات، أجهزة القلب)
- 5-8 تمارين لكل يوم تدريب
- تمارين مركبة وعزل متنوعة
- تدرج في الشدة والصعوبة حسب المستوى
- تنويع المجموعات العضلية المستهدفة
- تضمين تمارين الإحماء والتبريد
- مراعاة الحالات الصحية إن وجدت

إرشادات التدريب:
- البدء بتمارين الإحماء (5-10 دقائق)
- التركيز على التقنية الصحيحة
- فترات راحة مناسبة بين المجموعات
- انتهاء كل جلسة بتمارين التمدد
- تعليمات واضحة وتفصيلية باللغة العربية
- اقتراحات للتطوير التدريجي

يجب أن يكون الرد بتنسيق JSON صحيح مع البنية التالية:
` : `
Create a comprehensive one-week gym workout program with the following user data:

User Information:
- Age: ${userData?.age || 25} years
- Gender: ${userData?.gender || 'not specified'}
- Weight: ${userData?.weight || 70} kg
- Height: ${userData?.height || 170} cm
- Activity Level: ${userData?.activity_level || 'moderately active'}
- Fitness Goal: ${preferences?.goalType || 'general fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'none'}

Program Requirements:
- Create program for exactly ONE WEEK (7 days)
- Determine training and rest days based on fitness level and goals
- Beginners: 3-4 training days, 3-4 rest days
- Intermediate: 4-5 training days, 2-3 rest days
- Advanced: 5-6 training days, 1-2 rest days
- Use gym equipment (weights, machines, cables, cardio equipment)
- 5-8 exercises per training day
- Mix of compound and isolation exercises
- Progressive intensity and difficulty based on level
- Target different muscle groups throughout the week
- Include warm-up and cool-down exercises
- Consider health conditions if any

Training Guidelines:
- Start with warm-up exercises (5-10 minutes)
- Focus on proper form and technique
- Appropriate rest periods between sets
- End each session with stretching
- Clear and detailed instructions in ${language === 'en' ? 'English' : language}
- Progressive improvement suggestions

IMPORTANT: You must decide which days are training days and which are rest days based on the user's fitness level and goals. Do not use pre-defined patterns.

Respond with valid JSON only in this exact structure:
`;
};

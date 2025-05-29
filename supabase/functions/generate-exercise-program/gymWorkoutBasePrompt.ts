
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

متطلبات البرنامج:
- إنشاء برنامج لمدة أسبوع واحد فقط (7 أيام)
- 4 أيام تدريب: الاثنين، الثلاثاء، الخميس، الجمعة (أيام 1، 2، 4، 5)
- 3 أيام راحة: الأربعاء، السبت، والأحد (لا تضع تمارين لهذه الأيام)
- استخدام معدات الصالة الرياضية (أوزان، آلات، كابلات)
- 5-7 تمارين لكل يوم تدريب
- تمارين مركبة وعزل
- تعليمات واضحة وتفصيلية باللغة العربية
- تدرج في الشدة والصعوبة

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

Program Requirements:
- Create program for exactly ONE WEEK (7 days)
- 4 training days: Monday, Tuesday, Thursday, Friday (days 1, 2, 4, 5)
- 3 rest days: Wednesday, Saturday, Sunday (days 3, 6, 7) - DO NOT create workouts for these days
- Use gym equipment (weights, machines, cables)
- 5-7 exercises per training day
- Mix of compound and isolation exercises
- Clear and detailed instructions in ${language === 'en' ? 'English' : language}
- Progressive intensity and difficulty

Respond with valid JSON only in this exact structure:
`;
};

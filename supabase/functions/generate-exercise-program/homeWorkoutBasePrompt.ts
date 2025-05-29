
export const createHomeWorkoutBasePrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  return isArabic ? `
إنشاء برنامج تدريبي منزلي شامل لمدة أسبوع واحد بوزن الجسم للمعطيات التالية:

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
- 5 أيام تدريب: الاثنين، الثلاثاء، الخميس، الجمعة، السبت
- 2 يوم راحة: الأربعاء والأحد (لا تضع تمارين لهذين اليومين)
- التمارين باستخدام وزن الجسم فقط، بدون معدات
- 4-6 تمارين لكل يوم تدريب
- تعليمات واضحة وتفصيلية باللغة العربية
- تنويع المجموعات العضلية المستهدفة

يجب أن يكون الرد بتنسيق JSON صحيح مع البنية التالية:
` : `
Create a comprehensive one-week home bodyweight workout program with the following user data:

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
- 5 training days: Monday, Tuesday, Thursday, Friday, Saturday (days 1, 2, 4, 5, 6)
- 2 rest days: Wednesday and Sunday (days 3, 7) - DO NOT create workouts for these days
- Bodyweight exercises only (no equipment needed)
- 4-6 exercises per training day
- Clear and detailed instructions in ${language === 'en' ? 'English' : language}
- Target different muscle groups across the week

Respond with valid JSON only in this exact structure:
`;
};


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
- الحالات الصحية: ${userData?.health_conditions?.join(', ') || 'لا توجد'}

متطلبات البرنامج:
- إنشاء برنامج لمدة أسبوع واحد فقط (7 أيام)
- تحديد أيام التدريب وأيام الراحة بناءً على مستوى اللياقة والهدف
- للمبتدئين: 3-4 أيام تدريب، 3-4 أيام راحة
- للمتوسطين: 4-5 أيام تدريب، 2-3 أيام راحة
- للمتقدمين: 5-6 أيام تدريب، 1-2 يوم راحة
- التمارين باستخدام وزن الجسم فقط، بدون معدات
- 4-7 تمارين لكل يوم تدريب
- تنويع في شدة التمارين وأنواعها
- تدرج في الصعوبة حسب المستوى
- تنويع المجموعات العضلية المستهدفة
- تضمين تمارين الإحماء والتبريد
- مراعاة الحالات الصحية إن وجدت

إرشادات التدريب:
- البدء بتمارين الإحماء (5-10 دقائق)
- التركيز على التقنية الصحيحة
- تمارين مناسبة للمساحة المنزلية
- فترات راحة مناسبة بين المجموعات
- انتهاء كل جلسة بتمارين التمدد
- تعليمات واضحة وتفصيلية باللغة العربية
- بدائل للتمارين الصعبة للمبتدئين

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
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'none'}

Program Requirements:
- Create program for exactly ONE WEEK (7 days)
- Determine training and rest days based on fitness level and goals
- Beginners: 3-4 training days, 3-4 rest days
- Intermediate: 4-5 training days, 2-3 rest days
- Advanced: 5-6 training days, 1-2 rest days
- Bodyweight exercises only (no equipment needed)
- 4-7 exercises per training day
- Variety in exercise intensity and types
- Progressive difficulty based on fitness level
- Target different muscle groups across the week
- Include warm-up and cool-down exercises
- Consider health conditions if any

Training Guidelines:
- Start with warm-up exercises (5-10 minutes)
- Focus on proper form and technique
- Exercises suitable for home space limitations
- Appropriate rest periods between sets
- End each session with stretching
- Clear and detailed instructions in ${language === 'en' ? 'English' : language}
- Exercise modifications for beginners

IMPORTANT: You must decide which days are training days and which are rest days based on the user's fitness level and goals. Do not use pre-defined patterns.

Respond with valid JSON only in this exact structure:
`;
};

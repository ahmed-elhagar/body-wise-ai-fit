
export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  const basePrompt = isArabic ? `
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

  return basePrompt + getHomeWorkoutJsonStructure(preferences, isArabic);
};

const getHomeWorkoutJsonStructure = (preferences: any, isArabic: boolean) => {
  return `
{
  "programOverview": {
    "name": "${isArabic ? 'برنامج التدريب المنزلي - أسبوع واحد' : 'Home Bodyweight Program - Week 1'}",
    "duration": "1 week",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${isArabic ? 'برنامج تدريبي منزلي شامل بوزن الجسم لمدة أسبوع واحد' : 'Comprehensive one-week home bodyweight training program'}"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "${isArabic ? 'تدريب الجزء العلوي - القوة الأساسية' : 'Upper Body - Foundation Strength'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 280,
        "muscleGroups": ["chest", "shoulders", "arms", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين الضغط التقليدي' : 'Standard Push-ups'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-12' : preferences?.fitnessLevel === 'intermediate' ? '12-15' : '15-20'}",
            "restSeconds": 60,
            "muscleGroups": ["chest", "shoulders", "triceps"],
            "instructions": "${isArabic ? 'ابدأ في وضعية الانبطاح مع استقامة الجسم من الرأس للكعبين. اخفض صدرك للأسفل حتى يلامس الأرض تقريباً، ثم ادفع للأعلى بقوة.' : 'Start in plank position with straight line from head to heels. Lower chest to ground, then push back up with control.'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين الضغط الصحيح للمبتدئين' : 'proper push up form tutorial'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          },
          {
            "name": "${isArabic ? 'تمرين البلانك الثابت' : 'Plank Hold'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '20-30 seconds' : preferences?.fitnessLevel === 'intermediate' ? '30-45 seconds' : '45-60 seconds'}",
            "restSeconds": 60,
            "muscleGroups": ["core", "shoulders"],
            "instructions": "${isArabic ? 'احتفظ بوضعية الانبطاح مع استقامة الجسم وشد عضلات البطن والأرداف' : 'Hold plank position with engaged core and glutes, maintain straight line'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين البلانك الصحيح' : 'proper plank hold technique'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 2
          }
        ]
      },
      {
        "day": 2,
        "workoutName": "${isArabic ? 'تدريب الجزء السفلي - قوة الساقين' : 'Lower Body - Leg Strength'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 320,
        "muscleGroups": ["legs", "glutes", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين القرفصاء الكامل' : 'Full Bodyweight Squats'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '12-15' : preferences?.fitnessLevel === 'intermediate' ? '15-20' : '20-25'}",
            "restSeconds": 60,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'قف مع المباعدة بين القدمين بعرض الكتفين. اخفض الوركين للخلف والأسفل كأنك تجلس على كرسي، ثم عد للوضع الأصلي' : 'Stand with feet shoulder-width apart. Lower hips back and down as if sitting in chair, then return to standing'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين القرفصاء الصحيح بوزن الجسم' : 'perfect bodyweight squat form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 4,
        "workoutName": "${isArabic ? 'تدريب كامل الجسم - دائرة متكاملة' : 'Full Body - Complete Circuit'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 350,
        "muscleGroups": ["full_body"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين البيربي المبسط' : 'Modified Burpees'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '5-8' : preferences?.fitnessLevel === 'intermediate' ? '8-12' : '12-15'}",
            "restSeconds": 90,
            "muscleGroups": ["full_body"],
            "instructions": "${isArabic ? 'ابدأ واقفاً، اخفض للقرفصاء، ضع اليدين على الأرض، اقفز للانبطاح، ادفع للأعلى، اقفز للقرفصاء، ثم اقفز للأعلى مع رفع اليدين' : 'Start standing, squat down, place hands on ground, jump to plank, push-up, jump to squat, jump up with arms overhead'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين البيربي الصحيح للمبتدئين' : 'beginner burpee tutorial'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 5,
        "workoutName": "${isArabic ? 'تدريب الجزء العلوي المتقدم' : 'Advanced Upper Body'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 290,
        "muscleGroups": ["chest", "back", "shoulders", "arms"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين الضغط بالميل' : 'Incline Push-ups'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '10-12' : preferences?.fitnessLevel === 'intermediate' ? '12-16' : '16-20'}",
            "restSeconds": 60,
            "muscleGroups": ["chest", "shoulders", "triceps"],
            "instructions": "${isArabic ? 'ضع اليدين على سطح مرتفع (كرسي أو سرير) وقم بتمرين الضغط بزاوية مائلة' : 'Place hands on elevated surface (chair/bed) and perform push-ups at an incline'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين الضغط بالميل' : 'incline push ups tutorial'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 6,
        "workoutName": "${isArabic ? 'تدريب الساقين والأرداف المكثف' : 'Intensive Legs & Glutes'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 330,
        "muscleGroups": ["legs", "glutes", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين الطعنات الأمامية' : 'Forward Lunges'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10 each leg' : preferences?.fitnessLevel === 'intermediate' ? '10-12 each leg' : '12-15 each leg'}",
            "restSeconds": 60,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'اخطو للأمام بقدم واحدة واخفض الركبة الخلفية حتى تلامس الأرض تقريباً، ثم عد للوضع الأصلي وكرر مع القدم الأخرى' : 'Step forward with one foot and lower back knee toward ground, return to start and repeat with other leg'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين الطعنات الأمامية الصحيح' : 'proper forward lunge form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      }
    ]
  }]
}`;
};

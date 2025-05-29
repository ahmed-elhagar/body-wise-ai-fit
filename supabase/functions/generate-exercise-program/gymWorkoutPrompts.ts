
export const createGymWorkoutPrompt = (userData: any, preferences: any) => {
  const language = preferences?.userLanguage || 'en';
  const isArabic = language === 'ar';
  
  const basePrompt = isArabic ? `
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

  return basePrompt + getGymWorkoutJsonStructure(preferences, isArabic);
};

const getGymWorkoutJsonStructure = (preferences: any, isArabic: boolean) => {
  return `
{
  "programOverview": {
    "name": "${isArabic ? 'برنامج تدريب الصالة الرياضية - أسبوع واحد' : 'Gym Strength Program - Week 1'}",
    "duration": "1 week",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${isArabic ? 'برنامج تدريبي شامل في الصالة الرياضية لمدة أسبوع واحد' : 'Comprehensive one-week gym training program'}"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "${isArabic ? 'تدريب الصدر والثلاثية الرؤوس' : 'Chest & Triceps Power'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 380,
        "muscleGroups": ["chest", "triceps", "shoulders"],
        "exercises": [
          {
            "name": "${isArabic ? 'البنش برس بالبار' : 'Barbell Bench Press'}",
            "sets": ${preferences?.fitnessLevel === 'beginner' ? '3' : preferences?.fitnessLevel === 'intermediate' ? '4' : '4'},
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : preferences?.fitnessLevel === 'intermediate' ? '10-12' : '12-15'}",
            "restSeconds": 120,
            "muscleGroups": ["chest", "triceps", "shoulders"],
            "instructions": "${isArabic ? 'استلق على مقعد البنش، امسك البار بعرض أوسع قليلاً من الكتفين، اخفض البار ببطء للصدر ثم ادفع بقوة للأعلى' : 'Lie on bench, grip bar slightly wider than shoulders, lower bar slowly to chest, press up powerfully'}",
            "youtubeSearchTerm": "${isArabic ? 'البنش برس بالبار الطريقة الصحيحة' : 'barbell bench press proper form'}",
            "equipment": "barbell",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          },
          {
            "name": "${isArabic ? 'الضغط بالدمبل على مقعد مائل' : 'Incline Dumbbell Press'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '10-12' : preferences?.fitnessLevel === 'intermediate' ? '12-14' : '14-16'}",
            "restSeconds": 90,
            "muscleGroups": ["chest", "shoulders", "triceps"],
            "instructions": "${isArabic ? 'اجلس على مقعد مائل بزاوية 30-45 درجة، ارفع الدمبل من مستوى الصدر للأعلى بحركة مقوسة' : 'Sit on incline bench at 30-45 degrees, press dumbbells from chest level up in arc motion'}",
            "youtubeSearchTerm": "${isArabic ? 'الضغط بالدمبل على مقعد مائل' : 'incline dumbbell press technique'}",
            "equipment": "dumbbells",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 2
          }
        ]
      },
      {
        "day": 2,
        "workoutName": "${isArabic ? 'تدريب الظهر والبايسيبس' : 'Back & Biceps Strength'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 360,
        "muscleGroups": ["back", "biceps"],
        "exercises": [
          {
            "name": "${isArabic ? 'السحب للأسفل بالكابل' : 'Lat Pulldown'}",
            "sets": 4,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '10-12' : preferences?.fitnessLevel === 'intermediate' ? '12-14' : '14-16'}",
            "restSeconds": 90,
            "muscleGroups": ["back", "biceps"],
            "instructions": "${isArabic ? 'اجلس مستقيماً، امسك البار بقبضة واسعة، اسحب البار للصدر مع الضغط على عضلات الظهر' : 'Sit upright, grip bar with wide grip, pull bar to chest while squeezing back muscles'}",
            "youtubeSearchTerm": "${isArabic ? 'السحب للأسفل بالكابل الطريقة الصحيحة' : 'lat pulldown proper form'}",
            "equipment": "cable_machine",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          },
          {
            "name": "${isArabic ? 'التجديف بالبار المنحني' : 'Bent-Over Barbell Row'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : preferences?.fitnessLevel === 'intermediate' ? '10-12' : '12-14'}",
            "restSeconds": 90,
            "muscleGroups": ["back", "biceps", "rear_delts"],
            "instructions": "${isArabic ? 'قف مع انحناء الجذع للأمام، امسك البار واسحبه للبطن مع الحفاظ على استقامة الظهر' : 'Stand with torso bent forward, grip bar and pull to abdomen while maintaining straight back'}",
            "youtubeSearchTerm": "${isArabic ? 'التجديف بالبار المنحني' : 'bent over barbell row form'}",
            "equipment": "barbell",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 2
          }
        ]
      },
      {
        "day": 4,
        "workoutName": "${isArabic ? 'تدريب الساقين الشامل' : 'Complete Leg Development'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 420,
        "muscleGroups": ["legs", "glutes"],
        "exercises": [
          {
            "name": "${isArabic ? 'السكوات بالبار الخلفي' : 'Back Squat'}",
            "sets": 4,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : preferences?.fitnessLevel === 'intermediate' ? '10-12' : '12-15'}",
            "restSeconds": 150,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'ضع البار على الكتفين الخلفيين، اخفض الوركين للخلف والأسفل كأنك تجلس، ثم عد للوضع الأصلي' : 'Bar on upper back, lower hips back and down as if sitting, return to standing position'}",
            "youtubeSearchTerm": "${isArabic ? 'السكوات بالبار الخلفي الطريقة الصحيحة' : 'back squat proper technique'}",
            "equipment": "barbell",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          },
          {
            "name": "${isArabic ? 'الضغط بالساقين' : 'Leg Press'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '12-15' : preferences?.fitnessLevel === 'intermediate' ? '15-18' : '18-20'}",
            "restSeconds": 120,
            "muscleGroups": ["quadriceps", "glutes"],
            "instructions": "${isArabic ? 'اجلس على آلة الضغط بالساقين، ضع القدمين على اللوحة واضغط بقوة للأعلى' : 'Sit on leg press machine, place feet on platform and press up powerfully'}",
            "youtubeSearchTerm": "${isArabic ? 'الضغط بالساقين على الآلة' : 'leg press machine technique'}",
            "equipment": "machine",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 2
          }
        ]
      },
      {
        "day": 5,
        "workoutName": "${isArabic ? 'تدريب الكتفين والبطن' : 'Shoulders & Core Focus'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 340,
        "muscleGroups": ["shoulders", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'الضغط العسكري بالدمبل' : 'Dumbbell Shoulder Press'}",
            "sets": 4,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '10-12' : preferences?.fitnessLevel === 'intermediate' ? '12-14' : '14-16'}",
            "restSeconds": 90,
            "muscleGroups": ["shoulders", "triceps"],
            "instructions": "${isArabic ? 'اجلس مستقيماً، ارفع الدمبل من مستوى الكتف للأعلى مع الحفاظ على استقامة الجذع' : 'Sit upright, press dumbbells from shoulder level overhead while maintaining straight torso'}",
            "youtubeSearchTerm": "${isArabic ? 'الضغط العسكري بالدمبل' : 'dumbbell shoulder press form'}",
            "equipment": "dumbbells",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          },
          {
            "name": "${isArabic ? 'الرفرفة الجانبية بالدمبل' : 'Lateral Dumbbell Raises'}",
            "sets": 3,
            "reps": "${preferences?.fitnessLevel === 'beginner' ? '12-15' : preferences?.fitnessLevel === 'intermediate' ? '15-18' : '18-20'}",
            "restSeconds": 60,
            "muscleGroups": ["shoulders"],
            "instructions": "${isArabic ? 'قف مستقيماً، ارفع الدمبل للجانبين حتى مستوى الكتف ثم اخفض ببطء' : 'Stand upright, raise dumbbells to sides until shoulder height, lower slowly'}",
            "youtubeSearchTerm": "${isArabic ? 'الرفرفة الجانبية بالدمبل' : 'lateral dumbbell raises technique'}",
            "equipment": "dumbbells",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 2
          }
        ]
      }
    ]
  }]
}`;
};

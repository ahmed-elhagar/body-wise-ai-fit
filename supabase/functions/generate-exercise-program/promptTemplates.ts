
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
- إنشاء برنامج لمدة أسبوع واحد فقط
- 5 أيام تدريب و 2 يوم راحة (الأربعاء والأحد)
- التمارين باستخدام وزن الجسم فقط
- تمارين آمنة وفعالة للمنزل
- تعليمات واضحة وتفصيلية
- تقدر مجموعات العضلات المستهدفة

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
- Create program for exactly ONE WEEK only
- 5 training days and 2 rest days (Wednesday and Sunday)
- Bodyweight exercises only (no equipment needed)
- Safe and effective home exercises
- Clear and detailed instructions
- Target different muscle groups

Respond with valid JSON only in this exact structure:
`;

  const jsonStructure = `
{
  "programOverview": {
    "name": "${isArabic ? 'برنامج التدريب المنزلي' : 'Home Bodyweight Training Program'}",
    "duration": "1 week",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${isArabic ? 'برنامج تدريبي منزلي شامل بوزن الجسم' : 'Comprehensive home bodyweight training program'}"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "${isArabic ? 'تدريب الجزء العلوي' : 'Upper Body Strength'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 250,
        "muscleGroups": ["chest", "shoulders", "arms", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين الضغط' : 'Push-ups'}",
            "sets": 3,
            "reps": "8-12",
            "restSeconds": 60,
            "muscleGroups": ["chest", "shoulders", "triceps"],
            "instructions": "${isArabic ? 'ابدأ في وضعية الانبطاح مع استقامة الجسم، اخفض صدرك للأسفل ثم ادفع للأعلى' : 'Start in plank position, lower chest to ground, push back up'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين الضغط الصحيح' : 'proper push up form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 2,
        "workoutName": "${isArabic ? 'تدريب الجزء السفلي' : 'Lower Body Power'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 280,
        "muscleGroups": ["legs", "glutes", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين القرفصاء' : 'Bodyweight Squats'}",
            "sets": 3,
            "reps": "12-15",
            "restSeconds": 60,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'قف مع المباعدة بين القدمين، اخفض الوركين للخلف والأسفل، ثم عد للوضع الأصلي' : 'Stand with feet shoulder-width apart, lower hips back and down, return to standing'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين القرفصاء الصحيح' : 'proper squat form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 4,
        "workoutName": "${isArabic ? 'تدريب كامل الجسم' : 'Full Body Circuit'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 300,
        "muscleGroups": ["full_body"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين البيربي' : 'Burpees'}",
            "sets": 3,
            "reps": "5-8",
            "restSeconds": 90,
            "muscleGroups": ["full_body"],
            "instructions": "${isArabic ? 'ابدأ واقفاً، اخفض للقرفصاء، اقفز للانبطاح، ادفع للأعلى، اقفز للقرفصاء، ثم اقفز للأعلى' : 'Start standing, squat down, jump to plank, push-up, jump to squat, jump up'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين البيربي الصحيح' : 'proper burpee form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 5,
        "workoutName": "${isArabic ? 'تدريب الجزء العلوي المتقدم' : 'Upper Body Focus'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 260,
        "muscleGroups": ["chest", "back", "shoulders", "arms"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين البلانك' : 'Plank Hold'}",
            "sets": 3,
            "reps": "30-60 seconds",
            "restSeconds": 60,
            "muscleGroups": ["core", "shoulders"],
            "instructions": "${isArabic ? 'احتفظ بوضعية الانبطاح مع استقامة الجسم من الرأس للكعبين' : 'Hold plank position with straight line from head to heels'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين البلانك الصحيح' : 'proper plank form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 6,
        "workoutName": "${isArabic ? 'تدريب الساقين والأرداف' : 'Legs & Glutes'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 290,
        "muscleGroups": ["legs", "glutes", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'تمرين الطعنات' : 'Lunges'}",
            "sets": 3,
            "reps": "10-12 each leg",
            "restSeconds": 60,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'اخطو للأمام واخفض الركبة الخلفية، ثم عد للوضع الأصلي' : 'Step forward and lower back knee, return to starting position'}",
            "youtubeSearchTerm": "${isArabic ? 'تمرين الطعنات الصحيح' : 'proper lunge form'}",
            "equipment": "bodyweight",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      }
    ]
  }]
}`;

  return basePrompt + jsonStructure;
};

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
- إنشاء برنامج لمدة أسبوع واحد فقط
- 4 أيام تدريب و 3 أيام راحة (الأربعاء والسبت والأحد)
- استخدام معدات الصالة الرياضية (أوزان، آلات، كابلات)
- تمارين مركبة وعزل
- تعليمات واضحة وتفصيلية
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
- Create program for exactly ONE WEEK only
- 4 training days and 3 rest days (Wednesday, Saturday, Sunday)
- Use gym equipment (weights, machines, cables)
- Mix of compound and isolation exercises
- Clear and detailed instructions
- Progressive intensity and difficulty

Respond with valid JSON only in this exact structure:
`;

  const jsonStructure = `
{
  "programOverview": {
    "name": "${isArabic ? 'برنامج تدريب الصالة الرياضية' : 'Gym Strength Training Program'}",
    "duration": "1 week",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${isArabic ? 'برنامج تدريبي شامل في الصالة الرياضية' : 'Comprehensive gym training program'}"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "${isArabic ? 'تدريب الصدر والثلاثية' : 'Chest & Triceps'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 350,
        "muscleGroups": ["chest", "triceps", "shoulders"],
        "exercises": [
          {
            "name": "${isArabic ? 'البنش برس بالبار' : 'Barbell Bench Press'}",
            "sets": 3,
            "reps": "8-10",
            "restSeconds": 90,
            "muscleGroups": ["chest", "triceps", "shoulders"],
            "instructions": "${isArabic ? 'استلق على المقعد، امسك البار بعرض الكتفين، اخفض البار للصدر ثم ادفع للأعلى' : 'Lie on bench, grip bar shoulder-width, lower to chest, press up'}",
            "youtubeSearchTerm": "${isArabic ? 'البنش برس الصحيح' : 'proper bench press form'}",
            "equipment": "barbell",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 2,
        "workoutName": "${isArabic ? 'تدريب الظهر والبايسيبس' : 'Back & Biceps'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 340,
        "muscleGroups": ["back", "biceps"],
        "exercises": [
          {
            "name": "${isArabic ? 'السحب للأسفل بالكابل' : 'Lat Pulldown'}",
            "sets": 3,
            "reps": "10-12",
            "restSeconds": 75,
            "muscleGroups": ["back", "biceps"],
            "instructions": "${isArabic ? 'اجلس مستقيماً، امسك البار بعرض أوسع من الكتفين، اسحب للصدر' : 'Sit upright, grip bar wider than shoulders, pull to chest'}",
            "youtubeSearchTerm": "${isArabic ? 'السحب للأسفل بالكابل' : 'lat pulldown form'}",
            "equipment": "cable_machine",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 4,
        "workoutName": "${isArabic ? 'تدريب الساقين' : 'Legs Day'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 400,
        "muscleGroups": ["legs", "glutes"],
        "exercises": [
          {
            "name": "${isArabic ? 'السكوات بالبار' : 'Barbell Squats'}",
            "sets": 3,
            "reps": "8-12",
            "restSeconds": 120,
            "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
            "instructions": "${isArabic ? 'ضع البار على الكتفين، اخفض الوركين للخلف والأسفل، عد للوضع الأصلي' : 'Bar on shoulders, lower hips back and down, return to standing'}",
            "youtubeSearchTerm": "${isArabic ? 'السكوات بالبار الصحيح' : 'barbell squat form'}",
            "equipment": "barbell",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      },
      {
        "day": 5,
        "workoutName": "${isArabic ? 'تدريب الكتفين والبطن' : 'Shoulders & Core'}",
        "estimatedDuration": ${preferences?.availableTime || 45},
        "estimatedCalories": 320,
        "muscleGroups": ["shoulders", "core"],
        "exercises": [
          {
            "name": "${isArabic ? 'الضغط العسكري بالدمبل' : 'Dumbbell Shoulder Press'}",
            "sets": 3,
            "reps": "10-12",
            "restSeconds": 75,
            "muscleGroups": ["shoulders", "triceps"],
            "instructions": "${isArabic ? 'اجلس مستقيماً، ارفع الدمبل من مستوى الكتف للأعلى' : 'Sit upright, press dumbbells from shoulder level overhead'}",
            "youtubeSearchTerm": "${isArabic ? 'الضغط العسكري بالدمبل' : 'dumbbell shoulder press'}",
            "equipment": "dumbbells",
            "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
            "orderNumber": 1
          }
        ]
      }
    ]
  }]
}`;

  return basePrompt + jsonStructure;
};

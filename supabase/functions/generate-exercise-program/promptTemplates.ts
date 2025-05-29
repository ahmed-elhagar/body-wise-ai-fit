
export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  const weekStartDate = preferences?.weekStartDate || new Date().toISOString().split('T')[0];
  const userLanguage = preferences?.userLanguage || userData?.preferred_language || 'en';
  const isArabic = userLanguage === 'ar';
  
  // Language-specific content
  const languageContent = {
    en: {
      programName: "Home Bodyweight Training Program",
      description: "Complete home workout program using only bodyweight exercises",
      dayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      restDays: ["Wednesday", "Sunday"],
      workoutNames: {
        1: "Upper Body Power",
        2: "Lower Body Strength", 
        4: "Full Body Circuit",
        5: "Core & Stability",
        6: "Active Recovery & Flexibility"
      },
      focus: "Foundation Building",
      equipment: ["bodyweight"],
      muscleGroups: {
        chest: "chest", shoulders: "shoulders", triceps: "triceps", core: "core",
        quadriceps: "quadriceps", glutes: "glutes", hamstrings: "hamstrings", 
        calves: "calves", back: "back", biceps: "biceps", flexibility: "flexibility"
      }
    },
    ar: {
      programName: "برنامج التدريب المنزلي بوزن الجسم",
      description: "برنامج تدريبي منزلي شامل باستخدام وزن الجسم فقط",
      dayNames: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
      restDays: ["الأربعاء", "الأحد"],
      workoutNames: {
        1: "قوة الجزء العلوي",
        2: "قوة الجزء السفلي",
        4: "دائرة الجسم الكامل", 
        5: "المركز والاستقرار",
        6: "الاستشفاء النشط والمرونة"
      },
      focus: "بناء الأساسات",
      equipment: ["وزن الجسم"],
      muscleGroups: {
        chest: "الصدر", shoulders: "الأكتاف", triceps: "العضلة ثلاثية الرؤوس", core: "المركز",
        quadriceps: "العضلة رباعية الرؤوس", glutes: "الأرداف", hamstrings: "أوتار الركبة",
        calves: "بطة الساق", back: "الظهر", biceps: "العضلة ثنائية الرؤوس", flexibility: "المرونة"
      }
    }
  };

  const lang = languageContent[userLanguage] || languageContent.en;

  return `You are a certified personal trainer creating a HOME WORKOUT program. Generate EXACTLY 5 workout days (Monday, Tuesday, Thursday, Friday, Saturday) with Wednesday and Sunday as rest days.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType || 'general_fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Week Start Date: ${weekStartDate}
- User Language: ${userLanguage}

LANGUAGE REQUIREMENTS:
- ALL workout names, exercise names, and instructions must be in ${isArabic ? 'Arabic' : 'English'}
- Keep technical terms like "sets", "reps" in their original format
- Use culturally appropriate exercise descriptions

STRICT REQUIREMENTS:
- ONLY bodyweight exercises (push-ups, squats, lunges, planks, burpees, etc.)
- NO gym equipment required
- Each workout 30-60 minutes
- 3-5 exercises per workout
- Progressive difficulty
- Clear sets, reps, and rest periods

RESPONSE FORMAT - Return ONLY valid JSON with this EXACT structure:
{
  "programOverview": {
    "name": "${lang.programName}",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${lang.description}",
    "goals": ["${preferences?.goalType || 'general_fitness'}"],
    "equipment": ${JSON.stringify(lang.equipment)},
    "workoutDays": 5,
    "restDays": ${JSON.stringify(lang.restDays)}
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "${lang.focus}",
      "workouts": [
        {
          "day": 1,
          "dayName": "${lang.dayNames[0]}",
          "workoutName": "${lang.workoutNames[1]}",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 280,
          "muscleGroups": ["${lang.muscleGroups.chest}", "${lang.muscleGroups.shoulders}", "${lang.muscleGroups.triceps}", "${lang.muscleGroups.core}"],
          "exercises": [
            {
              "name": "${isArabic ? 'تمارين الضغط' : 'Push-ups'}",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.chest}", "${lang.muscleGroups.triceps}", "${lang.muscleGroups.shoulders}"],
              "instructions": "${isArabic ? 'حافظ على استقامة الجسم من الرأس إلى الكعبين، اخفض الصدر إلى الأرض، ادفع للأعلى بقوة' : 'Keep body straight from head to heels, lower chest to floor, push up explosively'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين الضغط الصحيحة' : 'proper push up form technique'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 1
            },
            {
              "name": "${isArabic ? 'تمارين الضغط المقلوبة' : 'Pike Push-ups'}",
              "sets": 3,
              "reps": "6-10", 
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.shoulders}", "${lang.muscleGroups.triceps}"],
              "instructions": "${isArabic ? 'اتخذ وضعية V المقلوبة، اخفض الرأس نحو الأرض بين اليدين، ادفع للأعلى' : 'Form inverted V position, lower head toward floor between hands, push back up'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين الأكتاف بوزن الجسم' : 'pike push up shoulder exercise'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 2
            },
            {
              "name": "${isArabic ? 'تمارين العضلة ثلاثية الرؤوس' : 'Tricep Dips'}",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.triceps}", "${lang.muscleGroups.shoulders}"],
              "instructions": "${isArabic ? 'استخدم كرسي أو حافة، اخفض الجسم بثني المرفقين، ادفع للأعلى' : 'Use chair or edge, lower body down by bending elbows, push back up'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين العضلة ثلاثية الرؤوس منزلي' : 'chair tricep dips home exercise'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'كرسي' : 'chair'}",
              "orderNumber": 3
            },
            {
              "name": "${isArabic ? 'تمرين البلانك' : 'Plank Hold'}",
              "sets": 3,
              "reps": "30-60 seconds",
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.core}", "${lang.muscleGroups.shoulders}"],
              "instructions": "${isArabic ? 'حافظ على خط مستقيم من الرأس إلى الكعبين، شد عضلات المركز' : 'Hold straight line from head to heels, engage core muscles'}",
              "youtubeSearchTerm": "${isArabic ? 'تمرين البلانك الصحيح' : 'plank exercise proper form'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 4
            }
          ]
        },
        {
          "day": 2,
          "dayName": "${lang.dayNames[1]}",
          "workoutName": "${lang.workoutNames[2]}",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 320,
          "muscleGroups": ["${lang.muscleGroups.quadriceps}", "${lang.muscleGroups.glutes}", "${lang.muscleGroups.hamstrings}", "${lang.muscleGroups.calves}"],
          "exercises": [
            {
              "name": "${isArabic ? 'تمارين القرفصاء' : 'Bodyweight Squats'}",
              "sets": 4,
              "reps": "15-20",
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.quadriceps}", "${lang.muscleGroups.glutes}"],
              "instructions": "${isArabic ? 'القدمان بعرض الكتفين، اخفض الوركين للخلف والأسفل، حافظ على الصدر مرفوعاً' : 'Feet shoulder-width apart, lower hips back and down, keep chest up'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين القرفصاء الصحيحة' : 'bodyweight squat perfect form'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 1
            },
            {
              "name": "${isArabic ? 'تمارين الطعن' : 'Lunges'}",
              "sets": 3,
              "reps": "10-12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["${lang.muscleGroups.quadriceps}", "${lang.muscleGroups.glutes}", "${lang.muscleGroups.hamstrings}"],
              "instructions": "${isArabic ? 'اتخذ خطوة للأمام، اخفض الركبة الخلفية نحو الأرض، ادفع للعودة للبداية' : 'Step forward into lunge, lower back knee toward floor, push back to start'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين الطعن الصحيحة' : 'forward lunges proper technique'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 2
            },
            {
              "name": "${isArabic ? 'رفع بطة الساق على قدم واحدة' : 'Single-leg Calf Raises'}",
              "sets": 3,
              "reps": "12-15 each leg",
              "restSeconds": 45,
              "muscleGroups": ["${lang.muscleGroups.calves}"],
              "instructions": "${isArabic ? 'ارتفع على قدم واحدة، امسك لفترة قصيرة، اخفض ببطء' : 'Rise up on one foot, hold briefly, lower slowly'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين بطة الساق على قدم واحدة' : 'single leg calf raises'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 3
            },
            {
              "name": "${isArabic ? 'تمارين رفع الأرداف' : 'Glute Bridges'}",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 45,
              "muscleGroups": ["${lang.muscleGroups.glutes}", "${lang.muscleGroups.hamstrings}"],
              "instructions": "${isArabic ? 'استلق على الظهر، ارفع الوركين بشد الأرداف، امسك لفترة قصيرة' : 'Lie on back, lift hips up by squeezing glutes, hold briefly'}",
              "youtubeSearchTerm": "${isArabic ? 'تمارين رفع الأرداف' : 'glute bridge exercise form'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'وزن الجسم' : 'bodyweight'}",
              "orderNumber": 4
            }
          ]
        }
      ]
    }
  ]
}`;
};

export const createGymWorkoutPrompt = (userData: any, preferences: any) => {
  const weekStartDate = preferences?.weekStartDate || new Date().toISOString().split('T')[0];
  const userLanguage = preferences?.userLanguage || userData?.preferred_language || 'en';
  const isArabic = userLanguage === 'ar';
  
  // Language-specific content for gym workouts
  const languageContent = {
    en: {
      programName: "Gym Strength Training Program",
      description: "Complete gym workout program with progressive overload",
      dayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      restDays: ["Wednesday", "Saturday", "Sunday"],
      workoutNames: {
        1: "Upper Body Push",
        2: "Lower Body Power",
        4: "Upper Body Pull", 
        5: "Full Body Circuit"
      },
      focus: "Foundation Building",
      equipment: ["barbells", "dumbbells", "machines", "cables"],
      muscleGroups: {
        chest: "chest", shoulders: "shoulders", triceps: "triceps", back: "back",
        biceps: "biceps", quadriceps: "quadriceps", glutes: "glutes", 
        hamstrings: "hamstrings", calves: "calves", core: "core", cardio: "cardio"
      }
    },
    ar: {
      programName: "برنامج تدريب القوة في الصالة الرياضية",
      description: "برنامج تدريبي شامل في الصالة الرياضية مع الزيادة التدريجية",
      dayNames: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
      restDays: ["الأربعاء", "السبت", "الأحد"],
      workoutNames: {
        1: "دفع الجزء العلوي",
        2: "قوة الجزء السفلي",
        4: "سحب الجزء العلوي",
        5: "دائرة الجسم الكامل"
      },
      focus: "بناء الأساسات",
      equipment: ["البارات", "الدمبلز", "الأجهزة", "الكابلات"],
      muscleGroups: {
        chest: "الصدر", shoulders: "الأكتاف", triceps: "العضلة ثلاثية الرؤوس", back: "الظهر",
        biceps: "العضلة ثنائية الرؤوس", quadriceps: "العضلة رباعية الرؤوس", glutes: "الأرداف",
        hamstrings: "أوتار الركبة", calves: "بطة الساق", core: "المركز", cardio: "الكارديو"
      }
    }
  };

  const lang = languageContent[userLanguage] || languageContent.en;

  return `You are a certified personal trainer creating a GYM WORKOUT program. Generate EXACTLY 4 workout days (Monday, Tuesday, Thursday, Friday) with Wednesday, Saturday, and Sunday as rest days.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType || 'general_fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Week Start Date: ${weekStartDate}
- User Language: ${userLanguage}

LANGUAGE REQUIREMENTS:
- ALL workout names, exercise names, and instructions must be in ${isArabic ? 'Arabic' : 'English'}
- Keep technical terms like "sets", "reps" in their original format
- Use culturally appropriate exercise descriptions

STRICT REQUIREMENTS:
- Full gym equipment: barbells, dumbbells, machines, cables
- Progressive overload principles
- Compound and isolation movements
- 4-6 exercises per workout
- Clear weight guidance and progression

RESPONSE FORMAT - Return ONLY valid JSON with this EXACT structure:
{
  "programOverview": {
    "name": "${lang.programName}",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "${lang.description}",
    "goals": ["${preferences?.goalType || 'general_fitness'}"],
    "equipment": ${JSON.stringify(lang.equipment)},
    "workoutDays": 4,
    "restDays": ${JSON.stringify(lang.restDays)}
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "${lang.focus}",
      "workouts": [
        {
          "day": 1,
          "dayName": "${lang.dayNames[0]}",
          "workoutName": "${lang.workoutNames[1]}",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 380,
          "muscleGroups": ["${lang.muscleGroups.chest}", "${lang.muscleGroups.shoulders}", "${lang.muscleGroups.triceps}"],
          "exercises": [
            {
              "name": "${isArabic ? 'تمرين البنش برس' : 'Bench Press'}",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["${lang.muscleGroups.chest}", "${lang.muscleGroups.triceps}", "${lang.muscleGroups.shoulders}"],
              "instructions": "${isArabic ? 'اخفض البار إلى الصدر بتحكم، ادفع للأعلى بقوة، حافظ على لوحي الكتف للخلف' : 'Lower bar to chest with control, press up explosively, keep shoulder blades back'}",
              "youtubeSearchTerm": "${isArabic ? 'تمرين البنش برس الصحيح' : 'bench press proper form technique'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'بار' : 'barbell'}",
              "orderNumber": 1
            },
            {
              "name": "${isArabic ? 'تمرين الضغط العلوي' : 'Overhead Press'}",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["${lang.muscleGroups.shoulders}", "${lang.muscleGroups.triceps}", "${lang.muscleGroups.core}"],
              "instructions": "${isArabic ? 'ادفع البار مباشرة للأعلى، حافظ على شد المركز، المدى الكامل للحركة' : 'Press barbell straight overhead, keep core tight, full range of motion'}",
              "youtubeSearchTerm": "${isArabic ? 'تمرين الضغط العلوي بالبار' : 'overhead press barbell form'}",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "${isArabic ? 'بار' : 'barbell'}",
              "orderNumber": 2
            }
          ]
        }
      ]
    }
  ]
}`;
};

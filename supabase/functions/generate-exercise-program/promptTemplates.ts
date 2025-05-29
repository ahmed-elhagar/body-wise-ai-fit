
export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  const weekStartDate = preferences?.weekStartDate || new Date().toISOString().split('T')[0];
  
  return `You are a certified personal trainer creating a HOME WORKOUT program. Generate EXACTLY 5 workout days (Monday, Tuesday, Thursday, Friday, Saturday) with Wednesday and Sunday as rest days.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType || 'general_fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Week Start Date: ${weekStartDate}

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
    "name": "Home Bodyweight Training Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "Complete home workout program using only bodyweight exercises",
    "goals": ["${preferences?.goalType || 'general_fitness'}"],
    "equipment": ["bodyweight"],
    "workoutDays": 5,
    "restDays": ["Wednesday", "Sunday"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Power",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 280,
          "muscleGroups": ["chest", "shoulders", "triceps", "core"],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Keep body straight from head to heels, lower chest to floor, push up explosively",
              "youtubeSearchTerm": "proper push up form technique",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Pike Push-ups",
              "sets": 3,
              "reps": "6-10",
              "restSeconds": 60,
              "muscleGroups": ["shoulders", "triceps"],
              "instructions": "Form inverted V position, lower head toward floor between hands, push back up",
              "youtubeSearchTerm": "pike push up shoulder exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Tricep Dips",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["triceps", "shoulders"],
              "instructions": "Use chair or edge, lower body down by bending elbows, push back up",
              "youtubeSearchTerm": "chair tricep dips home exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "chair",
              "orderNumber": 3
            },
            {
              "name": "Plank Hold",
              "sets": 3,
              "reps": "30-60 seconds",
              "restSeconds": 60,
              "muscleGroups": ["core", "shoulders"],
              "instructions": "Hold straight line from head to heels, engage core muscles",
              "youtubeSearchTerm": "plank exercise proper form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 4
            }
          ]
        },
        {
          "day": 2,
          "dayName": "Tuesday",
          "workoutName": "Lower Body Strength",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 320,
          "muscleGroups": ["quadriceps", "glutes", "hamstrings", "calves"],
          "exercises": [
            {
              "name": "Bodyweight Squats",
              "sets": 4,
              "reps": "15-20",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes"],
              "instructions": "Feet shoulder-width apart, lower hips back and down, keep chest up",
              "youtubeSearchTerm": "bodyweight squat perfect form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Lunges",
              "sets": 3,
              "reps": "10-12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
              "instructions": "Step forward into lunge, lower back knee toward floor, push back to start",
              "youtubeSearchTerm": "forward lunges proper technique",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Single-leg Calf Raises",
              "sets": 3,
              "reps": "12-15 each leg",
              "restSeconds": 45,
              "muscleGroups": ["calves"],
              "instructions": "Rise up on one foot, hold briefly, lower slowly",
              "youtubeSearchTerm": "single leg calf raises",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 3
            },
            {
              "name": "Glute Bridges",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 45,
              "muscleGroups": ["glutes", "hamstrings"],
              "instructions": "Lie on back, lift hips up by squeezing glutes, hold briefly",
              "youtubeSearchTerm": "glute bridge exercise form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 4
            }
          ]
        },
        {
          "day": 4,
          "dayName": "Thursday",
          "workoutName": "Full Body Circuit",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 350,
          "muscleGroups": ["full_body", "cardio"],
          "exercises": [
            {
              "name": "Burpees",
              "sets": 3,
              "reps": "6-10",
              "restSeconds": 90,
              "muscleGroups": ["full_body", "cardio"],
              "instructions": "Squat down, jump feet back to plank, do push-up, jump feet forward, jump up",
              "youtubeSearchTerm": "burpee exercise proper form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Mountain Climbers",
              "sets": 3,
              "reps": "20-30",
              "restSeconds": 60,
              "muscleGroups": ["core", "cardio", "shoulders"],
              "instructions": "Start in plank position, alternate bringing knees to chest rapidly",
              "youtubeSearchTerm": "mountain climbers cardio exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Jump Squats",
              "sets": 3,
              "reps": "10-15",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "cardio"],
              "instructions": "Perform squat then jump up explosively, land softly",
              "youtubeSearchTerm": "jump squat plyometric exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 3
            },
            {
              "name": "High Knees",
              "sets": 3,
              "reps": "30 seconds",
              "restSeconds": 60,
              "muscleGroups": ["cardio", "core", "legs"],
              "instructions": "Run in place bringing knees up toward chest, pump arms",
              "youtubeSearchTerm": "high knees cardio exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 4
            }
          ]
        },
        {
          "day": 5,
          "dayName": "Friday",
          "workoutName": "Core & Stability",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 240,
          "muscleGroups": ["core", "stability", "flexibility"],
          "exercises": [
            {
              "name": "Dead Bug",
              "sets": 3,
              "reps": "10 each side",
              "restSeconds": 60,
              "muscleGroups": ["core", "stability"],
              "instructions": "Lie on back, extend opposite arm and leg slowly, return to start",
              "youtubeSearchTerm": "dead bug core exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Bird Dog",
              "sets": 3,
              "reps": "10 each side",
              "restSeconds": 60,
              "muscleGroups": ["core", "back", "stability"],
              "instructions": "On hands and knees, extend opposite arm and leg, hold, return",
              "youtubeSearchTerm": "bird dog stability exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Side Plank",
              "sets": 2,
              "reps": "20-30 seconds each side",
              "restSeconds": 60,
              "muscleGroups": ["core", "obliques"],
              "instructions": "Lie on side, prop up on elbow, hold straight line",
              "youtubeSearchTerm": "side plank exercise form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 3
            },
            {
              "name": "Cat-Cow Stretch",
              "sets": 2,
              "reps": "10-15",
              "restSeconds": 30,
              "muscleGroups": ["back", "flexibility"],
              "instructions": "On hands and knees, arch and round back slowly",
              "youtubeSearchTerm": "cat cow stretch yoga",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 4
            }
          ]
        },
        {
          "day": 6,
          "dayName": "Saturday",
          "workoutName": "Active Recovery & Flexibility",
          "estimatedDuration": 30,
          "estimatedCalories": 150,
          "muscleGroups": ["flexibility", "mobility"],
          "exercises": [
            {
              "name": "Gentle Yoga Flow",
              "sets": 1,
              "reps": "10 minutes",
              "restSeconds": 0,
              "muscleGroups": ["flexibility", "mobility"],
              "instructions": "Flow through basic yoga poses slowly and mindfully",
              "youtubeSearchTerm": "beginner yoga flow 10 minutes",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Walking or Light Movement",
              "sets": 1,
              "reps": "15-20 minutes",
              "restSeconds": 0,
              "muscleGroups": ["cardio", "recovery"],
              "instructions": "Take a pleasant walk or do light movement",
              "youtubeSearchTerm": "active recovery walking",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 2
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
  
  return `You are a certified personal trainer creating a GYM WORKOUT program. Generate EXACTLY 4 workout days (Monday, Tuesday, Thursday, Friday) with Wednesday, Saturday, and Sunday as rest days.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType || 'general_fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Week Start Date: ${weekStartDate}

STRICT REQUIREMENTS:
- Full gym equipment: barbells, dumbbells, machines, cables
- Progressive overload principles
- Compound and isolation movements
- 4-6 exercises per workout
- Clear weight guidance and progression

RESPONSE FORMAT - Return ONLY valid JSON with this EXACT structure:
{
  "programOverview": {
    "name": "Gym Strength Training Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
    "description": "Complete gym workout program with progressive overload",
    "goals": ["${preferences?.goalType || 'general_fitness'}"],
    "equipment": ["barbells", "dumbbells", "machines", "cables"],
    "workoutDays": 4,
    "restDays": ["Wednesday", "Saturday", "Sunday"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Push",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 380,
          "muscleGroups": ["chest", "shoulders", "triceps"],
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Lower bar to chest with control, press up explosively, keep shoulder blades back",
              "youtubeSearchTerm": "bench press proper form technique",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Overhead Press",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["shoulders", "triceps", "core"],
              "instructions": "Press barbell straight overhead, keep core tight, full range of motion",
              "youtubeSearchTerm": "overhead press barbell form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "barbell",
              "orderNumber": 2
            },
            {
              "name": "Incline Dumbbell Press",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 75,
              "muscleGroups": ["chest", "shoulders"],
              "instructions": "Press dumbbells on incline bench, full range of motion, control the weight",
              "youtubeSearchTerm": "incline dumbbell press chest",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 3
            },
            {
              "name": "Lateral Raises",
              "sets": 3,
              "reps": "12-15",
              "restSeconds": 60,
              "muscleGroups": ["shoulders"],
              "instructions": "Raise dumbbells to side until parallel to floor, lower with control",
              "youtubeSearchTerm": "lateral raises shoulder exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 4
            },
            {
              "name": "Tricep Dips",
              "sets": 3,
              "reps": "10-15",
              "restSeconds": 60,
              "muscleGroups": ["triceps"],
              "instructions": "Lower body between parallel bars, push up to start position",
              "youtubeSearchTerm": "tricep dips gym exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 5
            }
          ]
        },
        {
          "day": 2,
          "dayName": "Tuesday",
          "workoutName": "Lower Body Power",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 420,
          "muscleGroups": ["quadriceps", "glutes", "hamstrings", "calves"],
          "exercises": [
            {
              "name": "Squat",
              "sets": 4,
              "reps": "8-10",
              "restSeconds": 120,
              "muscleGroups": ["quadriceps", "glutes", "core"],
              "instructions": "Lower until thighs parallel to floor, keep chest up, drive through heels",
              "youtubeSearchTerm": "squat proper form technique",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Romanian Deadlift",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["hamstrings", "glutes", "back"],
              "instructions": "Hinge at hips, lower bar along legs, feel stretch in hamstrings",
              "youtubeSearchTerm": "romanian deadlift form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "barbell",
              "orderNumber": 2
            },
            {
              "name": "Leg Press",
              "sets": 3,
              "reps": "12-15",
              "restSeconds": 75,
              "muscleGroups": ["quadriceps", "glutes"],
              "instructions": "Push platform with full foot, don't lock knees completely",
              "youtubeSearchTerm": "leg press machine form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "machine",
              "orderNumber": 3
            },
            {
              "name": "Walking Lunges",
              "sets": 3,
              "reps": "12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "stability"],
              "instructions": "Step forward into lunge, drive off front foot to next step",
              "youtubeSearchTerm": "walking lunges with weights",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 4
            },
            {
              "name": "Calf Raises",
              "sets": 4,
              "reps": "15-20",
              "restSeconds": 45,
              "muscleGroups": ["calves"],
              "instructions": "Rise up on toes, hold briefly, lower slowly for full range",
              "youtubeSearchTerm": "standing calf raises",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "machine",
              "orderNumber": 5
            }
          ]
        },
        {
          "day": 4,
          "dayName": "Thursday",
          "workoutName": "Upper Body Pull",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 360,
          "muscleGroups": ["back", "biceps", "rear_delts"],
          "exercises": [
            {
              "name": "Deadlift",
              "sets": 3,
              "reps": "6-8",
              "restSeconds": 120,
              "muscleGroups": ["back", "hamstrings", "glutes", "core"],
              "instructions": "Keep back straight, lift by extending hips and knees simultaneously",
              "youtubeSearchTerm": "deadlift proper form technique",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Lat Pulldown",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 75,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Pull bar down to upper chest, squeeze shoulder blades together",
              "youtubeSearchTerm": "lat pulldown back exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "cable_machine",
              "orderNumber": 2
            },
            {
              "name": "Seated Cable Row",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 75,
              "muscleGroups": ["back", "biceps", "rear_delts"],
              "instructions": "Pull handles to waist, squeeze shoulder blades, control the return",
              "youtubeSearchTerm": "seated cable row form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "cable_machine",
              "orderNumber": 3
            },
            {
              "name": "Dumbbell Rows",
              "sets": 3,
              "reps": "10-12 each arm",
              "restSeconds": 60,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Pull dumbbell to hip, squeeze shoulder blade, lower with control",
              "youtubeSearchTerm": "single arm dumbbell row",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 4
            },
            {
              "name": "Bicep Curls",
              "sets": 3,
              "reps": "12-15",
              "restSeconds": 60,
              "muscleGroups": ["biceps"],
              "instructions": "Curl dumbbells to shoulders, squeeze biceps, lower slowly",
              "youtubeSearchTerm": "bicep curls proper form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 5
            }
          ]
        },
        {
          "day": 5,
          "dayName": "Friday",
          "workoutName": "Full Body Circuit",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 400,
          "muscleGroups": ["full_body", "cardio"],
          "exercises": [
            {
              "name": "Kettlebell Swings",
              "sets": 4,
              "reps": "15-20",
              "restSeconds": 60,
              "muscleGroups": ["glutes", "hamstrings", "core", "cardio"],
              "instructions": "Swing kettlebell to shoulder height using hip thrust, not arms",
              "youtubeSearchTerm": "kettlebell swings proper form",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "kettlebell",
              "orderNumber": 1
            },
            {
              "name": "Goblet Squats",
              "sets": 3,
              "reps": "12-15",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "core"],
              "instructions": "Hold dumbbell at chest, squat down keeping chest up",
              "youtubeSearchTerm": "goblet squat with dumbbell",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "dumbbells",
              "orderNumber": 2
            },
            {
              "name": "Push-up to T",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "shoulders", "core"],
              "instructions": "Do push-up, rotate to side plank, return to start",
              "youtubeSearchTerm": "push up to T exercise",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 3
            },
            {
              "name": "Mountain Climbers",
              "sets": 3,
              "reps": "30 seconds",
              "restSeconds": 60,
              "muscleGroups": ["core", "cardio", "shoulders"],
              "instructions": "Start in plank, alternate bringing knees to chest rapidly",
              "youtubeSearchTerm": "mountain climbers cardio",
              "difficulty": "${preferences?.fitnessLevel || 'beginner'}",
              "equipment": "bodyweight",
              "orderNumber": 4
            }
          ]
        }
      ]
    }
  ]
}`;
};

export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  return `You are a certified personal trainer creating a HOME WORKOUT program. Generate ONLY exercises that can be done at home with NO GYM EQUIPMENT.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

STRICT HOME WORKOUT REQUIREMENTS:
- ONLY bodyweight exercises (push-ups, squats, lunges, planks, burpees, mountain climbers, jumping jacks, etc.)
- ONLY resistance bands exercises (if mentioned)
- ONLY light dumbbells exercises (if mentioned)
- NO gym machines whatsoever
- NO barbells or heavy equipment
- NO gym-specific equipment
- Exercises must be doable in a small living space
- Focus on functional movements and compound bodyweight exercises

ABSOLUTELY FORBIDDEN EQUIPMENT/EXERCISES:
- Leg press machine or any leg press variations
- Bench press, lat pulldown, leg press, cable machines
- Smith machine, squat rack, power rack
- Barbells, heavy weights, gym machines
- Any exercise requiring a gym membership
- Pull-up bars (unless specifically mentioned as available)
- Any machine-based exercises

ALLOWED EQUIPMENT ONLY:
- Bodyweight movements: push-ups, squats, lunges, planks, burpees, mountain climbers
- Resistance bands: band pulls, band squats, band rows (optional)
- Light dumbbells 5-20lbs: dumbbell curls, shoulder press, chest press (optional)
- Yoga mat for floor exercises (optional)
- Chair for tricep dips (household item)

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "programOverview": {
    "name": "Home Bodyweight Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete home workout program using only bodyweight and minimal equipment",
    "goals": ["${preferences?.goalType}", "improve_fitness"],
    "equipment": ["bodyweight", "resistance_bands_optional", "light_dumbbells_optional"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Bodyweight",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 250,
          "muscleGroups": ["chest", "back", "shoulders", "arms"],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Keep body straight, lower chest to floor, push up explosively",
              "youtubeSearchTerm": "proper push up form bodyweight",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Pike Push-ups",
              "sets": 3,
              "reps": "6-10",
              "restSeconds": 60,
              "muscleGroups": ["shoulders", "triceps"],
              "instructions": "Form inverted V, lower head toward floor, push up",
              "youtubeSearchTerm": "pike push up bodyweight shoulder exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Tricep Dips (Chair)",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["triceps", "shoulders"],
              "instructions": "Use chair or couch, lower body down, push up",
              "youtubeSearchTerm": "chair tricep dips bodyweight",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "chair",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 2,
          "dayName": "Tuesday",
          "workoutName": "Lower Body Bodyweight",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 300,
          "muscleGroups": ["legs", "glutes", "core"],
          "exercises": [
            {
              "name": "Bodyweight Squats",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes"],
              "instructions": "Feet shoulder-width apart, lower hips back and down, stand up",
              "youtubeSearchTerm": "bodyweight squat proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Lunges",
              "sets": 3,
              "reps": "10-12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
              "instructions": "Step forward, lower back knee toward floor, push back up",
              "youtubeSearchTerm": "bodyweight lunges proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Glute Bridges",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 45,
              "muscleGroups": ["glutes", "hamstrings"],
              "instructions": "Lie on back, lift hips up, squeeze glutes at top",
              "youtubeSearchTerm": "glute bridge bodyweight exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 3,
          "dayName": "Wednesday",
          "workoutName": "Lower Body Power",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 320,
          "muscleGroups": ["legs", "glutes", "core"],
          "exercises": [
            {
              "name": "Jump Squats",
              "sets": 3,
              "reps": "10-15",
              "restSeconds": 90,
              "muscleGroups": ["quadriceps", "glutes", "calves"],
              "instructions": "Squat down then explode up jumping as high as possible",
              "youtubeSearchTerm": "jump squat bodyweight plyometric",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Single Leg Squats (Pistol Progression)",
              "sets": 3,
              "reps": "5-8 each leg",
              "restSeconds": 90,
              "muscleGroups": ["quadriceps", "glutes", "core"],
              "instructions": "Stand on one leg, squat down as far as possible, return to standing",
              "youtubeSearchTerm": "single leg squat bodyweight progression",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Bulgarian Split Squats",
              "sets": 3,
              "reps": "10-12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
              "instructions": "Rear foot elevated on chair, squat down on front leg",
              "youtubeSearchTerm": "bulgarian split squat bodyweight",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "chair",
              "orderNumber": 3
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANT: Replace ANY leg press, bench press, or machine exercise with appropriate bodyweight alternatives:
- Instead of leg press → use squats, lunges, or jump squats
- Instead of bench press → use push-ups or pike push-ups
- Instead of machine exercises → use bodyweight or resistance band alternatives

Create a complete 4-week program with ONLY bodyweight, resistance bands, and light dumbbell exercises. NO GYM EQUIPMENT ALLOWED.`;
};

export const createGymWorkoutPrompt = (userData: any, preferences: any) => {
  return `You are a certified personal trainer creating a GYM WORKOUT program. Generate exercises using full gym equipment.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

GYM WORKOUT REQUIREMENTS:
- Full access to gym equipment: barbells, dumbbells, machines, cables
- Progressive overload with proper weight training
- Compound and isolation movements
- 4-week progressive program with 4-5 workout days per week

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "programOverview": {
    "name": "Gym Training Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete gym workout program with progressive overload",
    "goals": ["${preferences?.goalType}", "strength_building"],
    "equipment": ["barbells", "dumbbells", "machines", "cables"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Strength",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 350,
          "muscleGroups": ["chest", "back", "shoulders", "arms"],
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Lower bar to chest, press up explosively",
              "youtubeSearchTerm": "bench press proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Lat Pulldown",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Pull bar down to chest, squeeze shoulder blades",
              "youtubeSearchTerm": "lat pulldown form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "cable_machine",
              "orderNumber": 2
            }
          ]
        }
      ]
    }
  ]
}

Create a complete 4-week program with proper gym exercises.`;
};

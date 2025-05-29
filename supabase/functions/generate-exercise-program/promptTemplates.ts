
export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  return `You are a certified personal trainer creating a HOME WORKOUT program. Generate ONLY exercises that can be done at home with NO GYM EQUIPMENT.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session

STRICT HOME WORKOUT REQUIREMENTS:
- ONLY bodyweight exercises (push-ups, squats, lunges, planks, burpees)
- ONLY resistance bands exercises (if mentioned)
- ONLY light dumbbells exercises (if mentioned)
- NO gym machines, barbells, or heavy equipment
- Exercises must be doable in a small living space

RESPONSE FORMAT - Return ONLY valid JSON (keep it concise):
{
  "programOverview": {
    "name": "Home Bodyweight Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete home workout program using only bodyweight",
    "goals": ["${preferences?.goalType}"],
    "equipment": ["bodyweight"]
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
              "muscleGroups": ["chest", "triceps"],
              "instructions": "Keep body straight, lower chest to floor, push up",
              "youtubeSearchTerm": "proper push up form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Pike Push-ups",
              "sets": 3,
              "reps": "6-10",
              "restSeconds": 60,
              "muscleGroups": ["shoulders"],
              "instructions": "Form inverted V, lower head toward floor, push up",
              "youtubeSearchTerm": "pike push up",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Tricep Dips",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["triceps"],
              "instructions": "Use chair, lower body down, push up",
              "youtubeSearchTerm": "chair tricep dips",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "chair",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 3,
          "dayName": "Wednesday",
          "workoutName": "Lower Body Bodyweight",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 300,
          "muscleGroups": ["legs", "glutes"],
          "exercises": [
            {
              "name": "Bodyweight Squats",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes"],
              "instructions": "Feet shoulder-width apart, lower hips back and down",
              "youtubeSearchTerm": "bodyweight squat form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Lunges",
              "sets": 3,
              "reps": "10-12 each leg",
              "restSeconds": 60,
              "muscleGroups": ["quadriceps", "glutes"],
              "instructions": "Step forward, lower back knee toward floor",
              "youtubeSearchTerm": "bodyweight lunges",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Glute Bridges",
              "sets": 3,
              "reps": "15-20",
              "restSeconds": 45,
              "muscleGroups": ["glutes"],
              "instructions": "Lie on back, lift hips up, squeeze glutes",
              "youtubeSearchTerm": "glute bridge exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 5,
          "dayName": "Friday",
          "workoutName": "Full Body Circuit",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 350,
          "muscleGroups": ["full_body"],
          "exercises": [
            {
              "name": "Burpees",
              "sets": 3,
              "reps": "5-10",
              "restSeconds": 90,
              "muscleGroups": ["full_body"],
              "instructions": "Squat, jump back to plank, push-up, jump forward, jump up",
              "youtubeSearchTerm": "burpee exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Mountain Climbers",
              "sets": 3,
              "reps": "20-30",
              "restSeconds": 60,
              "muscleGroups": ["core", "cardio"],
              "instructions": "Plank position, alternate bringing knees to chest",
              "youtubeSearchTerm": "mountain climbers exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 2
            },
            {
              "name": "Plank",
              "sets": 3,
              "reps": "30-60 seconds",
              "restSeconds": 60,
              "muscleGroups": ["core"],
              "instructions": "Hold body straight from head to heels",
              "youtubeSearchTerm": "plank exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 3
            }
          ]
        }
      ]
    }
  ]
}

Create a focused 1-week program with 3 workout days. Keep JSON response under 3000 characters.`;
};

export const createGymWorkoutPrompt = (userData: any, preferences: any) => {
  return `You are a certified personal trainer creating a GYM WORKOUT program. Generate exercises using full gym equipment.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session

GYM WORKOUT REQUIREMENTS:
- Full access to gym equipment: barbells, dumbbells, machines, cables
- Progressive overload with proper weight training
- Compound and isolation movements

RESPONSE FORMAT - Return ONLY valid JSON (keep it concise):
{
  "programOverview": {
    "name": "Gym Training Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete gym workout program with progressive overload",
    "goals": ["${preferences?.goalType}"],
    "equipment": ["barbells", "dumbbells", "machines"]
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
          "muscleGroups": ["chest", "back", "shoulders"],
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["chest", "triceps"],
              "instructions": "Lower bar to chest, press up explosively",
              "youtubeSearchTerm": "bench press form",
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
            },
            {
              "name": "Dumbbell Shoulder Press",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["shoulders"],
              "instructions": "Press dumbbells overhead, keep core tight",
              "youtubeSearchTerm": "dumbbell shoulder press",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "dumbbells",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 3,
          "dayName": "Wednesday",
          "workoutName": "Lower Body Strength",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 400,
          "muscleGroups": ["legs", "glutes"],
          "exercises": [
            {
              "name": "Squat",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["quads", "glutes"],
              "instructions": "Keep chest up, lower until thighs parallel",
              "youtubeSearchTerm": "squat proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Leg Press",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["quads", "glutes"],
              "instructions": "Push platform with feet, don't lock knees",
              "youtubeSearchTerm": "leg press form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "machine",
              "orderNumber": 2
            },
            {
              "name": "Leg Curl",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 60,
              "muscleGroups": ["hamstrings"],
              "instructions": "Curl pad towards glutes",
              "youtubeSearchTerm": "leg curl form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "machine",
              "orderNumber": 3
            }
          ]
        },
        {
          "day": 5,
          "dayName": "Friday",
          "workoutName": "Full Body",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 450,
          "muscleGroups": ["full_body"],
          "exercises": [
            {
              "name": "Deadlift",
              "sets": 3,
              "reps": "6-8",
              "restSeconds": 120,
              "muscleGroups": ["back", "legs"],
              "instructions": "Keep back straight, lift by extending hips",
              "youtubeSearchTerm": "deadlift proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Seated Row",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Pull handles to waist, squeeze shoulder blades",
              "youtubeSearchTerm": "seated row form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "cable_machine",
              "orderNumber": 2
            },
            {
              "name": "Plank",
              "sets": 3,
              "reps": "30-45 seconds",
              "restSeconds": 60,
              "muscleGroups": ["core"],
              "instructions": "Hold body straight from head to heels",
              "youtubeSearchTerm": "plank exercise",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 3
            }
          ]
        }
      ]
    }
  ]
}

Create a focused 1-week program with 3 workout days. Keep JSON response under 3000 characters.`;
};

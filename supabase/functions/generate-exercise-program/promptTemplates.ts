
export const createHomeWorkoutPrompt = (userData: any, preferences: any) => {
  return `You are a certified personal trainer creating a HOME WORKOUT program. Generate ONLY exercises that can be done at home with minimal equipment.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

HOME WORKOUT REQUIREMENTS:
- ONLY bodyweight exercises, resistance bands, light dumbbells (optional)
- NO gym machines, barbells, heavy equipment
- Exercises must be doable in a small space
- Focus on functional movements and compound exercises
- 4-week progressive program with 4-5 workout days per week

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "programOverview": {
    "name": "Home Fitness Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete home workout program using bodyweight and minimal equipment",
    "goals": ["${preferences?.goalType}", "improve_fitness"],
    "equipment": ["bodyweight", "resistance_bands", "light_dumbbells_optional"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Foundation",
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
              "youtubeSearchTerm": "proper push up form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Bodyweight Rows",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 60,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Use table or bed, pull body up keeping straight line",
              "youtubeSearchTerm": "bodyweight row home",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "table_or_bed",
              "orderNumber": 2
            }
          ]
        }
      ]
    }
  ]
}

Create a complete 4-week program with home-appropriate exercises only.`;
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

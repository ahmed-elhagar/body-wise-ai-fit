
import { ExerciseProgramError, errorCodes } from './enhancedErrorHandling.ts';

// Enhanced validation system for exercise programs
export const enhancedValidation = {
  
  // Validate user profile for exercise generation
  validateUserProfile(userProfile: any): void {
    if (!userProfile) {
      throw new ExerciseProgramError(
        'User profile is required',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }

    // Essential fields validation
    const requiredFields = ['age', 'gender'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    
    if (missingFields.length > 0) {
      throw new ExerciseProgramError(
        `Missing required profile fields: ${missingFields.join(', ')}`,
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }

    // Age validation
    if (userProfile.age && (userProfile.age < 13 || userProfile.age > 100)) {
      throw new ExerciseProgramError(
        'Age must be between 13 and 100 years',
        errorCodes.INVALID_USER_PROFILE,
        400,
        true
      );
    }

    // Health conditions validation for exercise safety
    if (userProfile.health_conditions && Array.isArray(userProfile.health_conditions)) {
      const highRiskConditions = ['heart_disease', 'severe_arthritis', 'recent_surgery'];
      const hasHighRisk = userProfile.health_conditions.some((condition: string) => 
        highRiskConditions.includes(condition)
      );
      
      if (hasHighRisk) {
        console.log('⚠️ User has high-risk health conditions, recommending gentle exercises');
      }
    }
  },

  // Validate exercise preferences
  validateExercisePreferences(preferences: any): void {
    if (!preferences) {
      throw new ExerciseProgramError(
        'Exercise preferences are required',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Workout type validation
    if (preferences.workoutType && !['home', 'gym'].includes(preferences.workoutType)) {
      throw new ExerciseProgramError(
        'Workout type must be either "home" or "gym"',
        errorCodes.WORKOUT_TYPE_INVALID,
        400,
        true
      );
    }

    // Fitness level validation
    const validFitnessLevels = ['beginner', 'intermediate', 'advanced'];
    if (preferences.fitnessLevel && !validFitnessLevels.includes(preferences.fitnessLevel)) {
      throw new ExerciseProgramError(
        'Invalid fitness level provided',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Goal type validation
    const validGoals = ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness'];
    if (preferences.goalType && !validGoals.includes(preferences.goalType)) {
      throw new ExerciseProgramError(
        'Invalid goal type provided',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Available time validation
    if (preferences.availableTime) {
      const timeMinutes = parseInt(preferences.availableTime);
      if (isNaN(timeMinutes) || timeMinutes < 15 || timeMinutes > 180) {
        throw new ExerciseProgramError(
          'Available time must be between 15 and 180 minutes',
          errorCodes.VALIDATION_ERROR,
          400,
          true
        );
      }
    }
  },

  // Validate generated workout program structure
  validateWorkoutProgram(program: any): void {
    if (!program) {
      throw new ExerciseProgramError(
        'No workout program generated',
        errorCodes.AI_GENERATION_FAILED,
        500,
        true
      );
    }

    // Program overview validation
    if (!program.programOverview || !program.programOverview.name) {
      throw new ExerciseProgramError(
        'Program overview is missing or invalid',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Weeks validation
    if (!program.weeks || !Array.isArray(program.weeks) || program.weeks.length === 0) {
      throw new ExerciseProgramError(
        'Program must contain at least one week of workouts',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Validate each week
    program.weeks.forEach((week: any, weekIndex: number) => {
      if (!week.workouts || !Array.isArray(week.workouts)) {
        throw new ExerciseProgramError(
          `Week ${weekIndex + 1} is missing workouts array`,
          errorCodes.VALIDATION_ERROR,
          400,
          true
        );
      }

      // Validate each workout
      week.workouts.forEach((workout: any, workoutIndex: number) => {
        this.validateWorkout(workout, weekIndex + 1, workoutIndex + 1);
      });
    });

    // Ensure minimum exercise count for effective program
    const totalExercises = program.weeks.reduce((total: number, week: any) => {
      return total + week.workouts.reduce((weekTotal: number, workout: any) => {
        return weekTotal + (workout.exercises?.length || 0);
      }, 0);
    }, 0);

    if (totalExercises < 10) {
      throw new ExerciseProgramError(
        'Program must contain at least 10 exercises for effectiveness',
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }
  },

  // Validate individual workout structure
  validateWorkout(workout: any, weekNumber: number, workoutNumber: number): void {
    if (!workout.day || !workout.workoutName) {
      throw new ExerciseProgramError(
        `Workout ${workoutNumber} in week ${weekNumber} is missing required fields`,
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Day number validation
    if (workout.day < 1 || workout.day > 7) {
      throw new ExerciseProgramError(
        `Invalid day number ${workout.day} in week ${weekNumber}`,
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Validate exercises if present
    if (workout.exercises && Array.isArray(workout.exercises)) {
      workout.exercises.forEach((exercise: any, exerciseIndex: number) => {
        this.validateExercise(exercise, weekNumber, workoutNumber, exerciseIndex + 1);
      });
    }

    // Validate duration if present
    if (workout.estimatedDuration && (workout.estimatedDuration < 10 || workout.estimatedDuration > 180)) {
      console.warn(`Unusual workout duration: ${workout.estimatedDuration} minutes`);
    }
  },

  // Validate individual exercise structure
  validateExercise(exercise: any, weekNumber: number, workoutNumber: number, exerciseNumber: number): void {
    if (!exercise.name || typeof exercise.name !== 'string') {
      throw new ExerciseProgramError(
        `Exercise ${exerciseNumber} in workout ${workoutNumber}, week ${weekNumber} is missing name`,
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Exercise name length validation
    if (exercise.name.length > 200) {
      throw new ExerciseProgramError(
        `Exercise name too long in workout ${workoutNumber}, week ${weekNumber}`,
        errorCodes.VALIDATION_ERROR,
        400,
        true
      );
    }

    // Sets validation
    if (exercise.sets && (exercise.sets < 1 || exercise.sets > 10)) {
      console.warn(`Unusual sets count: ${exercise.sets} for exercise ${exercise.name}`);
    }

    // Muscle groups validation
    if (exercise.muscleGroups && Array.isArray(exercise.muscleGroups)) {
      if (exercise.muscleGroups.length > 5) {
        console.warn(`Too many muscle groups for exercise ${exercise.name}`);
      }
    }

    // Instructions length validation
    if (exercise.instructions && exercise.instructions.length > 1000) {
      console.warn(`Very long instructions for exercise ${exercise.name}`);
    }
  },

  // Validate workout compatibility with user's conditions
  validateWorkoutSafety(program: any, userProfile: any): void {
    if (!userProfile.health_conditions) return;

    const healthConditions = userProfile.health_conditions;
    const restrictions: string[] = [];

    // Check for conditions that require exercise modifications
    if (healthConditions.includes('heart_disease')) {
      restrictions.push('Avoid high-intensity exercises');
    }
    
    if (healthConditions.includes('arthritis')) {
      restrictions.push('Focus on low-impact exercises');
    }
    
    if (healthConditions.includes('diabetes')) {
      restrictions.push('Monitor blood sugar during exercise');
    }

    if (restrictions.length > 0) {
      console.log('⚠️ Health-based exercise restrictions:', restrictions);
      // Could modify program or add warnings here
    }
  }
};

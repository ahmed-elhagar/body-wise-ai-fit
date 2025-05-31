
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced workout caching system
export const workoutCaching = {
  
  // Check if similar workout program already exists
  async checkExistingProgram(
    userId: string, 
    workoutType: string, 
    fitnessLevel: string,
    goalType: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', userId)
        .eq('workout_type', workoutType)
        .eq('difficulty_level', fitnessLevel)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking existing program:', error);
        return null;
      }
      
      // Check if program has sufficient exercises
      if (data && data.daily_workouts && data.daily_workouts.length > 0) {
        const totalExercises = data.daily_workouts.reduce((total: number, workout: any) => 
          total + (workout.exercises?.length || 0), 0
        );
        
        if (totalExercises >= 15) { // Minimum threshold for reuse
          console.log('✅ Found reusable program with', totalExercises, 'exercises');
          return data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in checkExistingProgram:', error);
      return null;
    }
  },

  // Check if specific exercise already exists to avoid duplicates
  async checkExistingExercise(exerciseName: string, workoutType: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          daily_workout:daily_workouts!inner(
            weekly_program:weekly_exercise_programs!inner(workout_type)
          )
        `)
        .eq('name', exerciseName)
        .eq('daily_workout.weekly_program.workout_type', workoutType)
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking existing exercise:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in checkExistingExercise:', error);
      return null;
    }
  },

  // Validate exercise data before database insertion
  validateExerciseData(exercise: any): boolean {
    try {
      // Required fields validation
      if (!exercise.name || typeof exercise.name !== 'string') {
        console.warn('Invalid exercise name:', exercise.name);
        return false;
      }
      
      // Validate sets and reps
      if (exercise.sets && (typeof exercise.sets !== 'number' || exercise.sets < 1)) {
        console.warn('Invalid sets for exercise:', exercise.name);
        return false;
      }
      
      // Validate muscle groups array
      if (exercise.muscleGroups && !Array.isArray(exercise.muscleGroups)) {
        console.warn('Invalid muscle groups for exercise:', exercise.name);
        return false;
      }
      
      // Validate equipment type
      if (exercise.equipment && typeof exercise.equipment !== 'string') {
        console.warn('Invalid equipment for exercise:', exercise.name);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating exercise data:', error);
      return false;
    }
  },

  // Sanitize exercise fields to prevent injection
  sanitizeExerciseFields(exercise: any): any {
    const sanitized = { ...exercise };
    
    // Sanitize string fields
    if (sanitized.name) {
      sanitized.name = sanitized.name.toString().trim().substring(0, 200);
    }
    
    if (sanitized.instructions) {
      sanitized.instructions = sanitized.instructions.toString().trim().substring(0, 1000);
    }
    
    if (sanitized.equipment) {
      sanitized.equipment = sanitized.equipment.toString().trim().substring(0, 100);
    }
    
    // Sanitize muscle groups array
    if (sanitized.muscleGroups && Array.isArray(sanitized.muscleGroups)) {
      sanitized.muscleGroups = sanitized.muscleGroups
        .filter((group: any) => typeof group === 'string')
        .map((group: string) => group.trim().substring(0, 50))
        .slice(0, 10); // Max 10 muscle groups
    }
    
    // Ensure numeric fields are valid
    if (sanitized.sets) {
      sanitized.sets = Math.max(1, Math.min(10, parseInt(sanitized.sets) || 3));
    }
    
    if (sanitized.restSeconds) {
      sanitized.restSeconds = Math.max(10, Math.min(600, parseInt(sanitized.restSeconds) || 60));
    }
    
    return sanitized;
  },

  // Generate cache key for workout programs
  generateCacheKey(workoutType: string, fitnessLevel: string, goalType: string): string {
    return `workout_${workoutType}_${fitnessLevel}_${goalType}`.toLowerCase();
  }
};

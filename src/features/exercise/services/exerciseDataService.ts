import { ExerciseProgram, DailyWorkout } from '@/features/exercise/types';

export class ExerciseDataService {
  static calculateProgress(exercises: any[]): {
    completedExercises: number;
    totalExercises: number;
    progressPercentage: number;
  } {
    const completed = exercises.filter(ex => ex.completed).length;
    const total = exercises.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completedExercises: completed,
      totalExercises: total,
      progressPercentage: percentage
    };
  }

  static getWorkoutsByDay(program: ExerciseProgram | null, dayNumber: number): DailyWorkout[] {
    if (!program?.daily_workouts) return [];
    return program.daily_workouts.filter(workout => workout.day_number === dayNumber);
  }

  static getExercisesByDay(program: ExerciseProgram | null, dayNumber: number): any[] {
    const workouts = this.getWorkoutsByDay(program, dayNumber);
    return workouts.flatMap(workout => workout.exercises || []);
  }

  static isRestDay(program: ExerciseProgram | null, dayNumber: number): boolean {
    const workouts = this.getWorkoutsByDay(program, dayNumber);
    return workouts.length > 0 && workouts[0]?.is_rest_day;
  }
}

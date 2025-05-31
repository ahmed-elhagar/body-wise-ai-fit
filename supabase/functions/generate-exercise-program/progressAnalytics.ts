
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced progress tracking and analytics
export const progressAnalytics = {
  
  // Calculate user's fitness progress over time
  async calculateFitnessProgress(userId: string): Promise<any> {
    try {
      // Get recent workout completion data
      const { data: recentPrograms, error: programsError } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(completed, actual_sets, actual_reps)
          )
        `)
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
        .order('created_at', { ascending: false });

      if (programsError) {
        console.error('Error fetching recent programs:', programsError);
        return null;
      }

      // Calculate completion rates and progression
      const progressData = recentPrograms.map(program => {
        const totalExercises = program.daily_workouts?.reduce((total: number, workout: any) => 
          total + (workout.exercises?.length || 0), 0) || 0;
        
        const completedExercises = program.daily_workouts?.reduce((total: number, workout: any) => 
          total + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0) || 0;
        
        const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
        
        return {
          weekStartDate: program.week_start_date,
          programName: program.program_name,
          workoutType: program.workout_type,
          difficultyLevel: program.difficulty_level,
          totalExercises,
          completedExercises,
          completionRate,
          created_at: program.created_at
        };
      });

      return {
        recentProgress: progressData,
        averageCompletionRate: progressData.length > 0 
          ? progressData.reduce((sum, p) => sum + p.completionRate, 0) / progressData.length 
          : 0,
        totalProgramsGenerated: progressData.length,
        currentStreak: this.calculateCurrentStreak(progressData)
      };
    } catch (error) {
      console.error('Error calculating fitness progress:', error);
      return null;
    }
  },

  // Calculate current workout streak
  calculateCurrentStreak(progressData: any[]): number {
    if (!progressData.length) return 0;
    
    let streak = 0;
    for (const program of progressData) {
      if (program.completionRate >= 70) { // 70% completion threshold
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },

  // Get personalized workout recommendations based on progress
  async getPersonalizedRecommendations(userId: string): Promise<any> {
    try {
      const progress = await this.calculateFitnessProgress(userId);
      if (!progress) return null;

      const recommendations = [];

      // Analyze completion patterns
      if (progress.averageCompletionRate < 50) {
        recommendations.push({
          type: 'difficulty_adjustment',
          message: 'Consider reducing workout intensity to improve completion rates',
          arabicMessage: 'فكر في تقليل شدة التمرين لتحسين معدلات الإنجاز'
        });
      } else if (progress.averageCompletionRate > 90 && progress.currentStreak > 3) {
        recommendations.push({
          type: 'difficulty_increase',
          message: 'Great progress! Ready to increase workout intensity?',
          arabicMessage: 'تقدم رائع! هل أنت مستعد لزيادة شدة التمرين؟'
        });
      }

      // Workout type recommendations
      const workoutTypes = progress.recentProgress.map((p: any) => p.workoutType);
      const mostUsedType = this.getMostFrequent(workoutTypes);
      const leastUsedType = mostUsedType === 'home' ? 'gym' : 'home';
      
      if (progress.currentStreak > 2) {
        recommendations.push({
          type: 'variety_suggestion',
          message: `Try mixing in some ${leastUsedType} workouts for variety`,
          arabicMessage: `جرب خلط بعض تمارين ${leastUsedType === 'gym' ? 'الصالة الرياضية' : 'المنزل'} للتنويع`
        });
      }

      return {
        recommendations,
        progressSummary: progress,
        nextGoalSuggestion: this.suggestNextGoal(progress)
      };
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return null;
    }
  },

  // Helper function to find most frequent item in array
  getMostFrequent(arr: string[]): string {
    const frequency: { [key: string]: number } = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '');
  },

  // Suggest next fitness goal based on progress
  suggestNextGoal(progress: any): any {
    if (progress.averageCompletionRate < 60) {
      return {
        goal: 'consistency_improvement',
        target: 'Achieve 70% completion rate',
        arabicTarget: 'تحقيق معدل إنجاز 70%'
      };
    } else if (progress.currentStreak < 3) {
      return {
        goal: 'streak_building',
        target: 'Complete 3 consecutive programs',
        arabicTarget: 'إكمال 3 برامج متتالية'
      };
    } else {
      return {
        goal: 'intensity_progression',
        target: 'Ready for intermediate level',
        arabicTarget: 'مستعد للمستوى المتوسط'
      };
    }
  },

  // Track exercise performance improvements
  async trackExercisePerformance(userId: string, exerciseId: string, sets: number, reps: string): Promise<void> {
    try {
      // Log performance data for analytics
      await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: userId,
          generation_type: 'exercise_performance',
          prompt_data: {
            exercise_id: exerciseId,
            sets_completed: sets,
            reps_completed: reps,
            timestamp: new Date().toISOString()
          },
          status: 'completed'
        });

      console.log('✅ Exercise performance tracked for user:', userId.substring(0, 8) + '...');
    } catch (error) {
      console.error('Error tracking exercise performance:', error);
    }
  }
};

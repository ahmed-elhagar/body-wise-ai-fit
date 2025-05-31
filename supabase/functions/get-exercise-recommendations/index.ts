
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId } = await req.json();

    console.log('🎯 Getting exercise recommendations for user:', userId?.substring(0, 8) + '...');

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user's recent exercise performance
    const { data: recentPrograms, error: programsError } = await supabase
      .from('weekly_exercise_programs')
      .select(`
        *,
        daily_workouts:daily_workouts(
          *,
          exercises:exercises(completed, actual_sets, actual_reps, difficulty)
        )
      `)
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()) // Last 60 days
      .order('created_at', { ascending: false })
      .limit(5);

    if (programsError) {
      console.error('Error fetching recent programs:', programsError);
      throw programsError;
    }

    // Calculate performance metrics
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

    // Calculate average completion rate
    const averageCompletionRate = progressData.length > 0 
      ? progressData.reduce((sum, p) => sum + p.completionRate, 0) / progressData.length 
      : 0;

    // Calculate current streak
    let currentStreak = 0;
    for (const program of progressData) {
      if (program.completionRate >= 70) { // 70% completion threshold
        currentStreak++;
      } else {
        break;
      }
    }

    // Generate recommendations based on performance
    const recommendations = [];

    // Completion rate recommendations
    if (averageCompletionRate < 50) {
      recommendations.push({
        type: 'difficulty_adjustment',
        priority: 'high',
        message: 'Consider reducing workout intensity to improve completion rates',
        arabicMessage: 'فكر في تقليل شدة التمرين لتحسين معدلات الإنجاز',
        action: 'reduce_difficulty'
      });
    } else if (averageCompletionRate > 90 && currentStreak > 3) {
      recommendations.push({
        type: 'difficulty_increase',
        priority: 'medium',
        message: 'Great progress! Ready to increase workout intensity?',
        arabicMessage: 'تقدم رائع! هل أنت مستعد لزيادة شدة التمرين؟',
        action: 'increase_difficulty'
      });
    }

    // Consistency recommendations
    if (currentStreak < 2 && progressData.length > 2) {
      recommendations.push({
        type: 'consistency',
        priority: 'high',
        message: 'Focus on consistency - try shorter, more manageable workouts',
        arabicMessage: 'ركز على الاستمرارية - جرب تمارين أقصر وأكثر قابلية للإدارة',
        action: 'improve_consistency'
      });
    } else if (currentStreak > 5) {
      recommendations.push({
        type: 'achievement',
        priority: 'low',
        message: 'Amazing consistency! You\'re building a strong habit.',
        arabicMessage: 'ثبات مدهش! أنت تبني عادة قوية.',
        action: 'maintain_momentum'
      });
    }

    // Workout type variety recommendations
    const workoutTypes = progressData.map(p => p.workoutType);
    const mostUsedType = getMostFrequent(workoutTypes);
    const leastUsedType = mostUsedType === 'home' ? 'gym' : 'home';
    
    if (currentStreak > 2 && workoutTypes.length > 1) {
      recommendations.push({
        type: 'variety_suggestion',
        priority: 'low',
        message: `Try mixing in some ${leastUsedType} workouts for variety`,
        arabicMessage: `جرب خلط بعض تمارين ${leastUsedType === 'gym' ? 'الصالة الرياضية' : 'المنزل'} للتنويع`,
        action: 'add_variety'
      });
    }

    // Next goal suggestion
    let nextGoal;
    if (averageCompletionRate < 60) {
      nextGoal = {
        goal: 'consistency_improvement',
        target: 'Achieve 70% completion rate',
        arabicTarget: 'تحقيق معدل إنجاز 70%',
        timeframe: '2 weeks'
      };
    } else if (currentStreak < 3) {
      nextGoal = {
        goal: 'streak_building',
        target: 'Complete 3 consecutive programs',
        arabicTarget: 'إكمال 3 برامج متتالية',
        timeframe: '3 weeks'
      };
    } else {
      nextGoal = {
        goal: 'intensity_progression',
        target: 'Ready for intermediate level',
        arabicTarget: 'مستعد للمستوى المتوسط',
        timeframe: '1 month'
      };
    }

    console.log('✅ Generated', recommendations.length, 'recommendations for user');

    return new Response(JSON.stringify({
      success: true,
      data: {
        recommendations,
        progressSummary: {
          averageCompletionRate,
          currentStreak,
          totalProgramsGenerated: progressData.length,
          recentProgress: progressData.slice(0, 3) // Last 3 programs
        },
        nextGoalSuggestion: nextGoal,
        generatedAt: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to find most frequent item in array
function getMostFrequent(arr: string[]): string {
  const frequency: { [key: string]: number } = {};
  arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
  return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '');
}

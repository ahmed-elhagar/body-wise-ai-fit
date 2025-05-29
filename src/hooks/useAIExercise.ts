
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { format, addDays, startOfWeek } from 'date-fns';

interface ExerciseProgramRequest {
  goalType?: string;
  fitnessLevel?: string;
  availableTime?: string;
  preferredWorkouts?: string[];
  targetMuscleGroups?: string[];
  equipment?: string[];
  userLanguage?: string;
  workoutType?: "home" | "gym";
  weekStartDate?: string;
  weekOffset?: number;
}

export const useAIExercise = () => {
  const { profile } = useProfile();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  const generateExerciseProgram = useMutation({
    mutationFn: async (request: ExerciseProgramRequest) => {
      if (!profile) {
        throw new Error('Profile not found. Please complete your profile first.');
      }

      const userLanguage = profile.preferred_language || language || 'en';

      console.log('🚀 Starting exercise program generation with request:', {
        workoutType: request.workoutType,
        goalType: request.goalType,
        fitnessLevel: request.fitnessLevel,
        weekOffset: request.weekOffset,
        weekStartDate: request.weekStartDate,
        userLanguage
      });

      // Calculate week start date if not provided
      let weekStartDate = request.weekStartDate;
      if (!weekStartDate && request.weekOffset !== undefined) {
        const currentWeekStart = startOfWeek(new Date());
        weekStartDate = format(addDays(currentWeekStart, request.weekOffset * 7), 'yyyy-MM-dd');
      } else if (!weekStartDate) {
        weekStartDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      }

      // Enhanced user data with better defaults and language support
      const userData = {
        userId: profile.id,
        age: profile.age || 25,
        gender: profile.gender || 'not specified',
        weight: profile.weight || 70,
        height: profile.height || 170,
        fitness_goal: profile.fitness_goal || 'general fitness',
        activity_level: profile.activity_level || 'moderately_active',
        health_conditions: profile.health_conditions || [],
        preferred_language: userLanguage
      };

      // Enhanced preferences with better equipment mapping and language
      const transformedRequest = {
        workoutType: request.workoutType || 'home',
        goalType: request.goalType || userData.fitness_goal,
        fitnessLevel: request.fitnessLevel || 'beginner',
        availableTime: request.availableTime || '45',
        preferredWorkouts: request.preferredWorkouts || (request.workoutType === 'gym' ? ['strength', 'compound'] : ['bodyweight', 'cardio']),
        targetMuscleGroups: request.targetMuscleGroups || ['full_body'],
        equipment: request.equipment || (request.workoutType === 'gym' ? ['barbells', 'dumbbells', 'machines', 'cables'] : ['bodyweight']),
        userLanguage: userLanguage,
        weekStartDate: weekStartDate,
        weekOffset: request.weekOffset
      };

      // Use centralized credit system
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'exercise_program',
        promptData: transformedRequest
      });

      try {
        console.log('📤 Sending request to edge function with enhanced data');

        const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
          body: {
            userData,
            preferences: transformedRequest,
            userLanguage: userLanguage
          }
        });

        if (error) {
          console.error('🚨 Exercise generation error:', error);
          throw new Error(error.message || 'Failed to generate exercise program');
        }

        if (!data || !data.success) {
          console.error('🚨 Invalid response from exercise generation:', data);
          
          // Handle AI generation limit specifically
          if (data?.limitReached) {
            const limitMessage = language === 'ar' ? 
              `تم الوصول لحد الاستخدام اليومي لخدمة الذكاء الاصطناعي. المتبقي: ${data.remaining || 0}` :
              `AI generation limit reached. Remaining: ${data.remaining || 0}`;
            throw new Error(limitMessage);
          }
          
          throw new Error(data?.error || 'Invalid response from exercise generation service');
        }

        console.log('✅ Exercise generation response:', data);

        // Complete the AI generation log with success
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          responseData: {
            workoutType: data.workoutType,
            workoutsCreated: data.workoutsCreated,
            exercisesCreated: data.exercisesCreated
          }
        });

        return data;
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Generation failed'
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate all exercise-related queries for fresh data
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      
      const successMessage = language === 'ar' ? 
        `تم إنشاء برنامج التمارين ${data.workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزلية'} بنجاح!` :
        `${data.workoutType === 'gym' ? 'Gym' : 'Home'} exercise program generated successfully!`;
      
      const description = language === 'ar' ? 
        `تم إنشاء ${data.workoutsCreated || 0} تمارين مع ${data.exercisesCreated || 0} حركة. المتبقي: ${data.generationsRemaining || 0}` :
        `Created ${data.workoutsCreated || 0} workouts with ${data.exercisesCreated || 0} exercises. Remaining: ${data.generationsRemaining || 0}`;
      
      toast.success(successMessage, { description });
      console.log('✅ Exercise program generation completed successfully');
    },
    onError: (error) => {
      console.error('🚨 Exercise generation error:', error);
      
      let errorMessage = language === 'ar' ? 
        'فشل في إنشاء برنامج التمارين. يرجى المحاولة مرة أخرى.' :
        'Failed to generate exercise program. Please try again.';
      
      // Enhanced error handling with specific messages
      if (error.message.includes('Profile not found')) {
        errorMessage = language === 'ar' ? 
          'يرجى إكمال ملفك الشخصي قبل إنشاء برنامج التمارين.' :
          'Please complete your profile before generating an exercise program.';
      } else if (error.message.includes('limit reached') || error.message.includes('limit')) {
        errorMessage = language === 'ar' ? 
          'تم الوصول للحد الأقصى لاستخدام خدمة الذكاء الاصطناعي اليوم.' :
          'AI generation limit reached for today.';
      } else if (error.message.includes('API key')) {
        errorMessage = language === 'ar' ? 
          'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.' :
          'AI service is temporarily unavailable. Please try again later.';
      } else if (error.message.includes('Authentication required')) {
        errorMessage = language === 'ar' ? 
          'يرجى تسجيل الدخول لإنشاء برامج التمارين.' :
          'Please sign in to generate exercise programs.';
      }
      
      toast.error(errorMessage);
    }
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
    error: generateExerciseProgram.error
  };
};

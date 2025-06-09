
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { 
  EnhancedDayNavigation,
  ExercisePageContent, 
  ExercisePageLayout,
  ExerciseErrorState,
  EnhancedExerciseHeaderWithAnalytics,
  ExerciseAnalyticsContainer,
  AIExerciseDialog
} from "@/features/exercise";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import { useState, useMemo } from "react";

const EnhancedExercisePage = () => {
  const { t, language } = useLanguage();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const {
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    currentProgram,
    isLoading,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    error,
    currentDate,
    weekStartDate,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  } = useOptimizedExerciseProgramPage();

  const { isGenerating, generateExerciseProgram, regenerateProgram } = useEnhancedAIExercise();

  // AI Loading Steps for Exercise Generation
  const exerciseSteps = useMemo(() => [
    {
      id: 'analyzing-profile',
      label: language === 'ar' ? 'تحليل ملفك الرياضي' : 'Analyzing your fitness profile',
      description: language === 'ar' ? 'قراءة أهدافك ومستوى لياقتك' : 'Reading your goals and fitness level',
      estimatedDuration: 3
    },
    {
      id: 'calculating-intensity',
      label: language === 'ar' ? 'حساب شدة التمارين' : 'Calculating exercise intensity',
      description: language === 'ar' ? 'تحديد الشدة المناسبة لك' : 'Determining appropriate intensity for you',
      estimatedDuration: 4
    },
    {
      id: 'selecting-exercises',
      label: language === 'ar' ? 'اختيار التمارين المناسبة' : 'Selecting suitable exercises',
      description: language === 'ar' ? 'اختيار التمارين المناسبة لأهدافك' : 'Choosing exercises that match your goals',
      estimatedDuration: 6
    },
    {
      id: 'creating-schedule',
      label: language === 'ar' ? 'إنشاء جدول التمارين' : 'Creating exercise schedule',
      description: language === 'ar' ? 'تنظيم التمارين في برنامج أسبوعي' : 'Organizing exercises into a weekly program',
      estimatedDuration: 4
    },
    {
      id: 'optimizing-progression',
      label: language === 'ar' ? 'تحسين التقدم' : 'Optimizing progression',
      description: language === 'ar' ? 'ضمان التحسن التدريجي' : 'Ensuring gradual improvement',
      estimatedDuration: 3
    },
    {
      id: 'finalizing-program',
      label: language === 'ar' ? 'إنهاء البرنامج' : 'Finalizing program',
      description: language === 'ar' ? 'حفظ برنامجك الرياضي' : 'Saving your exercise program',
      estimatedDuration: 2
    }
  ], [language]);

  const { currentStepIndex, isComplete, progress } = useAILoadingSteps(
    exerciseSteps, 
    isGenerating,
    { stepDuration: 3500 }
  );

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  if (showAnalytics) {
    return (
      <ExerciseAnalyticsContainer
        exercises={todaysExercises}
        onClose={() => setShowAnalytics(false)}
      />
    );
  }

  // Only show full page loading for initial data load (no program exists)
  const showFullPageLoading = isLoading && !currentProgram && currentWeekOffset === 0;

  if (showFullPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleLoadingIndicator
          message="Loading Your Exercise Program"
          description="Preparing your personalized workout plan with progress tracking and exercise details"
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return <ExerciseErrorState onRetry={() => refetch()} />;
  }

  const handleGenerateAIProgram = async (preferences: any) => {
    try {
      // Close dialog immediately when generation starts
      setShowAIDialog(false);
      
      const enhancedPreferences = {
        ...preferences,
        workoutType,
        weekStartDate: format(weekStartDate, 'yyyy-MM-dd'),
        weekOffset: currentWeekOffset
      };
      
      console.log('🎯 Starting AI program generation:', enhancedPreferences);
      await generateExerciseProgram(enhancedPreferences);
      refetch();
    } catch (error) {
      console.error('❌ Error generating exercise program:', error);
    }
  };

  const handleRegenerateProgram = async () => {
    try {
      const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
      console.log('🔄 Starting program regeneration for week:', weekStartDateString);
      await regenerateProgram(weekStartDateString);
      refetch();
    } catch (error) {
      console.error('❌ Error regenerating exercise program:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-4">
            <EnhancedExerciseHeaderWithAnalytics
              currentProgram={currentProgram}
              onShowAnalytics={() => setShowAnalytics(true)}
              onShowAIDialog={() => setShowAIDialog(true)}
              onRegenerateProgram={handleRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
            />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-4">
          <EnhancedDayNavigation
            weekStartDate={weekStartDate}
            selectedDayNumber={selectedDayNumber}
            onDayChange={setSelectedDayNumber}
            currentProgram={currentProgram}
            workoutType={workoutType}
            currentWeekOffset={currentWeekOffset}
            onWeekChange={setCurrentWeekOffset}
            onWorkoutTypeChange={setWorkoutType}
          />
        </div>

        {/* Content Section - Fixed Height Container */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 relative min-h-[600px]">
            {/* Navigation/Day loading overlay - shows when loading data */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <SimpleLoadingIndicator
                  message="Loading Exercise Data"
                  description="Fetching your workout information..."
                />
              </div>
            )}
            
            <ExercisePageContent
              isLoading={false} // Content component handles its own empty states
              currentProgram={currentProgram}
              todaysExercises={todaysExercises}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isRestDay={isRestDay}
              isToday={isToday}
              selectedDayNumber={selectedDayNumber}
              workoutType={workoutType}
              setWorkoutType={setWorkoutType}
              showAIDialog={showAIDialog}
              setShowAIDialog={setShowAIDialog}
              aiPreferences={aiPreferences}
              setAiPreferences={setAiPreferences}
              isGenerating={isGenerating}
              onExerciseComplete={handleExerciseComplete}
              onExerciseProgressUpdate={handleExerciseProgressUpdate}
              onGenerateAIProgram={handleGenerateAIProgram}
            />
          </div>
        </div>

        {/* AI Exercise Dialog */}
        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          preferences={{ ...aiPreferences, workoutType }}
          setPreferences={setAiPreferences}
          onGenerate={handleGenerateAIProgram}
          isGenerating={isGenerating}
        />

        {/* Small Top-Right AI Loading Dialog - Like Meal Plan */}
        <UnifiedAILoadingDialog
          isOpen={isGenerating}
          title={language === 'ar' ? 'إنشاء برنامج رياضي' : 'Generating Exercise Program'}
          description={language === 'ar' ? 'إنشاء برنامج رياضي مخصص' : 'Creating personalized exercise program'}
          steps={exerciseSteps}
          currentStepIndex={currentStepIndex}
          isComplete={isComplete}
          progress={progress}
          estimatedTotalTime={22}
          allowClose={false}
          position="top-right"
        />
      </div>
    </div>
  );
};

export default EnhancedExercisePage;

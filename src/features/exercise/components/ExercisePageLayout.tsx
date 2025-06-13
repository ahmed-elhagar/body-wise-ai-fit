
import { 
  EnhancedDayNavigation,
  ExercisePageContent, 
  ExerciseErrorState,
  EnhancedExerciseHeaderWithAnalytics,
  AIExerciseDialog
} from "@/features/exercise";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExercisePageLayoutProps {
  // Data props
  currentProgram: any;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  isToday: boolean;
  isLoading: boolean;
  error: any;
  
  // Navigation props
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  
  // AI props
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
  exerciseSteps: any[];
  currentStepIndex: number;
  isComplete: boolean;
  progress: number;
  
  // Actions
  onShowAnalytics: () => void;
  onGenerateAIProgram: (preferences: any) => Promise<void>;
  onRegenerateProgram: () => Promise<void>;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  refetch: () => void;
}

export const ExercisePageLayout = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  isToday,
  isLoading,
  error,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating,
  exerciseSteps,
  currentStepIndex,
  isComplete,
  progress,
  onShowAnalytics,
  onGenerateAIProgram,
  onRegenerateProgram,
  onExerciseComplete,
  onExerciseProgressUpdate,
  refetch
}: ExercisePageLayoutProps) => {
  const { language } = useLanguage();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-4">
            <EnhancedExerciseHeaderWithAnalytics
              currentProgram={currentProgram}
              onShowAnalytics={onShowAnalytics}
              onShowAIDialog={() => setShowAIDialog(true)}
              onRegenerateProgram={onRegenerateProgram}
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
              onExerciseComplete={onExerciseComplete}
              onExerciseProgressUpdate={onExerciseProgressUpdate}
              onGenerateAIProgram={onGenerateAIProgram}
            />
          </div>
        </div>

        {/* AI Exercise Dialog */}
        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          preferences={{ ...aiPreferences, workoutType }}
          setPreferences={setAiPreferences}
          onGenerate={onGenerateAIProgram}
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

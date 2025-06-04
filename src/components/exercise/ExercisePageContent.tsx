
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExerciseListEnhanced } from './ExerciseListEnhanced';
import { EmptyExerciseState } from './EmptyExerciseState';
import { Card } from '@/components/ui/card';

interface ExercisePageContentProps {
  isLoading: boolean;
  currentProgram: any;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  isToday: boolean;
  selectedDayNumber: number;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => void;
}

export const ExercisePageContent = ({
  isLoading,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  isToday,
  selectedDayNumber,
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExercisePageContentProps) => {
  const { t } = useLanguage();

  // Show empty state if no program exists
  if (!currentProgram) {
    return (
      <div className="px-3">
        <EmptyExerciseState
          onGenerateProgram={() => setShowAIDialog(true)}
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          showAIDialog={showAIDialog}
          setShowAIDialog={setShowAIDialog}
          aiPreferences={aiPreferences}
          setAiPreferences={setAiPreferences}
          isGenerating={isGenerating}
        />
      </div>
    );
  }

  // Show content with loading overlay when changing weeks
  if (isLoading) {
    return (
      <div className="px-3 relative">
        {/* Overlay for loading state - only covers content area */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 rounded-lg flex items-center justify-center">
          <Card className="p-6 shadow-lg border-0 bg-white">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">{t('Loading Week Data')}</h3>
              <p className="text-sm text-gray-600">{t('Fetching your workout details...')}</p>
            </div>
          </Card>
        </div>
        
        {/* Show dimmed content underneath */}
        <div className="opacity-30 pointer-events-none">
          <ExerciseListEnhanced
            exercises={todaysExercises}
            isLoading={false}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            isRestDay={isRestDay}
            currentProgram={currentProgram}
            selectedDayNumber={selectedDayNumber}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3">
      <ExerciseListEnhanced
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        isRestDay={isRestDay}
        currentProgram={currentProgram}
        selectedDayNumber={selectedDayNumber}
      />
    </div>
  );
};

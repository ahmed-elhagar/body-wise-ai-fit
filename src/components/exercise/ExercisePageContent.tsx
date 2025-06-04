
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExerciseListEnhanced } from './ExerciseListEnhanced';
import { EmptyExerciseState } from './EmptyExerciseState';
import { AIExerciseDialog } from './AIExerciseDialog';

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

  // Show loading overlay when changing weeks with existing program
  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">{t('Loading workout details...')}</p>
          </div>
        </div>
        <div className="opacity-50 pointer-events-none">
          <div className="px-3">
            <ExerciseListEnhanced
              exercises={[]}
              isLoading={false}
              onExerciseComplete={onExerciseComplete}
              onExerciseProgressUpdate={onExerciseProgressUpdate}
              isRestDay={false}
            />
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="px-3">
      <ExerciseListEnhanced
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        isRestDay={isRestDay}
      />
    </div>
  );
};

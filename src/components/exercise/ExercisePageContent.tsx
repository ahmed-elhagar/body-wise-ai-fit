
import { Loader2 } from "lucide-react";
import { EnhancedExerciseListContainer } from "./EnhancedExerciseListContainer";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { CompactProgressSidebar } from "./CompactProgressSidebar";

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
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
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
  return (
    <div className="px-3 pb-4 relative">
      {/* Loading overlay for content area only */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-3xl flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading week data...</p>
          </div>
        </div>
      )}

      {!currentProgram ? (
        /* Empty State within the layout */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
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

          {/* Empty sidebar placeholder */}
          <div className="hidden xl:block xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">Progress Tracking</h4>
                <p className="text-sm text-gray-500">
                  Your workout progress and achievements will appear here once you start your program.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Program Content */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Exercise Content - Takes up 3/4 on desktop, full width on mobile */}
          <div className="xl:col-span-3">
            <EnhancedExerciseListContainer
              exercises={todaysExercises}
              onExerciseComplete={onExerciseComplete}
              onExerciseProgressUpdate={onExerciseProgressUpdate}
              isRestDay={isRestDay}
              isLoading={false}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isToday={isToday}
              currentProgram={currentProgram}
              selectedDayNumber={selectedDayNumber}
            />
          </div>

          {/* Compact Progress Sidebar - Shows on desktop only */}
          <div className="hidden xl:block xl:col-span-1">
            <CompactProgressSidebar
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isToday={isToday}
              isRestDay={isRestDay}
              currentProgram={currentProgram}
              selectedDayNumber={selectedDayNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
};

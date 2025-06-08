
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { WorkoutContentLayout } from "@/components/exercise/WorkoutContentLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  Clock, 
  TrendingUp,
  Play,
  Zap,
  Award
} from "lucide-react";

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
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onGenerateAIProgram: (preferences: any) => Promise<void>;
}

export const ExercisePageContent = ({
  isLoading,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate,
}: ExercisePageContentProps) => {
  if (!currentProgram) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 border-0 shadow-xl">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-fitness-primary-800 mb-3">
              No Exercise Program Found
            </h3>
            <p className="text-fitness-primary-600 text-lg leading-relaxed mb-6">
              Create your first exercise program to get started with your fitness journey.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-secondary-500 hover:from-fitness-primary-600 hover:to-fitness-secondary-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Create Program
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Overview */}
      {!isRestDay && todaysExercises.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-fitness-primary-500/10 to-fitness-secondary-500/10 border-b border-fitness-neutral-200/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Progress Stats */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-fitness-primary-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-fitness-secondary-500" />
                Today's Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-fitness-primary-700">Exercises Completed</span>
                  <Badge variant="secondary" className="bg-fitness-primary-100 text-fitness-primary-700">
                    {completedExercises}/{totalExercises}
                  </Badge>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-fitness-neutral-200"
                />
                <div className="text-xs text-fitness-primary-600">
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:col-span-2">
              <div className="bg-white/80 rounded-xl p-4 border border-fitness-neutral-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fitness-accent-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-fitness-accent-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-fitness-primary-700">Estimated Time</div>
                    <div className="text-lg font-bold text-fitness-primary-800">
                      {Math.ceil(todaysExercises.length * 3)} min
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-xl p-4 border border-fitness-neutral-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fitness-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-fitness-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-fitness-primary-700">Calories</div>
                    <div className="text-lg font-bold text-fitness-primary-800">
                      ~{todaysExercises.length * 15}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Exercise List */}
      <div className="p-6">
        <WorkoutContentLayout
          todaysExercises={todaysExercises}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          currentProgram={currentProgram}
          selectedDayNumber={selectedDayNumber}
          currentWeekOffset={0}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />
      </div>
    </div>
  );
};

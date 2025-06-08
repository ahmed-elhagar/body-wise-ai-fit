
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw, Calendar, Dumbbell, Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addDays } from "date-fns";

interface ExerciseHeaderProps {
  currentProgram: any;
  weekStartDate: Date;
  currentWeekOffset: number;
  workoutType: "home" | "gym";
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  isGenerating: boolean;
}

const ExerciseHeader = ({
  currentProgram,
  weekStartDate,
  currentWeekOffset,
  workoutType,
  onWeekChange,
  onShowAIDialog,
  onRegenerateProgram,
  onWorkoutTypeChange,
  isGenerating
}: ExerciseHeaderProps) => {
  const { t } = useLanguage();

  const weekEndDate = addDays(weekStartDate, 6);
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div className="p-6 bg-gradient-to-r from-fitness-primary-50 to-fitness-secondary-50 border-b border-fitness-primary-100">
      <div className="space-y-6">
        {/* Enhanced Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-fitness-primary-800">
                  {currentProgram?.name || t('exercise.exerciseProgram')}
                </h1>
                <p className="text-fitness-primary-600 font-medium">
                  {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
                  {isCurrentWeek && (
                    <Badge variant="outline" className="ml-2 bg-fitness-primary-100 border-fitness-primary-300 text-fitness-primary-700">
                      {t('exercise.currentWeek')}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={onShowAIDialog}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={isGenerating}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('exercise.generateAI')}
            </Button>

            <Button
              onClick={onRegenerateProgram}
              variant="outline"
              size="lg"
              className="border-2 border-fitness-secondary-300 text-fitness-secondary-700 hover:bg-fitness-secondary-50 hover:border-fitness-secondary-400 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={isGenerating}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('exercise.regenerate')}
            </Button>
          </div>
        </div>

        {/* Enhanced Workout Type Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="bg-white rounded-xl p-1 shadow-md border border-fitness-primary-200">
            <div className="flex">
              <button
                onClick={() => onWorkoutTypeChange("home")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  workoutType === "home"
                    ? "bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 text-white shadow-lg transform scale-105"
                    : "text-fitness-orange-600 hover:bg-fitness-orange-50"
                }`}
              >
                <Home className="w-4 h-4" />
                {t('exercise.homeWorkout')}
              </button>
              <button
                onClick={() => onWorkoutTypeChange("gym")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  workoutType === "gym"
                    ? "bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white shadow-lg transform scale-105"
                    : "text-fitness-accent-600 hover:bg-fitness-accent-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                {t('exercise.gymWorkout')}
              </button>
            </div>
          </div>

          {/* Enhanced Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              variant="outline"
              size="lg"
              className="border-2 border-fitness-primary-200 hover:bg-fitness-primary-50 hover:border-fitness-primary-300 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="bg-white rounded-xl px-4 py-2.5 border-2 border-fitness-primary-200 min-w-[120px] text-center">
              <span className="font-semibold text-fitness-primary-800">
                {isCurrentWeek ? t('exercise.thisWeek') : `Week ${currentWeekOffset + 1}`}
              </span>
            </div>
            
            <Button
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              variant="outline"
              size="lg"
              className="border-2 border-fitness-primary-200 hover:bg-fitness-primary-50 hover:border-fitness-primary-300 transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Program Info */}
        {currentProgram && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-fitness-primary-200">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-fitness-primary-600" />
                <span className="font-medium text-fitness-primary-800">
                  {currentProgram.duration_weeks || 4} {t('exercise.weeks')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-fitness-secondary-500 rounded-full"></span>
                <span className="font-medium text-fitness-primary-800 capitalize">
                  {currentProgram.goal_type?.replace('_', ' ') || 'General Fitness'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-fitness-accent-500 rounded-full"></span>
                <span className="font-medium text-fitness-primary-800 capitalize">
                  {currentProgram.fitness_level || 'Beginner'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseHeader;

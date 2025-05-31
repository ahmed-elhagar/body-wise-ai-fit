
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Sparkles, ChevronLeft, ChevronRight, Home, Building } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

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

  return (
    <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Program Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentProgram?.program_name || 'Exercise Program'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-indigo-100 font-medium">
                  {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Week {(currentProgram?.current_week || 1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Workout Type Toggle */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <Button
                variant={workoutType === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onWorkoutTypeChange('home')}
                className={`h-9 px-4 ${
                  workoutType === 'home' 
                    ? 'bg-white text-indigo-600 shadow-lg' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant={workoutType === 'gym' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onWorkoutTypeChange('gym')}
                className={`h-9 px-4 ${
                  workoutType === 'gym' 
                    ? 'bg-white text-indigo-600 shadow-lg' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Building className="w-4 h-4 mr-2" />
                Gym
              </Button>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="p-2 hover:bg-white/10 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(0)}
                className={`px-4 font-medium text-white ${
                  currentWeekOffset === 0 ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Current Week
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="p-2 hover:bg-white/10 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              onClick={currentProgram ? onRegenerateProgram : onShowAIDialog}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {currentProgram ? 'Regenerate' : 'Generate Program'}
            </Button>
          </div>
        </div>

        {/* Program Stats */}
        {currentProgram && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {currentProgram.duration_weeks || 4}
              </div>
              <div className="text-sm text-indigo-100 font-medium">Program Weeks</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {currentProgram.daily_workouts?.length || 0}
              </div>
              <div className="text-sm text-indigo-100 font-medium">Weekly Workouts</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {currentProgram.difficulty_level || 'Beginner'}
              </div>
              <div className="text-sm text-indigo-100 font-medium">Difficulty</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {workoutType === 'home' ? 'Home' : 'Gym'}
              </div>
              <div className="text-sm text-indigo-100 font-medium">Workout Type</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseHeader;

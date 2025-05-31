
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
    <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg rounded-lg overflow-hidden" style={{ height: '180px' }}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Program Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">
                {currentProgram?.program_name || 'Exercise Program'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-indigo-100 text-sm font-normal">
                  {format(weekStartDate, 'MMMM d')} - {format(addDays(weekStartDate, 6), 'MMMM d, yyyy')}
                </p>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  Week {(currentProgram?.current_week || 1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Workout Type Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <Button
                variant={workoutType === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onWorkoutTypeChange('home')}
                className={`h-8 px-3 text-sm ${
                  workoutType === 'home' 
                    ? 'bg-white text-indigo-600' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
              <Button
                variant={workoutType === 'gym' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onWorkoutTypeChange('gym')}
                className={`h-8 px-3 text-sm ${
                  workoutType === 'gym' 
                    ? 'bg-white text-indigo-600' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Building className="w-4 h-4 mr-1" />
                Gym
              </Button>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset - 1)}
                className="p-2 hover:bg-white/10 text-white h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant={currentWeekOffset === 0 ? "default" : "ghost"}
                size="sm"
                onClick={() => onWeekChange(0)}
                className={`px-3 text-sm font-normal ${
                  currentWeekOffset === 0 
                    ? 'bg-white text-indigo-600' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                Current Week
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWeekChange(currentWeekOffset + 1)}
                className="p-2 hover:bg-white/10 text-white h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              onClick={currentProgram ? onRegenerateProgram : onShowAIDialog}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm"
              disabled={isGenerating}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {currentProgram ? 'Regenerate' : 'Generate Program'}
            </Button>
          </div>
        </div>

        {/* Program Stats */}
        {currentProgram && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-lg font-medium text-white">
                {currentProgram.duration_weeks || 4}
              </div>
              <div className="text-xs text-indigo-100">Program Weeks</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-medium text-white">
                {currentProgram.daily_workouts?.length || 0}
              </div>
              <div className="text-xs text-indigo-100">Weekly Workouts</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-medium text-white">
                {currentProgram.difficulty_level || 'Beginner'}
              </div>
              <div className="text-xs text-indigo-100">Difficulty</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-medium text-white">
                {workoutType === 'home' ? 'Home' : 'Gym'}
              </div>
              <div className="text-xs text-indigo-100">Workout Type</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseHeader;

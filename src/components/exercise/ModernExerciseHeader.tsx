
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles, Dumbbell, Calendar, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addWeeks } from "date-fns";

interface ModernExerciseHeaderProps {
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

export const ModernExerciseHeader = ({
  currentProgram,
  weekStartDate,
  currentWeekOffset,
  workoutType,
  onWeekChange,
  onShowAIDialog,
  onRegenerateProgram,
  onWorkoutTypeChange,
  isGenerating
}: ModernExerciseHeaderProps) => {
  const { t } = useLanguage();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addWeeks(startDate, 1);
    const startFormat = format(startDate, 'MMM d');
    const endFormat = format(endDate, 'MMM d');
    return `${startFormat} - ${endFormat}`;
  };

  return (
    <div className="px-3 py-4">
      <div className="space-y-4">
        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Program Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Exercise Program
              </h1>
              <p className="text-gray-600 font-medium">
                AI-Powered Personalized Fitness Journey
              </p>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Customize Program
            </Button>
            
            <Button 
              onClick={onRegenerateProgram}
              disabled={isGenerating}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate New
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Program Info Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-md rounded-full">
            <Calendar className="w-4 h-4 mr-2" />
            Week {currentProgram?.current_week || 1}
          </Badge>
          
          <Badge className="bg-gray-100 border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-full">
            <Target className="w-4 h-4 mr-2" />
            {currentProgram?.difficulty_level || 'beginner'}
          </Badge>
          
          <Badge className="bg-green-100 border-green-200 text-green-700 px-4 py-2 text-sm font-medium rounded-full">
            {currentProgram?.program_name || `${workoutType === 'home' ? 'Home' : 'Gym'} Strength Training Program`}
          </Badge>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-10 px-3 rounded-xl hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl px-6 py-2 min-w-[140px] text-center shadow-sm">
              <span className="font-semibold text-gray-700 text-sm">
                {formatWeekRange(weekStartDate)}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-10 px-3 rounded-xl hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Workout Type Toggle */}
          <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-sm">
            <Button
              variant={workoutType === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('home')}
              className={`rounded-xl px-6 py-2 font-semibold transition-all duration-300 ${
                workoutType === 'home' 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Home
            </Button>
            <Button
              variant={workoutType === 'gym' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('gym')}
              className={`rounded-xl px-6 py-2 font-semibold transition-all duration-300 ${
                workoutType === 'gym' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Gym
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

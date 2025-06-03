
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
    <div className="p-6 pb-0">
      <Card className="relative overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl" />
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Program Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
                    Exercise Program
                  </h1>
                  <p className="text-gray-600 font-medium">
                    AI-Powered Personalized Fitness Journey
                  </p>
                </div>
              </div>

              {/* Program Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-md">
                  <Calendar className="w-4 h-4 mr-2" />
                  Week {currentProgram?.current_week || 1}
                </Badge>
                
                <Badge variant="outline" className="bg-white/80 border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium">
                  <Target className="w-4 h-4 mr-2" />
                  {currentProgram?.difficulty_level || 'Intermediate'}
                </Badge>
                
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 px-4 py-2 text-sm font-medium">
                  {currentProgram?.program_name || `${workoutType === 'home' ? 'Home' : 'Gym'} Program`}
                </Badge>
              </div>

              {/* Week Navigation */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onWeekChange(currentWeekOffset - 1)}
                    className="rounded-lg px-3"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 min-w-[120px] text-center">
                    {formatWeekRange(weekStartDate)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onWeekChange(currentWeekOffset + 1)}
                    className="rounded-lg px-3"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Workout Type Toggle */}
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <Button
                    variant={workoutType === 'home' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onWorkoutTypeChange('home')}
                    className="rounded-lg px-4 font-semibold"
                  >
                    Home
                  </Button>
                  <Button
                    variant={workoutType === 'gym' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onWorkoutTypeChange('gym')}
                    className="rounded-lg px-4 font-semibold"
                  >
                    Gym
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onShowAIDialog}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Customize Program
              </Button>
              
              <Button 
                onClick={onRegenerateProgram}
                disabled={isGenerating}
                variant="outline"
                className="bg-white/90 hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
        </div>
      </Card>
    </div>
  );
};

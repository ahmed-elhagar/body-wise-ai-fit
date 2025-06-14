
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RotateCcw, 
  BarChart3, 
  Dumbbell, 
  Coins,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";

interface EnhancedExerciseHeaderWithAnalyticsProps {
  currentProgram: any;
  onShowAnalytics: () => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const EnhancedExerciseHeaderWithAnalytics = ({
  currentProgram,
  onShowAnalytics,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType,
  onWorkoutTypeChange
}: EnhancedExerciseHeaderWithAnalyticsProps) => {
  const { t } = useLanguage();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Exercise Program
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge variant="outline" className={`text-xs ${
                workoutType === 'gym' 
                  ? 'border-purple-200 text-purple-700 bg-purple-50' 
                  : 'border-blue-200 text-blue-700 bg-blue-50'
              }`}>
                {workoutType === 'gym' ? '🏋️ Gym Workout' : '🏠 Home Workout'}
              </Badge>
              {currentProgram && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Week {currentProgram.current_week || 1} of 4</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Credits Display - Smaller */}
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-md border border-amber-200 text-xs">
            <Coins className="w-3 h-3 text-amber-600" />
            <span className="font-medium text-amber-700">{displayCredits}</span>
          </div>

          {/* Analytics Button - Smaller */}
          <Button
            onClick={onShowAnalytics}
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>

          {/* Action Buttons - Smaller */}
          {currentProgram ? (
            <Button
              onClick={onRegenerateProgram}
              disabled={isGenerating || !hasCredits}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Regenerate
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating || !hasCredits}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Generate Program
            </Button>
          )}
        </div>
      </div>

      {/* Program Info Card */}
      {currentProgram && (
        <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{currentProgram.duration_weeks || 4}</div>
                <div className="text-xs text-blue-700 font-medium">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{currentProgram.weekly_frequency || '4-5'}</div>
                <div className="text-xs text-green-700 font-medium">Days/Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{currentProgram.session_duration || 45}</div>
                <div className="text-xs text-purple-700 font-medium">Minutes</div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Target className="w-3 h-3" />
                <span className="font-medium capitalize text-xs">
                  {currentProgram.goal_type?.replace('_', ' ') || 'General Fitness'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-3 h-3" />
                <span className="font-medium capitalize text-xs">
                  {currentProgram.fitness_level || 'Beginner'} Level
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!hasCredits && (
        <Card className="p-2 bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700 text-center">
            You've reached your AI generation limit. Upgrade your plan for unlimited access.
          </p>
        </Card>
      )}
    </div>
  );
};

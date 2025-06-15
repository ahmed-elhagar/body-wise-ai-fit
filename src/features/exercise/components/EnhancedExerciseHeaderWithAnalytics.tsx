
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
import { useMemo } from "react";

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

  // Memoize stable values to prevent flickering
  const stableDisplayCredits = useMemo(() => 
    isPro ? 'Unlimited' : `${userCredits || 0} credits`, 
    [isPro, userCredits]
  );

  const stableProgramData = useMemo(() => ({
    currentWeek: currentProgram?.current_week || 1,
    durationWeeks: currentProgram?.duration_weeks || 4,
    weeklyFrequency: currentProgram?.weekly_frequency || '4-5',
    sessionDuration: currentProgram?.session_duration || 45,
    goalType: currentProgram?.goal_type?.replace('_', ' ') || 'General Fitness',
    fitnessLevel: currentProgram?.fitness_level || 'Beginner'
  }), [currentProgram]);

  return (
    <div className="px-6 pt-6 space-y-4">
      {/* Main Header - Fixed Height Container */}
      <div className="min-h-[80px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">
              Exercise Program
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                workoutType === 'gym' 
                  ? 'border-purple-200 text-purple-700 bg-purple-50' 
                  : 'border-blue-200 text-blue-700 bg-blue-50'
              }`}>
                {workoutType === 'gym' ? '🏋️ Gym' : '🏠 Home'}
              </Badge>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                <span>Week {stableProgramData.currentWeek} of {stableProgramData.durationWeeks}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Fixed Width Container */}
        <div className="flex items-center gap-2 min-w-0 lg:min-w-[320px]">
          {/* Credits Display */}
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-md border border-amber-200 text-xs whitespace-nowrap">
            <Coins className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span className="font-medium text-amber-700">{stableDisplayCredits}</span>
          </div>

          {/* Analytics Button */}
          <Button
            onClick={onShowAnalytics}
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50 whitespace-nowrap"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>

          {/* Main Action Button */}
          {currentProgram ? (
            <Button
              onClick={onRegenerateProgram}
              disabled={isGenerating || !hasCredits}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Regenerate</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating || !hasCredits}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Generate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Program Info Card - Fixed Height when Program Exists */}
      {currentProgram && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 min-h-[100px]">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{stableProgramData.durationWeeks}</div>
                <div className="text-xs text-blue-700 font-medium">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{stableProgramData.weeklyFrequency}</div>
                <div className="text-xs text-green-700 font-medium">Days/Week</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{stableProgramData.sessionDuration}</div>
                <div className="text-xs text-purple-700 font-medium">Minutes</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-3 h-3" />
                <span className="font-medium capitalize text-xs">
                  {stableProgramData.goalType}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-3 h-3" />
                <span className="font-medium capitalize text-xs">
                  {stableProgramData.fitnessLevel} Level
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Credits Warning - Fixed Height */}
      {!hasCredits && (
        <Card className="p-3 bg-amber-50 border border-amber-200 min-h-[60px] flex items-center justify-center">
          <p className="text-xs text-amber-700 text-center">
            You've reached your AI generation limit. Upgrade your plan for unlimited access.
          </p>
        </Card>
      )}
    </div>
  );
};


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
import { useI18n } from "@/hooks/useI18n";
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
  const { t } = useI18n();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-4">
      <div className="px-6 pt-6">
        <div className="space-y-4">
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
                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                  <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                    workoutType === 'gym' 
                      ? 'border-purple-200 text-purple-700 bg-purple-50' 
                      : 'border-blue-200 text-blue-700 bg-blue-50'
                  }`}>
                    {workoutType === 'gym' ? '🏋️ Gym Workout' : '🏠 Home Workout'}
                  </Badge>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    <span>Week {currentProgram?.current_week || 1} of 4</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Credits Display */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200 text-sm">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-700 whitespace-nowrap">{displayCredits}</span>
              </div>

              {/* Analytics Button */}
              <Button
                onClick={onShowAnalytics}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50 whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>

              {/* Action Buttons */}
              {currentProgram ? (
                <Button
                  onClick={onRegenerateProgram}
                  disabled={isGenerating || !hasCredits}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Regenerate
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={onShowAIDialog}
                  disabled={isGenerating || !hasCredits}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Generate Program
                </Button>
              )}
            </div>
          </div>

          {/* Program Info Card - Enhanced Stability */}
          <div className="min-h-[100px]">
            {currentProgram ? (
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{currentProgram.duration_weeks || 4}</div>
                      <div className="text-xs text-blue-700 font-medium">Weeks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{currentProgram.weekly_frequency || '4-5'}</div>
                      <div className="text-xs text-green-700 font-medium">Days/Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{currentProgram.session_duration || 45}</div>
                      <div className="text-xs text-purple-700 font-medium">Minutes</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="font-medium capitalize text-sm">
                        {currentProgram.goal_type?.replace('_', ' ') || 'General Fitness'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium capitalize text-sm">
                        {currentProgram.fitness_level || 'Beginner'} Level
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-4 bg-gray-50 border border-gray-200 shadow-sm">
                <div className="text-center text-gray-500">
                  <div className="text-lg font-medium mb-1">No Program Found</div>
                  <div className="text-sm">Generate your first exercise program to get started</div>
                </div>
              </Card>
            )}
          </div>

          {!hasCredits && (
            <Card className="p-3 bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-700 text-center">
                You've reached your AI generation limit. Upgrade your plan for unlimited access.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

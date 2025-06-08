
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Zap, RefreshCw, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedExerciseHeaderWithAnalyticsProps {
  currentProgram: any;
  onShowAnalytics: () => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const EnhancedExerciseHeaderWithAnalytics = ({
  currentProgram,
  onShowAnalytics,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType
}: EnhancedExerciseHeaderWithAnalyticsProps) => {
  const { t } = useLanguage();

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    return type === 'home' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Program Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {currentProgram?.program_name || 'Exercise Program'}
              </h1>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={getDifficultyColor(currentProgram?.difficulty_level)}
                >
                  {currentProgram?.difficulty_level || 'Beginner'}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={getWorkoutTypeColor(workoutType)}
                >
                  {workoutType === 'home' ? 'Home Workout' : 'Gym Workout'}
                </Badge>
                
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  Week {currentProgram?.current_week || 1}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{currentProgram?.daily_workouts_count || 0} workouts planned</span>
              </div>
              {currentProgram?.total_estimated_calories && (
                <div className="flex items-center gap-1">
                  <span>🔥</span>
                  <span>{currentProgram.total_estimated_calories} cal/week</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAnalytics}
              className="bg-white/80 hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </Button>
            
            {currentProgram && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateProgram}
                disabled={isGenerating}
                className="bg-white/80 hover:bg-orange-50 border-orange-200 text-orange-700 hover:text-orange-800"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Regenerate</span>
                <span className="sm:hidden">Regen</span>
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={onShowAIDialog}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">AI Program</span>
              <span className="sm:hidden">AI</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

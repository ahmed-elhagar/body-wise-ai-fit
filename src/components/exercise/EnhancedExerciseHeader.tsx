
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RotateCcw, Home, Building2, Coins } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";

interface EnhancedExerciseHeaderProps {
  currentProgram: any;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const EnhancedExerciseHeader = ({
  currentProgram,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType
}: EnhancedExerciseHeaderProps) => {
  const { t } = useI18n();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            workoutType === 'gym' 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
              : 'bg-gradient-to-br from-blue-600 to-indigo-600'
          }`}>
            {workoutType === 'gym' ? (
              <Building2 className="w-6 h-6 text-white" />
            ) : (
              <Home className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {currentProgram?.program_name || `${workoutType === 'gym' ? 'Gym' : 'Home'} Exercise Program`}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {workoutType === 'gym' ? 'Gym Workout' : 'Home Workout'}
              </Badge>
              {currentProgram && (
                <span>Week {currentProgram.current_week || 1}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Credits Display */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              {displayCredits}
            </span>
          </div>

          {/* Action Buttons */}
          {currentProgram ? (
            <Button
              onClick={onRegenerateProgram}
              disabled={isGenerating || !hasCredits}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Regenerate Week
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onShowAIDialog}
              disabled={isGenerating || !hasCredits}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Program
            </Button>
          )}
        </div>
      </div>

      {!hasCredits && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            You've reached your AI generation limit. Upgrade your plan for unlimited access.
          </p>
        </div>
      )}
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RotateCcw, 
  BarChart3, 
  Settings,
  Dumbbell
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";

interface CompactExerciseHeaderProps {
  currentProgram: any;
  workoutType: "home" | "gym";
  currentWeekOffset: number;
  onGenerateProgram: () => void;
  onRegenerateProgram: () => void;
  onShowAnalytics: () => void;
  onShowSettings: () => void;
}

export const CompactExerciseHeader = ({
  currentProgram,
  workoutType,
  currentWeekOffset,
  onGenerateProgram,
  onRegenerateProgram,
  onShowAnalytics,
  onShowSettings
}: CompactExerciseHeaderProps) => {
  const { t } = useLanguage();
  const { hasCredits } = useCentralizedCredits();

  return (
    <Card className="p-4 bg-white border border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left side - Title and info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {currentProgram?.program_name || 'Exercise Program'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline" className={`text-xs ${
                workoutType === 'gym' 
                  ? 'border-purple-200 text-purple-700 bg-purple-50' 
                  : 'border-blue-200 text-blue-700 bg-blue-50'
              }`}>
                {workoutType === 'gym' ? '🏋️ Gym' : '🏠 Home'}
              </Badge>
              <span className="text-xs">
                Week {currentWeekOffset + 1} of 4
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onShowAnalytics}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </Button>

          <Button
            onClick={onShowSettings}
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs"
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>

          {currentProgram ? (
            <Button
              onClick={onRegenerateProgram}
              disabled={!hasCredits}
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
          ) : (
            <Button
              onClick={onGenerateProgram}
              disabled={!hasCredits}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Generate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Home, Building2 } from "lucide-react";

interface ExerciseProgramActionsProps {
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const ExerciseProgramActions = ({
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType
}: ExerciseProgramActionsProps) => {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {workoutType === "home" ? (
            <Home className="w-5 h-5 text-fitness-primary" />
          ) : (
            <Building2 className="w-5 h-5 text-fitness-primary" />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {workoutType === "home" ? "Home" : "Gym"} Workout Program
          </h3>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Customize Program
          </Button>
          
          <Button
            onClick={onRegenerateProgram}
            disabled={isGenerating}
            variant="outline"
            className="bg-white/80"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>
    </Card>
  );
};

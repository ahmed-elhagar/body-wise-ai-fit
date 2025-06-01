
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Home, Building2 } from "lucide-react";
import { AIExerciseDialog } from "./AIExerciseDialog";

interface EmptyExerciseStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
}

export const EmptyExerciseState = ({ 
  onGenerateProgram, 
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating 
}: EmptyExerciseStateProps) => {
  return (
    <>
      <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
        <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exercise Program Yet</h3>
        <p className="text-gray-600 mb-6">Generate your personalized AI exercise program to get started</p>
        
        {/* Workout Type Selection */}
        <div className="flex justify-center gap-3 mb-6">
          <Button
            variant={workoutType === "home" ? "default" : "outline"}
            onClick={() => setWorkoutType("home")}
            className={`${workoutType === "home" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant={workoutType === "gym" ? "default" : "outline"}
            onClick={() => setWorkoutType("gym")}
            className={`${workoutType === "gym" ? "bg-health-primary hover:bg-health-primary/90" : ""}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Gym
          </Button>
        </div>
        
        <Button 
          onClick={onGenerateProgram}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate AI Exercise Program'}
        </Button>
      </Card>

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={(prefs) => {
          // This will be handled by the parent component
          setShowAIDialog(false);
        }}
        isGenerating={isGenerating}
      />
    </>
  );
};

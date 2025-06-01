
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles } from "lucide-react";

interface EmptyExerciseStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (preferences: any) => void;
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
    <Card className="p-8 text-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-xl">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
        <Dumbbell className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-3xl font-bold text-gray-800 mb-3">
        No Exercise Program Yet
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Get started with your personalized AI-powered exercise program tailored to your fitness goals.
      </p>
      
      <div className="space-y-4">
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={workoutType === "home" ? "default" : "outline"}
            onClick={() => setWorkoutType("home")}
            className="px-6 py-2"
          >
            Home Workout
          </Button>
          <Button
            variant={workoutType === "gym" ? "default" : "outline"}
            onClick={() => setWorkoutType("gym")}
            className="px-6 py-2"
          >
            Gym Workout
          </Button>
        </div>
        
        <Button 
          onClick={onGenerateProgram} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {isGenerating ? 'Generating...' : 'Generate AI Exercise Program'}
        </Button>
      </div>
    </Card>
  );
};

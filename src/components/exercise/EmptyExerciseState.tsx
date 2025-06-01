
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Sparkles } from "lucide-react";

export interface EmptyExerciseStateProps {
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
    <Card className="p-8 text-center bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-xl backdrop-blur-sm">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-fitness-primary to-pink-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <Dumbbell className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-fitness-primary to-pink-600 bg-clip-text text-transparent">
        No Exercise Program
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Generate your first personalized workout program
      </p>
      
      <div className="space-y-4">
        <div className="flex gap-2 justify-center mb-4">
          <Button
            onClick={() => setWorkoutType("home")}
            variant={workoutType === "home" ? "default" : "outline"}
            size="sm"
          >
            Home Workout
          </Button>
          <Button
            onClick={() => setWorkoutType("gym")}
            variant={workoutType === "gym" ? "default" : "outline"}
            size="sm"
          >
            Gym Workout
          </Button>
        </div>
        
        <Button 
          onClick={onGenerateProgram} 
          className="bg-fitness-gradient hover:opacity-90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
          disabled={isGenerating}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {isGenerating ? 'Generating...' : 'Generate Exercise Program'}
        </Button>
      </div>
    </Card>
  );
};

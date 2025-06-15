
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Dumbbell } from "lucide-react";
import { useState } from "react";

interface ExerciseEmptyStateProps {
  onGenerateProgram: () => void;
  workoutType: "home" | "gym";
  dailyWorkoutId?: string;
}

export const ExerciseEmptyState = ({
  onGenerateProgram,
  workoutType,
  dailyWorkoutId
}: ExerciseEmptyStateProps) => {
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);

  return (
    <Card className="p-12 text-center bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 border-0 shadow-xl">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-fitness-primary-800 mb-3">
          No Exercises Today
        </h3>
        <p className="text-fitness-primary-600 text-lg leading-relaxed mb-6">
          No exercises are scheduled for today. Generate a new workout program or add custom exercises.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onGenerateProgram}
            size="lg" 
            className="bg-gradient-to-r from-fitness-primary-500 to-fitness-secondary-500 hover:from-fitness-primary-600 hover:to-fitness-secondary-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Dumbbell className="w-5 h-5 mr-2" />
            Generate Program
          </Button>
          
          {dailyWorkoutId && (
            <Button 
              onClick={() => setShowCustomExerciseDialog(true)}
              variant="outline"
              size="lg"
              className="border-2 border-fitness-primary-300 text-fitness-primary-700 hover:bg-fitness-primary-50 font-semibold px-8 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Custom Exercise
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

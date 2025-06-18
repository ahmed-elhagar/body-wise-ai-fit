
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles } from "lucide-react";

interface ExerciseEmptyStateProps {
  workoutType: string;
  onGenerateClick: () => void;
}

export const ExerciseEmptyState = ({ workoutType, onGenerateClick }: ExerciseEmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Exercise Program Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Generate your personalized {workoutType} workout program with AI to start your fitness journey.
          </p>
          <Button 
            onClick={onGenerateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-white">Generate AI Program</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

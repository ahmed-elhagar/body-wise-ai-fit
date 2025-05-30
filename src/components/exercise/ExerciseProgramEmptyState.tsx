
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles } from "lucide-react";

interface ExerciseProgramEmptyStateProps {
  workoutType: string;
  onGenerateClick: () => void;
}

const ExerciseProgramEmptyState = ({ workoutType, onGenerateClick }: ExerciseProgramEmptyStateProps) => {
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
            className="bg-fitness-gradient text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Program
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseProgramEmptyState;


import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface ExerciseProgramLoadingStatesProps {
  isGenerating: boolean;
  isLoading: boolean;
}

export const ExerciseProgramLoadingStates = ({ 
  isGenerating, 
  isLoading 
}: ExerciseProgramLoadingStatesProps) => {
  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <Dumbbell className="w-12 h-12 text-fitness-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Generating Your Exercise Program
          </h3>
          <p className="text-gray-600 mb-4">
            Our AI is creating a personalized workout plan tailored to your goals and preferences...
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✓ Analyzing your fitness level</p>
            <p>✓ Selecting appropriate exercises</p>
            <p>✓ Creating weekly schedule</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
          <div className="w-12 h-12 animate-spin border-4 border-fitness-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your exercise program...</p>
        </Card>
      </div>
    );
  }

  return null;
};

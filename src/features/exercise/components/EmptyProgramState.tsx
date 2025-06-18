
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Target } from "lucide-react";

interface EmptyProgramStateProps {
  onGenerateProgram: () => void;
  isGenerating?: boolean;
}

const EmptyProgramState = ({ onGenerateProgram, isGenerating }: EmptyProgramStateProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Exercise Program Found
        </h3>
        <p className="text-gray-600 mb-6">
          Get started with a personalized AI-generated workout program tailored to your fitness goals and preferences.
        </p>
        <Button 
          onClick={onGenerateProgram}
          disabled={isGenerating}
          className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate AI Workout Plan'}
        </Button>
      </div>
    </Card>
  );
};

export default EmptyProgramState;

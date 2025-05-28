
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles } from "lucide-react";

interface EmptyExerciseStateProps {
  onGenerateProgram: () => void;
  isGenerating: boolean;
}

export const EmptyExerciseState = ({ onGenerateProgram, isGenerating }: EmptyExerciseStateProps) => {
  return (
    <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
      <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Exercise Program Yet</h3>
      <p className="text-gray-600 mb-6">Generate your personalized AI exercise program to get started</p>
      <Button 
        onClick={onGenerateProgram}
        disabled={isGenerating}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate AI Exercise Program'}
      </Button>
    </Card>
  );
};

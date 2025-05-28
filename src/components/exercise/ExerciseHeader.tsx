
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExerciseHeaderProps {
  currentProgram: any;
  onGenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExerciseHeader = ({ currentProgram, onGenerateProgram, isGenerating }: ExerciseHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exercise Program</h1>
          <p className="text-gray-600">
            {currentProgram ? `${currentProgram.program_name} - ${currentProgram.difficulty_level}` : "Generate your workout plan"}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={onGenerateProgram}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'AI Generate'}
        </Button>
        <Badge variant="outline" className="bg-white/80">
          <Home className="w-3 h-3 mr-1" />
          Home Workout
        </Badge>
      </div>
    </div>
  );
};

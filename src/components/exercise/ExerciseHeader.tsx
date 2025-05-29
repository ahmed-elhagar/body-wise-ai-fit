
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProgramTypeIndicator } from "./ProgramTypeIndicator";

interface ExerciseHeaderProps {
  currentProgram: any;
  onGenerateProgram: () => void;
  onShowAIDialog: () => void;
  isGenerating: boolean;
}

export const ExerciseHeader = ({ 
  currentProgram, 
  onGenerateProgram, 
  onShowAIDialog, 
  isGenerating 
}: ExerciseHeaderProps) => {
  const navigate = useNavigate();
  
  // Determine workout type from program data
  const workoutType = currentProgram?.workout_type || "home";

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
          <div className="flex items-center space-x-3 mt-1">
            <p className="text-gray-600">
              {currentProgram ? `${currentProgram.program_name} - ${currentProgram.difficulty_level}` : "Generate your workout plan"}
            </p>
            {currentProgram && <ProgramTypeIndicator type={workoutType} />}
          </div>
        </div>
      </div>
      
      {currentProgram && (
        <div className="flex space-x-3">
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Customize Program
          </Button>
          
          <Button 
            onClick={onGenerateProgram}
            disabled={isGenerating}
            variant="outline"
            className="bg-white/80"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>
      )}
    </div>
  );
};

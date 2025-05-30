
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Sparkles, Home, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExercisePageHeaderProps {
  currentProgram: any;
  workoutType: "home" | "gym";
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
}

export const ExercisePageHeader = ({
  currentProgram,
  workoutType,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating
}: ExercisePageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t('exercise.exerciseProgram') || 'Exercise Program'}
          </h1>
          <div className="flex items-center space-x-3 mt-1">
            <p className="text-gray-600">
              {currentProgram.program_name} - {currentProgram.difficulty_level}
            </p>
            <div className="flex items-center gap-1">
              {workoutType === "home" ? (
                <Home className="w-4 h-4 text-health-primary" />
              ) : (
                <Building2 className="w-4 h-4 text-health-primary" />
              )}
              <span className="text-sm text-health-primary font-medium">
                {workoutType === "home" ? t('exercise.home') : t('exercise.gym')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          onClick={onShowAIDialog}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t('exercise.customizeProgram') || 'Customize Program'}
        </Button>
        
        <Button 
          onClick={onRegenerateProgram}
          disabled={isGenerating}
          variant="outline"
          className="bg-white/80"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('exercise.generateNew') || 'Generate New'}
        </Button>
      </div>
    </div>
  );
};

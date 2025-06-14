
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseProgramEmptyStateProps {
  workoutType: string;
  onGenerateClick: () => void;
}

export const ExerciseProgramEmptyState = ({ workoutType, onGenerateClick }: ExerciseProgramEmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('exercise.noProgram', 'No Exercise Program Yet')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('exercise.generatePrompt', `Generate your personalized ${workoutType} workout program with AI to start your fitness journey.`)}
          </p>
          <Button 
            onClick={onGenerateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-white">{t('exercise.generateProgram', 'Generate AI Program')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

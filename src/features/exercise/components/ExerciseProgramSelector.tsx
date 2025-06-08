
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExercisePreferences } from "../types";

interface ExerciseProgramSelectorProps {
  onGenerateProgram: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
}

export const ExerciseProgramSelector = ({ 
  onGenerateProgram, 
  isGenerating, 
  workoutType 
}: ExerciseProgramSelectorProps) => {
  const { t } = useLanguage();

  const handleGenerate = () => {
    const defaultPreferences: ExercisePreferences = {
      workoutType: workoutType,
      goalType: "general_fitness",
      fitnessLevel: "beginner",
      availableTime: "45",
      preferredWorkouts: ["bodyweight", "cardio"],
      targetMuscleGroups: ["full_body"],
      equipment: workoutType === "gym" 
        ? ["barbells", "dumbbells", "machines", "cables"] 
        : ["bodyweight", "resistance_bands", "light_dumbbells"],
      duration: "4",
      workoutDays: "4-5 days per week",
      difficulty: "beginner"
    };
    onGenerateProgram(defaultPreferences);
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 mr-2 text-gray-500" />
            {t('exercise.noProgram')}
          </CardTitle>
          <CardDescription>
            {t('exercise.generateProgram')}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <div className="space-y-4">
            <div className="text-gray-700">
              {t('exercise.customize')}
            </div>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-fitness-primary-500 hover:bg-fitness-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? t('Generating...') : t('exercise.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

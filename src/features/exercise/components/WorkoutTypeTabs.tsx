
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { ExerciseProgram, ExercisePreferences } from "../types";

interface WorkoutTypeTabsProps {
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  currentProgram: ExerciseProgram | null;
  onGenerateAIProgram: (preferences: ExercisePreferences) => void;
  isGenerating: boolean;
}

export const WorkoutTypeTabs = ({
  workoutType,
  setWorkoutType,
  currentProgram,
  onGenerateAIProgram,
  isGenerating
}: WorkoutTypeTabsProps) => {
  const { t } = useLanguage();

  const renderTabContent = (type: "home" | "gym") => {
    const hasValidProgram = currentProgram && currentProgram.workout_type === type;

    if (hasValidProgram) {
      return (
        <div className="space-y-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Exercise Program Loaded</h3>
            <p className="text-sm text-gray-600">Exercise content will be displayed here</p>
          </div>
        </div>
      );
    }

    return (
      <ExerciseProgramSelector 
        onGenerateProgram={(prefs) => onGenerateAIProgram({...prefs, workoutType: type})}
        isGenerating={isGenerating}
        workoutType={type}
      />
    );
  };

  return (
    <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-white h-14 border border-health-border rounded-xl shadow-sm p-1">
        <TabsTrigger 
          value="home" 
          className="data-[state=active]:bg-health-primary data-[state=active]:text-white data-[state=active]:shadow-md text-health-text-secondary font-medium rounded-lg transition-all duration-200 h-11"
        >
          <Home className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.homeWorkout')}</span>
          <span className="sm:hidden">{t('exercise.home')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="gym" 
          className="data-[state=active]:bg-health-primary data-[state=active]:text-white data-[state=active]:shadow-md text-health-text-secondary font-medium rounded-lg transition-all duration-200 h-11"
        >
          <Building2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('exercise.gymWorkout')}</span>
          <span className="sm:hidden">{t('exercise.gym')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="mt-6">
        {renderTabContent("home")}
      </TabsContent>

      <TabsContent value="gym" className="mt-6">
        {renderTabContent("gym")}
      </TabsContent>
    </Tabs>
  );
};

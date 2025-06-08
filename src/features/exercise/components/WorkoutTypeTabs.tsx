
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutTypeTabsProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  children?: React.ReactNode;
}

export const WorkoutTypeTabs = ({ 
  workoutType, 
  onWorkoutTypeChange,
  children 
}: WorkoutTypeTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={workoutType} onValueChange={(value) => onWorkoutTypeChange(value as "home" | "gym")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          {t('exercise.home', 'Home')}
        </TabsTrigger>
        <TabsTrigger value="gym" className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4" />
          {t('exercise.gym', 'Gym')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="home">
        {children}
      </TabsContent>
      
      <TabsContent value="gym">
        {children}
      </TabsContent>
    </Tabs>
  );
};

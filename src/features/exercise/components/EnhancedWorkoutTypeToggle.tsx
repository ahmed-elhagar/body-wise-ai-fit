
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedWorkoutTypeToggleProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const EnhancedWorkoutTypeToggle = ({ 
  workoutType, 
  onWorkoutTypeChange 
}: EnhancedWorkoutTypeToggleProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Workout Environment</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={workoutType === "home" ? "default" : "outline"}
          onClick={() => onWorkoutTypeChange("home")}
          className={`h-16 flex flex-col gap-2 transition-all duration-200 ${
            workoutType === "home" 
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl border-0" 
              : "bg-white hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="font-medium">{t('exercise.home') || 'Home'}</span>
        </Button>
        
        <Button
          variant={workoutType === "gym" ? "default" : "outline"}
          onClick={() => onWorkoutTypeChange("gym")}
          className={`h-16 flex flex-col gap-2 transition-all duration-200 ${
            workoutType === "gym" 
              ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl border-0" 
              : "bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800"
          }`}
        >
          <Building2 className="w-6 h-6" />
          <span className="font-medium">{t('exercise.gym') || 'Gym'}</span>
        </Button>
      </div>
    </Card>
  );
};

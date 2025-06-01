import { Button } from "@/components/ui/button";
import { Calendar, Grid, Home, Dumbbell } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface ViewModeToggleProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  workoutMode?: 'home' | 'gym';
  onWorkoutModeChange?: (mode: 'home' | 'gym') => void;
}

const ViewModeToggle = ({ 
  viewMode, 
  onViewModeChange,
  workoutMode = 'home',
  onWorkoutModeChange
}: ViewModeToggleProps) => {
  const { t, isRTL } = useI18n();
  const { mealPlanT } = useMealPlanTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {/* View Mode Toggle */}
      <div className="flex bg-gradient-to-r from-white to-fitness-neutral-50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border-2 border-fitness-primary-200">
        <Button
          variant={viewMode === 'daily' ? 'default' : 'ghost'}
          className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
            viewMode === 'daily' 
              ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-xl transform scale-105 border-2 border-fitness-primary-400' 
              : 'hover:bg-fitness-primary-50 text-fitness-primary-700 hover:text-fitness-primary-800 border-2 border-transparent hover:border-fitness-primary-200'
          }`}
          onClick={() => onViewModeChange('daily')}
          size="sm"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {mealPlanT('dailyView')}
        </Button>
        <Button
          variant={viewMode === 'weekly' ? 'default' : 'ghost'}
          className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
            viewMode === 'weekly' 
              ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-xl transform scale-105 border-2 border-fitness-primary-400' 
              : 'hover:bg-fitness-primary-50 text-fitness-primary-700 hover:text-fitness-primary-800 border-2 border-transparent hover:border-fitness-primary-200'
          }`}
          onClick={() => onViewModeChange('weekly')}
          size="sm"
        >
          <Grid className="w-4 h-4 mr-2" />
          {mealPlanT('weeklyView')}
        </Button>
      </div>

      {/* Workout Mode Toggle (if provided) */}
      {onWorkoutModeChange && (
        <div className="flex bg-gradient-to-r from-white to-fitness-secondary-50 backdrop-blur-sm rounded-2xl p-1 shadow-lg border-2 border-fitness-secondary-200">
          <Button
            variant={workoutMode === 'home' ? 'default' : 'ghost'}
            className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
              workoutMode === 'home' 
                ? 'bg-gradient-to-r from-fitness-secondary-500 to-fitness-secondary-600 text-white shadow-xl transform scale-105 border-2 border-fitness-secondary-400' 
                : 'hover:bg-fitness-secondary-50 text-fitness-secondary-700 hover:text-fitness-secondary-800 border-2 border-transparent hover:border-fitness-secondary-200'
            }`}
            onClick={() => onWorkoutModeChange('home')}
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant={workoutMode === 'gym' ? 'default' : 'ghost'}
            className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-xl ${
              workoutMode === 'gym' 
                ? 'bg-gradient-to-r from-fitness-secondary-500 to-fitness-secondary-600 text-white shadow-xl transform scale-105 border-2 border-fitness-secondary-400' 
                : 'hover:bg-fitness-secondary-50 text-fitness-secondary-700 hover:text-fitness-secondary-800 border-2 border-transparent hover:border-fitness-secondary-200'
            }`}
            onClick={() => onWorkoutModeChange('gym')}
            size="sm"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Gym
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewModeToggle;

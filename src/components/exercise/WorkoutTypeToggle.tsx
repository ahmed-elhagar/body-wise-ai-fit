
import { useI18n } from '@/hooks/useI18n';
import { Button } from '@/components/ui/button';
import { Home, Dumbbell } from 'lucide-react';

interface WorkoutTypeToggleProps {
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const WorkoutTypeToggle = ({
  workoutType,
  onWorkoutTypeChange
}: WorkoutTypeToggleProps) => {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {t('Workout Environment')}
        </h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <Button
            variant={workoutType === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onWorkoutTypeChange('home')}
            className="flex items-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            {t('Home')}
          </Button>
          <Button
            variant={workoutType === 'gym' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onWorkoutTypeChange('gym')}
            className="flex items-center gap-2 text-sm"
          >
            <Dumbbell className="w-4 h-4" />
            {t('Gym')}
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        {workoutType === 'home' 
          ? t('Home workouts focus on bodyweight exercises and minimal equipment')
          : t('Gym workouts utilize full equipment including weights and machines')
        }
      </p>
    </div>
  );
};

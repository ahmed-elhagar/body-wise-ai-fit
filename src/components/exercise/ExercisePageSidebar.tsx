
import { useI18n } from '@/hooks/useI18n';
import ProgressRing from './ProgressRing';

interface ExercisePageSidebarProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
}

export const ExercisePageSidebar = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay
}: ExercisePageSidebarProps) => {
  const { t } = useI18n();

  const getMotivationContent = () => {
    if (progressPercentage === 100) {
      return {
        emoji: '💪',
        title: 'Completed!',
        message: 'Great job finishing today\'s workout!'
      };
    } else if (progressPercentage > 50) {
      return {
        emoji: '💪',
        title: 'Almost There!',
        message: 'Every rep counts towards your goals'
      };
    } else if (progressPercentage > 0) {
      return {
        emoji: '💪',
        title: 'Keep Going!',
        message: 'Every rep counts towards your goals'
      };
    } else {
      return {
        emoji: '💪',
        title: 'Start Strong!',
        message: 'Every rep counts towards your goals'
      };
    }
  };

  const motivation = getMotivationContent();

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <ProgressRing
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            isToday={isToday}
            isRestDay={isRestDay}
          />
        </div>
        
        <div className="bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 rounded-2xl border border-fitness-primary-200 p-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-2xl">{motivation.emoji}</span>
            </div>
            <h3 className="font-semibold text-fitness-primary-800">
              {motivation.title}
            </h3>
            <p className="text-sm text-fitness-primary-600">
              {motivation.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

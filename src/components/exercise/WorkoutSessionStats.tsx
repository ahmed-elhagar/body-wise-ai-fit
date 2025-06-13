
import { Clock, CheckCircle, Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkoutSessionStatsProps {
  sessionDuration: number;
  completedExercises: number;
  totalExercises: number;
  sessionProgress: number;
}

export const WorkoutSessionStats = ({
  sessionDuration,
  completedExercises,
  totalExercises,
  sessionProgress
}: WorkoutSessionStatsProps) => {
  const { t } = useLanguage();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center p-3 bg-white rounded-lg border">
        <div className="flex items-center justify-center mb-1">
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-lg font-bold text-gray-900">
          {formatDuration(sessionDuration)}
        </div>
        <div className="text-xs text-gray-500">{t('Duration')}</div>
      </div>
      
      <div className="text-center p-3 bg-white rounded-lg border">
        <div className="flex items-center justify-center mb-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-lg font-bold text-gray-900">
          {completedExercises}/{totalExercises}
        </div>
        <div className="text-xs text-gray-500">{t('Completed')}</div>
      </div>
      
      <div className="text-center p-3 bg-white rounded-lg border">
        <div className="flex items-center justify-center mb-1">
          <Trophy className="w-4 h-4 text-orange-600" />
        </div>
        <div className="text-lg font-bold text-gray-900">
          {Math.round(sessionProgress)}%
        </div>
        <div className="text-xs text-gray-500">{t('Progress')}</div>
      </div>
    </div>
  );
};

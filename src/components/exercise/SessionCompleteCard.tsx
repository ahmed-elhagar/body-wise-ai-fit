
import { Trophy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SessionCompleteCardProps {
  sessionProgress: number;
  sessionDuration: number;
}

export const SessionCompleteCard = ({ sessionProgress, sessionDuration }: SessionCompleteCardProps) => {
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

  if (sessionProgress !== 100) {
    return null;
  }

  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
      <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
      <div className="font-bold text-green-800 mb-1">
        {t('Workout Complete!')}
      </div>
      <div className="text-sm text-green-700">
        {t('Great job! You completed all exercises in')} {formatDuration(sessionDuration)}
      </div>
    </div>
  );
};

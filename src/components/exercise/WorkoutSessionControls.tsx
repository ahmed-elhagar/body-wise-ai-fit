
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkoutSessionControlsProps {
  isSessionActive: boolean;
  sessionStartTime: Date | null;
  onStartSession: () => void;
  onPauseSession: () => void;
  onResumeSession: () => void;
  onEndSession: () => void;
}

export const WorkoutSessionControls = ({
  isSessionActive,
  sessionStartTime,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onEndSession
}: WorkoutSessionControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {!isSessionActive && !sessionStartTime && (
        <Button onClick={onStartSession} className="bg-blue-600 hover:bg-blue-700">
          <Play className="w-4 h-4 mr-2" />
          {t('Start Workout')}
        </Button>
      )}
      {isSessionActive && (
        <>
          <Button variant="outline" onClick={onPauseSession}>
            <Pause className="w-4 h-4 mr-2" />
            {t('Pause')}
          </Button>
          <Button variant="destructive" onClick={onEndSession}>
            <Square className="w-4 h-4 mr-2" />
            {t('End')}
          </Button>
        </>
      )}
      {!isSessionActive && sessionStartTime && (
        <Button onClick={onResumeSession} className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" />
          {t('Resume')}
        </Button>
      )}
    </div>
  );
};

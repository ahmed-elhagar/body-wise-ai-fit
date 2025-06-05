
import { Button } from '@/components/ui/button';
import { 
  Youtube, 
  RefreshCw, 
  BookOpen,
  Share
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface ExerciseActionsMenuProps {
  exercise: Exercise;
  onShowVideo: () => void;
  onShowExchange?: () => void;
  onShowInstructions?: () => void;
}

export const ExerciseActionsMenu = ({ 
  exercise, 
  onShowVideo, 
  onShowExchange,
  onShowInstructions 
}: ExerciseActionsMenuProps) => {
  const { t } = useLanguage();

  const handleShare = async () => {
    const shareText = `💪 ${exercise.name} - ${exercise.sets} sets × ${exercise.reps} reps`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: exercise.name,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* YouTube Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onShowVideo}
        className="h-8 px-2"
        title={t('Watch Video')}
      >
        <Youtube className="w-4 h-4 text-red-600" />
      </Button>
      
      {/* Exchange Button */}
      {onShowExchange && !exercise.completed && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowExchange}
          className="h-8 px-2"
          title={t('Exchange Exercise')}
        >
          <RefreshCw className="w-4 h-4 text-orange-600" />
        </Button>
      )}
      
      {/* Instructions Button */}
      {exercise.instructions && onShowInstructions && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShowInstructions}
          className="h-8 px-2"
          title={t('View Instructions')}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
        </Button>
      )}
      
      {/* Share Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="h-8 px-2"
        title={t('Share Exercise')}
      >
        <Share className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  );
};

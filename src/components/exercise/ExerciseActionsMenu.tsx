
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Youtube, 
  RefreshCw, 
  BookOpen,
  Share,
  Edit
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onShowVideo}>
          <Youtube className="w-4 h-4 mr-2 text-red-600" />
          {t('Watch Video')}
        </DropdownMenuItem>
        
        {onShowExchange && (
          <DropdownMenuItem onClick={onShowExchange}>
            <RefreshCw className="w-4 h-4 mr-2 text-orange-600" />
            {t('Exchange Exercise')}
          </DropdownMenuItem>
        )}
        
        {exercise.instructions && onShowInstructions && (
          <DropdownMenuItem onClick={onShowInstructions}>
            <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
            {t('View Instructions')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleShare}>
          <Share className="w-4 h-4 mr-2 text-gray-600" />
          {t('Share Exercise')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

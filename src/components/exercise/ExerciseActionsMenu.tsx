
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Play, 
  Edit, 
  Trash2, 
  Video,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface ExerciseActionsMenuProps {
  exercise: Exercise;
  onShowVideo: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const ExerciseActionsMenu = ({ 
  exercise, 
  onShowVideo, 
  onEdit, 
  onDelete,
  onDuplicate 
}: ExerciseActionsMenuProps) => {
  const { t } = useLanguage();

  const handleOpenYouTube = () => {
    const searchTerm = exercise.youtube_search_term || exercise.name;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' exercise tutorial')}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onShowVideo} className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          {t('Video Tutorial')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleOpenYouTube} className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          {t('Search YouTube')}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            {t('Edit Exercise')}
          </DropdownMenuItem>
        )}
        
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            {t('Duplicate')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {onDelete && (
          <DropdownMenuItem 
            onClick={onDelete} 
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {t('Delete')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

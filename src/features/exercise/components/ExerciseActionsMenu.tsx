
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Video, ArrowLeftRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Exercise } from '@/types/exercise';

interface ExerciseActionsMenuProps {
  exercise: Exercise;
  onShowVideo: () => void;
  onShowExchange: () => void;
}

export const ExerciseActionsMenu: React.FC<ExerciseActionsMenuProps> = ({
  exercise,
  onShowVideo,
  onShowExchange,
}) => {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onShowVideo}>
          <Video className="mr-2 h-4 w-4" />
          {t('Watch Video')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShowExchange}>
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          {t('Exchange Exercise')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

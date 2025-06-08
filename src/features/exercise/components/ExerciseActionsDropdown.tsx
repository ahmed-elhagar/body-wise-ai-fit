
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Youtube, 
  RefreshCw, 
  BookOpen,
  Share,
  Edit3,
  Timer,
  Target,
  Trash2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseInstructionsDialog } from "./ExerciseInstructionsDialog";

interface ExerciseActionsDropdownProps {
  exercise: any;
  onShowVideo?: () => void;
  onShowExchange?: () => void;
  onEditExercise?: () => void;
  onDeleteExercise?: () => void;
  onStartTimer?: () => void;
  size?: "sm" | "default";
}

export const ExerciseActionsDropdown = ({ 
  exercise, 
  onShowVideo,
  onShowExchange,
  onEditExercise,
  onDeleteExercise,
  onStartTimer,
  size = "default"
}: ExerciseActionsDropdownProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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

  const handleWatchVideo = () => {
    const searchQuery = exercise.youtube_search_term || exercise.name;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={`h-8 w-8 p-0 hover:bg-gray-100 ${size === "sm" ? "h-6 w-6" : ""}`}
          >
            <MoreHorizontal className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50"
          sideOffset={5}
        >
          {/* Video Tutorial */}
          <DropdownMenuItem 
            onClick={handleWatchVideo}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer"
          >
            <Youtube className="w-4 h-4 text-red-600" />
            <span className="text-sm">{t('Watch Tutorial')}</span>
          </DropdownMenuItem>

          {/* Exercise Instructions */}
          {exercise.instructions && (
            <DropdownMenuItem 
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{t('View Instructions')}</span>
            </DropdownMenuItem>
          )}

          {/* Start Timer */}
          {!exercise.completed && onStartTimer && (
            <DropdownMenuItem 
              onClick={onStartTimer}
              className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 cursor-pointer"
            >
              <Timer className="w-4 h-4 text-green-600" />
              <span className="text-sm">{t('Start Rest Timer')}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          {/* Exchange Exercise */}
          {!exercise.completed && onShowExchange && (
            <DropdownMenuItem 
              onClick={onShowExchange}
              className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-orange-600" />
              <span className="text-sm">{t('Exchange Exercise')}</span>
            </DropdownMenuItem>
          )}

          {/* Edit Exercise */}
          {onEditExercise && (
            <DropdownMenuItem 
              onClick={onEditExercise}
              className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm">{t('Edit Exercise')}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-1 bg-gray-100" />

          {/* Share Exercise */}
          <DropdownMenuItem 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <Share className="w-4 h-4 text-gray-600" />
            <span className="text-sm">{t('Share Exercise')}</span>
          </DropdownMenuItem>

          {/* Delete Exercise */}
          {onDeleteExercise && (
            <>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem 
                onClick={onDeleteExercise}
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">{t('Delete Exercise')}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ExerciseInstructionsDialog
        exercise={exercise}
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </>
  );
};

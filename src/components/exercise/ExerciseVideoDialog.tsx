
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Youtube, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface ExerciseVideoDialogProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseVideoDialog = ({ exercise, open, onOpenChange }: ExerciseVideoDialogProps) => {
  const { t } = useLanguage();

  const handleWatchVideo = () => {
    const searchQuery = exercise.youtube_search_term || exercise.name;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            {t('Exercise Video')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
            <p className="text-gray-600 text-sm mb-4">
              {t('Watch video tutorials to learn proper form and technique')}
            </p>
          </div>
          
          <Button 
            onClick={handleWatchVideo}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Youtube className="w-4 h-4 mr-2" />
            {t('Watch on YouTube')}
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
          
          {exercise.instructions && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">{t('Quick Instructions')}:</h4>
              <p className="text-xs text-gray-700">{exercise.instructions}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

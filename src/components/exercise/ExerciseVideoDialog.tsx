
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ExternalLink,
  Clock,
  Target,
  User
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/types/exercise';

interface ExerciseVideoDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExerciseVideoDialog = ({ exercise, open, onOpenChange }: ExerciseVideoDialogProps) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!exercise) return null;

  // Generate YouTube search URL
  const searchTerm = exercise.youtube_search_term || exercise.name;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' exercise tutorial')}`;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            {exercise.name} - {t('Video Tutorial')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Placeholder */}
          <Card className="relative bg-gray-900 aspect-video rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center text-white space-y-4">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('Exercise Tutorial')}</h3>
                  <p className="text-gray-300 text-sm max-w-md">
                    {t('Click below to search for video tutorials on YouTube')}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMuteToggle}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <span className="text-white text-sm">0:00 / 0:00</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Exercise Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                {t('Exercise Details')}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('Sets')}:</span>
                  <Badge variant="outline">{exercise.sets || 3}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('Reps')}:</span>
                  <Badge variant="outline">{exercise.reps || '12'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('Rest')}:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exercise.rest_seconds || 60}s
                  </Badge>
                </div>
                {exercise.equipment && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('Equipment')}:</span>
                    <Badge variant="secondary">{exercise.equipment}</Badge>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                {t('Instructions')}
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                {exercise.instructions ? (
                  <p>{exercise.instructions}</p>
                ) : (
                  <p className="italic">{t('No specific instructions provided for this exercise.')}</p>
                )}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <div>
                    <span className="font-medium">{t('Target Muscles')}: </span>
                    <span>{exercise.muscle_groups.join(', ')}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {t('Difficulty')}: {exercise.difficulty || 'Medium'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(youtubeSearchUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {t('Search YouTube')}
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                {t('Close')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

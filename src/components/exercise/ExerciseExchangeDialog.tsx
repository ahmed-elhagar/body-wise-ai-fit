
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Dumbbell } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExercise: {
    name: string;
    muscle_groups: string[];
    equipment?: string;
  };
  onExchangeConfirm: (newExercise: any) => void;
}

const ExerciseExchangeDialog = ({ 
  open, 
  onOpenChange, 
  currentExercise, 
  onExchangeConfirm 
}: ExerciseExchangeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockAlternatives = [
    { id: '1', name: 'Push-ups', muscle_groups: ['chest', 'triceps'], equipment: 'bodyweight' },
    { id: '2', name: 'Chest Press', muscle_groups: ['chest', 'triceps'], equipment: 'dumbbells' },
    { id: '3', name: 'Incline Push-ups', muscle_groups: ['chest', 'triceps'], equipment: 'bodyweight' }
  ];

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlternatives(mockAlternatives);
      setIsLoading(false);
    }, 1000);
  };

  const handleExchange = (exercise: any) => {
    onExchangeConfirm(exercise);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <RefreshCw className="w-5 h-5" />
            {t('exercise:exchangeExercise') || 'Exchange Exercise'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Exercise */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">{t('exercise:currentExercise') || 'Current Exercise'}:</h3>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Dumbbell className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{currentExercise.name}</span>
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {currentExercise.muscle_groups?.map((group, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                placeholder={t('exercise:searchAlternatives') || 'Search for alternatives...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Alternatives */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t('exercise:alternatives') || 'Alternatives'}:</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{t('exercise:searchingAlternatives') || 'Searching for alternatives...'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alternatives.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('exercise:noAlternativesFound') || 'No alternatives found. Try searching.'}
                  </p>
                ) : (
                  alternatives.map((exercise: any) => (
                    <div key={exercise.id} className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <div className={`flex gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {exercise.muscle_groups?.map((group: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleExchange(exercise)}>
                          {t('exercise:select') || 'Select'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseExchangeDialog;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Target, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExchange: (newExercise: any) => void;
}

const ALTERNATIVE_EXERCISES = [
  {
    id: '1',
    name: 'Push-ups',
    sets: 3,
    reps: '12-15',
    duration: 30,
    muscle_groups: ['Chest', 'Triceps', 'Shoulders'],
    difficulty: 'Beginner',
    equipment: 'None'
  },
  {
    id: '2',
    name: 'Dumbbell Press',
    sets: 3,
    reps: '10-12',
    duration: 45,
    muscle_groups: ['Chest', 'Triceps', 'Shoulders'],
    difficulty: 'Intermediate',
    equipment: 'Dumbbells'
  },
  {
    id: '3',
    name: 'Chest Dips',
    sets: 3,
    reps: '8-12',
    duration: 40,
    muscle_groups: ['Chest', 'Triceps'],
    difficulty: 'Intermediate',
    equipment: 'Dip Bars'
  }
];

const ExerciseExchangeDialog = ({ open, onOpenChange, onExchange }: ExerciseExchangeDialogProps) => {
  const { t, isRTL } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const filteredExercises = ALTERNATIVE_EXERCISES.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscle_groups.some(group => 
      group.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleExchange = () => {
    if (selectedExercise) {
      onExchange(selectedExercise);
      onOpenChange(false);
      setSelectedExercise(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <RotateCcw className="w-5 h-5 text-blue-500" />
            {t('exercise:exchangeExercise') || 'Exchange Exercise'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('exercise:selectAlternative') || 'Select an alternative exercise that targets similar muscle groups'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder={t('exercise:searchExercises') || 'Search exercises...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {filteredExercises.map((exercise) => (
              <Card 
                key={exercise.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedExercise?.id === exercise.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <CardContent className="p-4">
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge variant="outline" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Target className="w-3 h-3" />
                          {exercise.sets} × {exercise.reps}
                        </Badge>
                        <Badge variant="outline" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="w-3 h-3" />
                          {exercise.duration}s
                        </Badge>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <div className={`flex flex-wrap gap-1 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {exercise.muscle_groups.map((group, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('exercise:equipment') || 'Equipment'}: {exercise.equipment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {t('exercise:noExercisesFound') || 'No exercises found. Try a different search term.'}
              </p>
            </div>
          )}

          <div className={`flex gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t('common:cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleExchange} 
              disabled={!selectedExercise}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {t('exercise:confirmExchange') || 'Confirm Exchange'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseExchangeDialog;

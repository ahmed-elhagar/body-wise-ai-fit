import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Youtube, Timer, Edit2, RefreshCw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';
import { ExerciseEditForm } from './ExerciseEditForm';

interface ExerciseCardEnhancedProps {
  exercise: Exercise;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const ExerciseCardEnhanced = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExerciseCardEnhancedProps) => {
  const { t, isRTL } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    sets: exercise.actual_sets || exercise.sets || 0,
    reps: exercise.actual_reps || exercise.reps || '',
    notes: exercise.notes || ''
  });

  const handleComplete = () => {
    onExerciseComplete(exercise.id);
  };

  const handleSaveEdit = () => {
    onExerciseProgressUpdate(exercise.id, editData.sets, editData.reps, editData.notes);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      sets: exercise.actual_sets || exercise.sets || 0,
      reps: exercise.actual_reps || exercise.reps || '',
      notes: exercise.notes || ''
    });
  };

  return (
    <Card className={`transition-all duration-200 ${
      exercise.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-6">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium">
                {index + 1}
              </Badge>
              <h3 className="font-bold text-lg text-gray-900">{exercise.name}</h3>
            </div>
            
            <div className={`flex items-center gap-6 text-sm text-gray-600 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-medium">{exercise.sets || 0}</span>
                <span>{t('exercise:sets') || 'sets'}</span>
              </div>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-medium">{exercise.reps}</span>
                <span>{t('exercise:reps') || 'reps'}</span>
              </div>
              {exercise.rest_seconds && (
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Timer className="w-3 h-3" />
                  <span>{exercise.rest_seconds}s {t('exercise:rest') || 'rest'}</span>
                </div>
              )}
            </div>

            {exercise.instructions && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{exercise.instructions}</p>
            )}

            {exercise.notes && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-700">{exercise.notes}</p>
              </div>
            )}
          </div>
          
          <div className={`flex flex-col gap-2 ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
            {exercise.completed ? (
              <Badge className="bg-green-100 text-green-800 justify-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('exercise:completed') || 'Completed'}
              </Badge>
            ) : (
              <>
                <Button size="sm" onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {t('exercise:complete') || 'Complete'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
              </>
            )}
            
            <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" size="sm" className="p-2">
                <Youtube className="w-3 h-3 text-red-600" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <RefreshCw className="w-3 h-3 text-orange-600" />
              </Button>
            </div>
          </div>
        </div>

        {isEditing && (
          <ExerciseEditForm
            editData={editData}
            setEditData={setEditData}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCardEnhanced;

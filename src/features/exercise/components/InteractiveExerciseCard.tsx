
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  Target,
  Edit
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface InteractiveExerciseCardProps {
  exercise: any;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive: boolean;
}

export const InteractiveExerciseCard = ({ 
  exercise, 
  onExerciseComplete, 
  onExerciseProgressUpdate, 
  isActive 
}: InteractiveExerciseCardProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(isActive);
  const [sets, setSets] = useState(exercise.actual_sets || exercise.sets || 0);
  const [reps, setReps] = useState(exercise.actual_reps || exercise.reps || '');
  const [notes, setNotes] = useState(exercise.notes || '');
  const [weight, setWeight] = useState(exercise.weight || 0);

  const handleComplete = async () => {
    await onExerciseComplete(exercise.id);
  };

  const handleUpdateProgress = async () => {
    await onExerciseProgressUpdate(exercise.id, sets, reps, notes, weight);
  };

  return (
    <Card className={`p-4 ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${exercise.completed ? 'bg-green-50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            exercise.completed ? 'bg-green-500' : 'bg-gray-200'
          }`}>
            {exercise.completed ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {exercise.order_number || 1}
              </span>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{exercise.name}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-3 h-3" />
              <span>{exercise.sets}x{exercise.reps}</span>
              {exercise.rest_seconds && (
                <>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{exercise.rest_seconds}s rest</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exercise.muscle_groups?.map((group: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {group}
            </Badge>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4 pt-4 border-t">
          {exercise.instructions && (
            <p className="text-sm text-gray-600">{exercise.instructions}</p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700">Reps</label>
              <input
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdateProgress}
            >
              {t('Update Progress')}
            </Button>
            
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={exercise.completed}
              className={exercise.completed ? 'bg-green-500' : ''}
            >
              {exercise.completed ? t('Completed') : t('Mark Complete')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

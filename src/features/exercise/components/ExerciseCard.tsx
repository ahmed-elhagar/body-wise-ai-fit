
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Timer,
  Dumbbell,
  Target
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onTrackProgress: (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) => Promise<void>;
  onExchange: (exerciseId: string, reason: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onComplete,
  onTrackProgress,
  onExchange
}) => {
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [sets, setSets] = useState(exercise.sets || 3);
  const [reps, setReps] = useState(exercise.reps || '10');
  const [weight, setWeight] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackProgress = async () => {
    setIsTracking(true);
    try {
      await onTrackProgress(exercise.id, sets, reps, weight || undefined, notes || undefined);
      setShowProgressForm(false);
      setSets(exercise.sets || 3);
      setReps(exercise.reps || '10');
      setWeight(0);
      setNotes('');
    } catch (error) {
      console.error('Error tracking progress:', error);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <Card className={`transition-all ${exercise.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-indigo-600" />
              {exercise.name}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {exercise.sets} sets
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                {exercise.reps} reps
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {exercise.rest_seconds}s rest
              </Badge>
            </div>
          </div>
          {exercise.completed && (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {exercise.instructions && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {exercise.instructions}
          </p>
        )}

        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exercise.muscle_groups.map((group, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        )}

        {!exercise.completed && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              onClick={() => onComplete(exercise.id)}
              className="flex-1"
              variant="default"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>
            
            <Button
              onClick={() => setShowProgressForm(!showProgressForm)}
              variant="outline"
              size="sm"
            >
              Track Progress
            </Button>
            
            <Button
              onClick={() => onExchange(exercise.id, 'User requested alternative')}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showProgressForm && !exercise.completed && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border-t">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Sets</label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Reps</label>
                <Input
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Weight (kg)</label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="0"
                  step="0.5"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it feel? Any observations..."
                className="mt-1"
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleTrackProgress}
                disabled={isTracking}
                className="flex-1"
                size="sm"
              >
                {isTracking ? 'Saving...' : 'Save Progress'}
              </Button>
              <Button
                onClick={() => setShowProgressForm(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;

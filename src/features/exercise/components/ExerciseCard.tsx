
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  RotateCcw, 
  ExternalLink,
  Dumbbell,
  Target
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string, completed: boolean) => void;
  onTrackProgress: (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) => void;
  onExchange: (exerciseId: string, reason: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onComplete,
  onTrackProgress,
  onExchange
}) => {
  const [showProgress, setShowProgress] = useState(false);
  const [sets, setSets] = useState(exercise.actual_sets || 0);
  const [reps, setReps] = useState(exercise.actual_reps || '');
  const [weight, setWeight] = useState(0);
  const [notes, setNotes] = useState(exercise.notes || '');

  const handleTrackProgress = () => {
    onTrackProgress(exercise.id, sets, reps, weight, notes);
    setShowProgress(false);
  };

  const handleExchange = () => {
    const reason = prompt('Why would you like to exchange this exercise?');
    if (reason) {
      onExchange(exercise.id, reason);
    }
  };

  const openYouTubeSearch = () => {
    const searchQuery = exercise.youtube_search_term || exercise.name;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <Card className={`transition-all duration-200 ${
      exercise.completed 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
        : 'bg-white hover:shadow-md border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Exercise Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {exercise.muscle_groups?.map((group, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
            {exercise.completed && (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">{exercise.sets}</div>
              <div className="text-gray-600">Sets</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{exercise.reps}</div>
              <div className="text-gray-600">Reps</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{exercise.rest_seconds}s</div>
              <div className="text-gray-600">Rest</div>
            </div>
          </div>

          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* Equipment & Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">
                {exercise.equipment}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {exercise.difficulty}
            </Badge>
          </div>

          {/* Progress Tracking */}
          {showProgress && !exercise.completed && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-blue-900">Track Your Progress</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-blue-800 block mb-1">Sets</label>
                  <Input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-800 block mb-1">Reps</label>
                  <Input
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="e.g., 10, 8-12"
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-blue-800 block mb-1">Weight (kg)</label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-sm text-blue-800 block mb-1">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it feel? Any adjustments?"
                  className="h-16 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleTrackProgress} className="flex-1">
                  Save Progress
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowProgress(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!exercise.completed ? (
              <>
                <Button
                  onClick={() => onComplete(exercise.id, true)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowProgress(!showProgress)}
                  className="flex-1"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Track
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onComplete(exercise.id, false)}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Mark Incomplete
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={openYouTubeSearch}
              className="px-3"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExchange}
              className="px-3"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;

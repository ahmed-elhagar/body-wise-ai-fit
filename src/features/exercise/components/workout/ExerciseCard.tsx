import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Circle,
  Clock,
  Settings,
  Play,
  Timer
} from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  revolutionMode?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  revolutionMode = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actualSets, setActualSets] = useState(exercise.actual_sets || exercise.sets || 0);
  const [actualReps, setActualReps] = useState(exercise.actual_reps || exercise.reps || '');
  const [notes, setNotes] = useState(exercise.notes || '');

  const handleComplete = () => {
    onComplete(exercise.id);
  };

  const handleProgressUpdate = async () => {
    try {
      await onProgressUpdate(exercise.id, actualSets, actualReps, notes);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${
      revolutionMode ? 'bg-gradient-to-r from-gray-50 to-white border-gray-200' : ''
    } hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleComplete}
            className={`mt-1 transition-colors ${
              exercise.completed
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            {exercise.completed ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className={`font-medium ${
                exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {exercise.name}
              </h4>
              {exercise.difficulty && (
                <Badge variant={
                  exercise.difficulty === 'Beginner' ? 'secondary' :
                  exercise.difficulty === 'Intermediate' ? 'default' : 'destructive'
                }>
                  {exercise.difficulty}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span>{exercise.sets} sets × {exercise.reps} reps</span>
              {exercise.equipment && <span>{exercise.equipment}</span>}
              {exercise.rest_seconds && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor(exercise.rest_seconds / 60)} min rest
                </span>
              )}
            </div>

            {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {exercise.muscle_groups.map((muscle, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            )}

            {exercise.instructions && (
              <p className="text-sm text-gray-600 mt-2">
                {exercise.instructions}
              </p>
            )}

            {isExpanded && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-3">Log Your Progress</h5>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sets Completed
                    </label>
                    <input
                      type="number"
                      value={actualSets}
                      onChange={(e) => setActualSets(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reps Completed
                    </label>
                    <input
                      type="text"
                      value={actualReps}
                      onChange={(e) => setActualReps(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g., 10, 8-10, 12"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    rows={2}
                    placeholder="How did it feel? Any adjustments needed?"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleProgressUpdate} size="sm">
                    Save Progress
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsExpanded(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 
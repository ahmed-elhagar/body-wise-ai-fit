import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Timer, 
  Dumbbell, 
  Target,
  X
} from "lucide-react";
import { Exercise } from "@/types/exercise";

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onProgressUpdate: (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => void;
  onDeactivate: () => void;
}

const ActiveExerciseTracker = ({ exercise, onComplete, onProgressUpdate, onDeactivate }: ActiveExerciseTrackerProps) => {
  const [currentSets, setCurrentSets] = useState(0);
  const [currentReps, setCurrentReps] = useState<string>('0');
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(exercise.weight);
  const [notes, setNotes] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isResting) {
      setRestTimer(exercise.rest_seconds || 60);
      intervalId = setInterval(() => {
        setRestTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalId);
            setIsResting(false);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
      setRestTimer(0);
    }

    return () => clearInterval(intervalId);
  }, [isResting, exercise.rest_seconds]);

  const toggleRest = () => {
    setIsResting(!isResting);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleRepsChange = (value: string) => {
    setCurrentReps(value);
  };

  const handleProgressUpdate = async () => {
    if (currentSets > 0) {
      await onProgressUpdate(
        exercise.id, 
        currentSets, 
        currentReps, // Already a string
        notes || undefined, 
        currentWeight || undefined
      );
    }
  };
  
  return (
    <Card className="border-2 border-blue-500 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            {exercise.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeactivate}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{exercise.sets} sets</Badge>
          <Badge variant="outline">{exercise.reps} reps</Badge>
          {exercise.weight && <Badge variant="outline">{exercise.weight}kg</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress tracking UI */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Sets Completed</Label>
            <Input
              type="number"
              value={currentSets}
              onChange={(e) => setCurrentSets(Number(e.target.value))}
              min={0}
              max={exercise.sets}
            />
          </div>
          <div>
            <Label>Reps</Label>
            <Input
              value={currentReps}
              onChange={(e) => handleRepsChange(e.target.value)}
            />
          </div>
        </div>

        {exercise.weight && (
          <div>
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              value={currentWeight || ''}
              onChange={(e) => setCurrentWeight(Number(e.target.value) || undefined)}
            />
          </div>
        )}

        <div>
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your performance..."
            rows={2}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleProgressUpdate} className="flex-1">
            Update Progress
          </Button>
          <Button 
            onClick={() => onComplete(exercise.id)} 
            variant="outline"
            className="flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveExerciseTracker;

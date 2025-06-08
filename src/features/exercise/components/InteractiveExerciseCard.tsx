
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Target, 
  Dumbbell,
  Timer,
  Zap,
  Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseActionsDropdown } from "./ExerciseActionsDropdown";

interface InteractiveExerciseCardProps {
  exercise: any;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const InteractiveExerciseCard = ({ 
  exercise, 
  index, 
  onExerciseComplete,
  onExerciseProgressUpdate 
}: InteractiveExerciseCardProps) => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const handleSetComplete = () => {
    if (currentSet < (exercise.sets || 3)) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimer(exercise.rest_seconds || 60);
      
      // Start rest countdown
      const interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Exercise complete
      onExerciseComplete(exercise.id);
      setIsActive(false);
    }
  };

  const handleStartExercise = () => {
    setIsActive(true);
    setCurrentSet(1);
  };

  const progressPercentage = exercise.completed ? 100 : 
    isActive ? (currentSet / (exercise.sets || 3)) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      exercise.completed 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
        : isActive 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-1 ring-blue-200' 
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
    }`}>
      <div className="flex items-start gap-4">
        {/* Exercise Icon & Number */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
          exercise.completed 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : isActive 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
        }`}>
          {exercise.completed ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <span className="text-white font-bold text-lg">{index + 1}</span>
          )}
        </div>

        {/* Exercise Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                {exercise.name}
              </h4>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">{exercise.sets || 3} × {exercise.reps || '10'}</span>
                </div>
                
                {exercise.rest_seconds && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{exercise.rest_seconds}s rest</span>
                  </div>
                )}
                
                {exercise.muscle_groups?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span className="truncate">{exercise.muscle_groups[0]}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              {!exercise.completed && !isActive && (
                <Button
                  onClick={handleStartExercise}
                  size="sm"
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              )}
              
              {exercise.completed && (
                <Badge className="bg-green-500 text-white px-3 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}

              <ExerciseActionsDropdown 
                exercise={exercise}
                size="sm"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-500 font-medium">Progress</span>
              <span className="font-semibold text-gray-700">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Active Exercise State */}
          {isActive && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold text-blue-900">
                    Set {currentSet}/{exercise.sets || 3}
                  </span>
                  {isResting && (
                    <div className="text-orange-600 font-mono text-lg font-bold mt-1">
                      Rest: {formatTime(restTimer)}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleSetComplete}
                  disabled={isResting}
                  size="sm"
                  className={`h-8 px-3 text-xs font-medium ${
                    isResting 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : currentSet >= (exercise.sets || 3)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isResting ? (
                    <>
                      <Timer className="w-3 h-3 mr-1" />
                      Resting...
                    </>
                  ) : currentSet >= (exercise.sets || 3) ? (
                    <>
                      <Award className="w-3 h-3 mr-1" />
                      Finish
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete Set
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InteractiveExerciseCard;

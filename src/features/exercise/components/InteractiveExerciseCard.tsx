
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Target, 
  Dumbbell,
  MoreHorizontal,
  Timer,
  Zap,
  Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <Card className={`p-3 transition-all duration-300 ${
      exercise.completed 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
        : isActive 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-center gap-3">
        {/* Exercise Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          exercise.completed 
            ? 'bg-green-500' 
            : isActive 
            ? 'bg-blue-500' 
            : 'bg-gray-400'
        }`}>
          {exercise.completed ? (
            <CheckCircle2 className="w-5 h-5 text-white" />
          ) : (
            <Dumbbell className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Exercise Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {exercise.name}
            </h4>
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>{exercise.sets || 3} × {exercise.reps || '10'}</span>
            </div>
            
            {exercise.rest_seconds && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{exercise.rest_seconds}s rest</span>
              </div>
            )}
            
            {exercise.muscle_groups?.length > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{exercise.muscle_groups[0]}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>

          {/* Active Exercise State */}
          {isActive && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-blue-900">
                    Set {currentSet}/{exercise.sets || 3}
                  </span>
                  {isResting && (
                    <div className="text-orange-600 font-mono">
                      Rest: {formatTime(restTimer)}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleSetComplete}
                  disabled={isResting}
                  size="sm"
                  className="h-7 text-xs"
                >
                  {isResting ? (
                    <>
                      <Timer className="w-3 h-3 mr-1" />
                      Rest
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

        {/* Action Button */}
        <div className="flex flex-col gap-1">
          {!exercise.completed && !isActive && (
            <Button
              onClick={handleStartExercise}
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
          )}
          
          {exercise.completed && (
            <Badge className="bg-green-500 text-white text-xs">
              Complete
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveExerciseCard;

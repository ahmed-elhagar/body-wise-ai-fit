
import { useState, useEffect } from 'react';
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
  Award,
  SkipForward,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseActionsDropdown } from "./ExerciseActionsDropdown";
import { toast } from "@/hooks/use-toast";

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
  const [currentSet, setCurrentSet] = useState(0); // Start from 0, not 1
  const [completedSets, setCompletedSets] = useState(0); // Track completed sets
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (restInterval) {
        clearInterval(restInterval);
      }
    };
  }, [restInterval]);

  const startRestTimer = () => {
    setIsResting(true);
    setRestTimer(exercise.rest_seconds || 60);
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          setRestInterval(null);
          toast({
            title: "Rest Complete! 💪",
            description: "Time for your next set!",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setRestInterval(interval);
  };

  const skipRest = () => {
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setIsResting(false);
    setRestTimer(0);
    toast({
      title: "Rest Skipped ⚡",
      description: "Let's continue with the next set!",
    });
  };

  const handleSetComplete = async () => {
    const totalSets = exercise.sets || 3;
    const newCompletedSets = completedSets + 1;
    
    setCompletedSets(newCompletedSets);
    
    // Update progress
    onExerciseProgressUpdate(exercise.id, newCompletedSets, exercise.reps || '10');
    
    if (newCompletedSets < totalSets) {
      setCurrentSet(newCompletedSets);
      if (exercise.rest_seconds > 0) {
        startRestTimer();
      }
      
      toast({
        title: `Set ${newCompletedSets} Complete! 🎯`,
        description: `${totalSets - newCompletedSets} sets remaining`,
      });
    } else {
      // Exercise complete - show loading state
      setIsCompleting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        onExerciseComplete(exercise.id);
        setIsActive(false);
        setCurrentSet(0);
        setCompletedSets(0);
        
        toast({
          title: "Exercise Complete! 🏆",
          description: `Great job completing ${exercise.name}!`,
        });
      } catch (error) {
        console.error('Error completing exercise:', error);
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const handleStartExercise = () => {
    setIsActive(true);
    setCurrentSet(0); // Start at 0, ready for first set
    setCompletedSets(0);
    toast({
      title: "Exercise Started! 💪",
      description: `Let's crush ${exercise.name}!`,
    });
  };

  // Calculate progress based on completed sets only
  const progressPercentage = exercise.completed ? 100 : 
    (completedSets / (exercise.sets || 3)) * 100;

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
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-4">
        {/* Exercise Icon & Number */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
          exercise.completed 
            ? 'bg-gradient-to-br from-green-500 to-green-600' 
            : isActive 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-gray-400 to-gray-500'
        }`}>
          {isCompleting ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : exercise.completed ? (
            <CheckCircle2 className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white font-bold text-sm">{index + 1}</span>
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
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Play className="w-3 h-3 mr-1" />
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
          {isActive && !exercise.completed && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold text-blue-900">
                    Set {completedSets + 1}/{exercise.sets || 3}
                  </span>
                  {isResting && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-orange-600 font-mono text-lg font-bold">
                        Rest: {formatTime(restTimer)}
                      </div>
                      <Button
                        onClick={skipRest}
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <SkipForward className="w-3 h-3 mr-1" />
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleSetComplete}
                  disabled={isResting || isCompleting}
                  size="sm"
                  className={`h-8 px-3 text-xs font-medium ${
                    isResting 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : completedSets >= (exercise.sets || 3) - 1
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Completing...
                    </>
                  ) : isResting ? (
                    <>
                      <Timer className="w-3 h-3 mr-1" />
                      Resting...
                    </>
                  ) : completedSets >= (exercise.sets || 3) - 1 ? (
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


import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Play, Clock, Dumbbell, Target, Youtube, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseExchangeDialog } from "./ExerciseExchangeDialog";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);

  const handleSetComplete = () => {
    if (currentSet < (exercise.sets || 3)) {
      setCurrentSet(prev => prev + 1);
      onExerciseProgressUpdate(exercise.id, currentSet, exercise.reps || "10");
    } else {
      onExerciseComplete(exercise.id);
      setIsActive(false);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentSet(1);
  };

  const progressPercentage = exercise.sets ? (currentSet / exercise.sets) * 100 : 0;

  return (
    <>
      <Card className={`
        relative overflow-hidden transition-all duration-500 ease-out
        ${exercise.completed 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md' 
          : isActive 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg scale-[1.02]'
          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}>
        {/* Progress Bar */}
        {isActive && !exercise.completed && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {/* Exercise Number & Status */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300
                ${exercise.completed 
                  ? 'bg-green-500 text-white' 
                  : isActive 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {exercise.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Exercise Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {exercise.name}
                </h3>
                
                {/* Exercise Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {exercise.sets && (
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      <Target className="w-3 h-3 mr-1" />
                      {exercise.sets} sets
                    </Badge>
                  )}
                  
                  {exercise.reps && (
                    <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      <Dumbbell className="w-3 h-3 mr-1" />
                      {exercise.reps} reps
                    </Badge>
                  )}
                  
                  {exercise.rest_seconds && (
                    <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {exercise.rest_seconds}s rest
                    </Badge>
                  )}

                  {exercise.equipment && (
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
                      {exercise.equipment}
                    </Badge>
                  )}
                </div>

                {/* Muscle Groups */}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscle_groups.map((muscle: string, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                        {muscle}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-2">
              {!exercise.completed && !isActive && (
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}

              {isActive && !exercise.completed && (
                <Button
                  onClick={handleSetComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Set {currentSet} Done
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Less' : 'More'}
              </Button>
            </div>
          </div>

          {/* Active Exercise Progress */}
          {isActive && !exercise.completed && (
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Current Set: {currentSet} / {exercise.sets || 3}
                </span>
                <span className="text-sm text-blue-600">
                  {exercise.reps} reps
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-blue-100" />
              <p className="text-xs text-blue-600 mt-2">
                Complete this set and click "Set {currentSet} Done" when finished
              </p>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {/* Instructions */}
              {exercise.instructions && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Instructions
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{exercise.instructions}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Video Tutorial */}
                {exercise.youtube_search_term && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100 flex-1"
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search_term)}`, '_blank')}
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                )}

                {/* Exchange Exercise */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 flex-1"
                  onClick={() => setShowExchangeDialog(true)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Exchange Exercise
                </Button>
              </div>
            </div>
          )}

          {/* Completion Status */}
          {exercise.completed && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Exercise Completed!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Great job! You've finished this exercise.
              </p>
            </div>
          )}
        </div>
      </Card>

      <ExerciseExchangeDialog
        exercise={exercise}
        open={showExchangeDialog}
        onOpenChange={setShowExchangeDialog}
      />
    </>
  );
};


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, Square, RotateCcw, Share2 } from "lucide-react";
import { AnimatedProgressRing } from "./index";

interface WorkoutHeaderProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
  totalTime: string;
  isActive: boolean;
  isPaused: boolean;
  estimatedCalories: number;
  workoutIntensity: string;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  shareProgress: () => void;
}

export const WorkoutHeader = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay,
  totalTime,
  isActive,
  isPaused,
  estimatedCalories,
  workoutIntensity,
  startSession,
  pauseSession,
  resumeSession,
  resetSession,
  shareProgress
}: WorkoutHeaderProps) => {
  return (
    <Card className="p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-shrink-0 flex justify-center lg:justify-start">
          <div className="scale-50 -m-6">
            <AnimatedProgressRing
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isToday={isToday}
              isRestDay={isRestDay}
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 font-mono">{totalTime}</div>
                <div className="text-xs text-gray-500">{isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}</div>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <div className="text-center">
                <div className="text-sm font-bold text-green-600">{completedExercises}</div>
                <div className="text-xs text-gray-600">Done</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-orange-600">{estimatedCalories}</div>
                <div className="text-xs text-gray-600">Cal</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-purple-600">{workoutIntensity}</div>
                <div className="text-xs text-gray-600">Level</div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5 bg-gray-200" />
          </div>

          <div className="flex gap-1">
            {!isActive ? (
              <Button onClick={startSession} size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1 h-8 text-xs">
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={pauseSession} variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50 flex-1 h-8 text-xs">
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={resumeSession} size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1 h-8 text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Resume
                  </Button>
                )}
                <Button onClick={resetSession} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 h-8 px-2">
                  <Square className="w-3 h-3" />
                </Button>
              </>
            )}
            
            <Button onClick={resetSession} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 px-2">
              <RotateCcw className="w-3 h-3" />
            </Button>

            {progressPercentage === 100 && (
              <Button onClick={shareProgress} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 px-2">
                <Share2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};


import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { AnimatedProgressRing } from "./AnimatedProgressRing";

interface CompactProgressSidebarProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
  currentProgram: any;
  selectedDayNumber: number;
}

export const CompactProgressSidebar = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay,
  currentProgram,
  selectedDayNumber
}: CompactProgressSidebarProps) => {
  const weekProgress = currentProgram?.daily_workouts_count || 7;
  const programDuration = Math.ceil((new Date().getTime() - new Date(currentProgram?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Combined Progress Card */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <div className="text-center space-y-4">
          {/* Progress Ring */}
          <AnimatedProgressRing
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            isToday={isToday}
            isRestDay={isRestDay}
          />
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{completedExercises}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{totalExercises}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Program Overview */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Program Overview
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-600">Week Progress</span>
            <Badge variant="outline" className="bg-purple-100 border-purple-200 text-purple-700">
              Day {selectedDayNumber}/{weekProgress}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-600">Program Duration</span>
            <span className="text-sm font-semibold text-purple-800">{programDuration} days</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-600">Type</span>
            <Badge className="bg-purple-500 text-white text-xs">
              {currentProgram?.workout_type === 'gym' ? '🏋️ Gym' : '🏠 Home'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Motivation Card */}
      {!isRestDay && (
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center space-y-2">
            <div className="text-2xl">
              {progressPercentage === 100 ? '🎉' : 
               progressPercentage > 75 ? '💪' : 
               progressPercentage > 50 ? '🔥' : 
               progressPercentage > 0 ? '⚡' : '🎯'}
            </div>
            <h4 className="font-semibold text-green-800">
              {progressPercentage === 100 ? 'Workout Complete!' : 
               progressPercentage > 75 ? 'Almost There!' : 
               progressPercentage > 50 ? 'Halfway Done!' : 
               progressPercentage > 0 ? 'Keep Going!' : 'Ready to Start!'}
            </h4>
            <p className="text-sm text-green-600 leading-relaxed">
              {progressPercentage === 100 ? 'Amazing work! You crushed today\'s workout.' : 
               progressPercentage > 50 ? 'You\'re doing great! Push through to the finish.' : 
               'Every rep brings you closer to your goals.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

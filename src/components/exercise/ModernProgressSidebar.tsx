
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, Coffee, TrendingUp, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModernProgressSidebarProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
  currentProgram: any;
  selectedDayNumber: number;
}

export const ModernProgressSidebar = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay,
  currentProgram,
  selectedDayNumber
}: ModernProgressSidebarProps) => {
  const { t } = useLanguage();
  
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayName = dayNames[selectedDayNumber - 1];

  const getMotivationMessage = () => {
    if (isRestDay) return "Recovery Day 💤";
    if (progressPercentage === 100) return "Excellent Work! 🎉";
    if (progressPercentage >= 75) return "Almost There! 💪";
    if (progressPercentage >= 50) return "Keep Going! 🔥";
    if (progressPercentage > 0) return "Great Start! ⚡";
    return "Ready to Begin! 🚀";
  };

  const getProgressColor = () => {
    if (progressPercentage === 100) return "from-green-500 to-emerald-500";
    if (progressPercentage >= 75) return "from-blue-500 to-indigo-500";
    if (progressPercentage >= 50) return "from-yellow-500 to-orange-500";
    if (progressPercentage > 0) return "from-purple-500 to-pink-500";
    return "from-gray-400 to-gray-500";
  };

  if (isRestDay) {
    return (
      <div className="sticky top-6 space-y-6">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-orange-800 mb-2">
                Rest Day
              </h3>
              <p className="text-orange-600 text-sm leading-relaxed">
                Take time to recover and prepare for tomorrow's workout
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-700 font-medium">Recovery Mode</span>
                <Badge className="bg-orange-500 text-white border-0">Active</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Rest Day Activities */}
        <Card className="p-6 bg-white shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Suggested Activities
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🧘</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Light Stretching</p>
                <p className="text-xs text-blue-600">10-15 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🚶</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Light Walk</p>
                <p className="text-xs text-green-600">20-30 minutes</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="sticky top-6 space-y-6">
      {/* Progress Card */}
      <Card className="p-6 bg-white shadow-lg border-0">
        <div className="text-center space-y-6">
          {/* Circular Progress */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                    <stop offset="100%" className="text-indigo-500" stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Message */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {getMotivationMessage()}
            </h3>
            <p className="text-sm text-gray-600">
              {isToday ? "Today's Progress" : `${currentDayName}'s Workout`}
            </p>
          </div>

          {/* Exercise Count */}
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{completedExercises}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalExercises}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{completedExercises} / {totalExercises}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Stats Card */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200 shadow-lg">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Quick Stats
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">Week</span>
            </div>
            <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
              {currentProgram?.current_week || 1}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-gray-700">Level</span>
            </div>
            <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700">
              {currentProgram?.difficulty_level || 'Intermediate'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-700">Type</span>
            </div>
            <Badge variant="outline" className="bg-white border-yellow-200 text-yellow-700">
              {currentProgram?.workout_type === 'gym' ? 'Gym' : 'Home'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Motivation Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-1">
              {progressPercentage === 100 ? 'Mission Complete!' : 
               progressPercentage > 50 ? 'You\'re Crushing It!' : 
               progressPercentage > 0 ? 'Keep the Momentum!' : 'Time to Start Strong!'}
            </h4>
            <p className="text-sm text-purple-600">
              {progressPercentage === 100 ? 'Perfect execution today!' : 
               'Every rep brings you closer to your goals'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

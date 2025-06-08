
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactProgressSidebarProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  isRestDay: boolean;
  estimatedDuration?: number;
  currentProgram?: any;
}

export const CompactProgressSidebar = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  isRestDay,
  estimatedDuration = 45,
  currentProgram
}: CompactProgressSidebarProps) => {
  const { t } = useLanguage();

  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-900 mb-1">Rest Day</h3>
          <p className="text-sm text-blue-700">Recovery time</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card className="p-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 relative mx-auto mb-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-green-500"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progressPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-gray-600">
              {completedExercises} of {totalExercises} completed
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Today's Goal
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="font-medium">{estimatedDuration}min</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Type</span>
            <span className="font-medium">
              {currentProgram?.workout_type === 'gym' ? '🏋️ Gym' : '🏠 Home'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Difficulty</span>
            <span className="font-medium">{currentProgram?.difficulty_level || 'Intermediate'}</span>
          </div>
        </div>
      </Card>

      {/* Motivation Card */}
      {progressPercentage > 0 && (
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900 mb-1">
              {progressPercentage === 100 ? 'Completed!' : 'Keep Going!'}
            </h3>
            <p className="text-sm text-green-700">
              {progressPercentage === 100 
                ? 'Great job finishing your workout!' 
                : 'Every rep counts towards your goals'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompactProgressSidebar;


import { Card } from "@/components/ui/card";
import { Trophy, Target, Zap, Heart } from "lucide-react";

interface ExerciseMotivationCardProps {
  completedExercises: number;
  totalExercises: number;
  isRestDay?: boolean;
}

export const ExerciseMotivationCard = ({
  completedExercises,
  totalExercises,
  isRestDay = false
}: ExerciseMotivationCardProps) => {
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h4 className="font-bold text-orange-800 mb-1">Recovery Day</h4>
            <p className="text-xs text-orange-700">Rest is when muscles grow stronger</p>
          </div>
        </div>
      </Card>
    );
  }

  const getMotivationMessage = () => {
    if (progressPercentage === 100) {
      return { icon: Trophy, message: "Workout Complete!", color: "green" };
    } else if (progressPercentage >= 75) {
      return { icon: Zap, message: "Almost There!", color: "blue" };
    } else if (progressPercentage >= 25) {
      return { icon: Target, message: "Keep Going!", color: "purple" };
    } else {
      return { icon: Target, message: "You Got This!", color: "health" };
    }
  };

  const motivation = getMotivationMessage();
  const Icon = motivation.icon;

  return (
    <Card className={`p-4 bg-gradient-to-br ${
      motivation.color === 'green' ? 'from-green-50 to-emerald-50 border-green-200' :
      motivation.color === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-200' :
      motivation.color === 'purple' ? 'from-purple-50 to-pink-50 border-purple-200' :
      'from-health-soft to-health-primary/10 border-health-border'
    }`}>
      <div className="text-center space-y-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
          motivation.color === 'green' ? 'bg-green-200' :
          motivation.color === 'blue' ? 'bg-blue-200' :
          motivation.color === 'purple' ? 'bg-purple-200' :
          'bg-health-primary/20'
        }`}>
          <Icon className={`w-6 h-6 ${
            motivation.color === 'green' ? 'text-green-600' :
            motivation.color === 'blue' ? 'text-blue-600' :
            motivation.color === 'purple' ? 'text-purple-600' :
            'text-health-primary'
          }`} />
        </div>
        
        <div>
          <h4 className={`font-bold mb-1 ${
            motivation.color === 'green' ? 'text-green-800' :
            motivation.color === 'blue' ? 'text-blue-800' :
            motivation.color === 'purple' ? 'text-purple-800' :
            'text-health-primary'
          }`}>
            {motivation.message}
          </h4>
          <p className="text-xs text-gray-600">
            {progressPercentage === 100 
              ? "🎉 Great job today!" 
              : `${Math.round(progressPercentage)}% complete`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{completedExercises}</div>
            <div className="text-xs text-gray-600">Done</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{totalExercises - completedExercises}</div>
            <div className="text-xs text-gray-600">Left</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

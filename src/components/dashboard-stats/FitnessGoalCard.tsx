
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

interface FitnessGoalCardProps {
  fitnessGoal?: string;
}

export const FitnessGoalCard = ({ fitnessGoal }: FitnessGoalCardProps) => {
  const getGoalBadgeColor = (goal?: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-red-500';
      case 'weight_gain': return 'bg-green-500';
      case 'muscle_gain': return 'bg-blue-500';
      case 'endurance': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Fitness Goal</p>
          <div className="mt-2">
            {fitnessGoal ? (
              <Badge className={`${getGoalBadgeColor(fitnessGoal)} text-white`}>
                {fitnessGoal.replace('_', ' ').toUpperCase()}
              </Badge>
            ) : (
              <p className="text-sm text-gray-500">Set your goal</p>
            )}
          </div>
        </div>
        <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

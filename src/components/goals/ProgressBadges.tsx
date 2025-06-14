
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const ProgressBadges = () => {
  const { getWeightGoal } = useGoals();
  const { weightEntries } = useWeightTracking();
  
  const weightGoal = getWeightGoal();
  
  if (!weightGoal || weightEntries.length < 2) {
    return null;
  }

  const currentWeight = weightEntries[0]?.weight || 0;
  const lastWeekWeight = weightEntries.find(entry => {
    const entryDate = new Date(entry.recorded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate <= weekAgo;
  })?.weight || currentWeight;

  const weeklyChange = currentWeight - lastWeekWeight;
  const targetWeight = weightGoal.target_value || 0;
  const isLosingWeight = targetWeight < currentWeight;
  
  // Calculate if user is on track (moving 1% toward goal this week)
  const requiredDirection = isLosingWeight ? -1 : 1;
  const actualDirection = weeklyChange >= 0 ? 1 : -1;
  const isMovingTowardGoal = requiredDirection === actualDirection;
  const changePercentage = Math.abs(weeklyChange / currentWeight) * 100;

  const getBadgeStatus = () => {
    if (Math.abs(currentWeight - targetWeight) <= 0.5) {
      return {
        icon: CheckCircle,
        text: "Goal Achieved!",
        className: "bg-green-100 text-green-800 border-green-300"
      };
    }

    if (isMovingTowardGoal && changePercentage >= 1) {
      return {
        icon: TrendingUp,
        text: "On Track",
        className: "bg-green-100 text-green-800 border-green-300"
      };
    }

    if (!isMovingTowardGoal || changePercentage < 0.5) {
      return {
        icon: AlertTriangle,
        text: "At Risk",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300"
      };
    }

    return {
      icon: TrendingUp,
      text: "Making Progress",
      className: "bg-blue-100 text-blue-800 border-blue-300"
    };
  };

  const badgeStatus = getBadgeStatus();
  const Icon = badgeStatus.icon;

  return (
    <Badge className={`flex items-center gap-1 px-3 py-1 ${badgeStatus.className}`}>
      <Icon className="w-4 h-4" />
      {badgeStatus.text}
    </Badge>
  );
};

export default ProgressBadges;

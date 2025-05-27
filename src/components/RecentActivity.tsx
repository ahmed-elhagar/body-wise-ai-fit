
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useExercisePrograms } from "@/hooks/useExercisePrograms";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const { weightEntries } = useWeightTracking();
  const { mealPlans } = useMealPlans();
  const { programs } = useExercisePrograms();

  const activities = [
    ...(weightEntries?.slice(0, 3).map(entry => ({
      type: 'weight',
      title: `Logged weight: ${entry.weight} kg`,
      time: entry.recorded_at,
      badge: 'Weight',
      color: 'bg-blue-500'
    })) || []),
    ...(mealPlans?.slice(0, 2).map(plan => ({
      type: 'meal',
      title: `Created meal plan for week of ${new Date(plan.week_start_date).toLocaleDateString()}`,
      time: plan.created_at,
      badge: 'Nutrition',
      color: 'bg-green-500'
    })) || []),
    ...(programs?.slice(0, 2).map(program => ({
      type: 'exercise',
      title: `Created ${program.program_name} program`,
      time: program.created_at,
      badge: 'Exercise',
      color: 'bg-purple-500'
    })) || [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  if (activities.length === 0) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No activity yet. Start by logging your weight or creating a meal plan!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {activity.badge}
                </Badge>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;

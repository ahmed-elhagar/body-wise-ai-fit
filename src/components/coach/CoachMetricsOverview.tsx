
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  MessageCircle,
  Target,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CoachMetricsOverviewProps {
  trainees: any[];
  className?: string;
}

const CoachMetricsOverview = ({ trainees, className }: CoachMetricsOverviewProps) => {
  const { user } = useAuth();

  // Get coach metrics from database
  const { data: coachMetrics } = useQuery({
    queryKey: ['coach-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get unread messages count
      const { data: unreadMessages } = await supabase
        .from('coach_trainee_messages')
        .select('id')
        .eq('coach_id', user.id)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      // Get recent message activity (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: recentMessages } = await supabase
        .from('coach_trainee_messages')
        .select('id')
        .eq('coach_id', user.id)
        .gte('created_at', yesterday.toISOString());

      // Get goals completion data
      const traineeIds = trainees.map(t => t.trainee_id);
      const { data: completedGoals } = await supabase
        .from('user_goals')
        .select('id')
        .in('user_id', traineeIds)
        .eq('status', 'completed');

      const { data: totalGoals } = await supabase
        .from('user_goals')
        .select('id')
        .in('user_id', traineeIds);

      return {
        unreadMessagesCount: unreadMessages?.length || 0,
        recentMessagesCount: recentMessages?.length || 0,
        completedGoalsCount: completedGoals?.length || 0,
        totalGoalsCount: totalGoals?.length || 0,
      };
    },
    enabled: !!user?.id && trainees.length > 0,
  });

  // Calculate metrics
  const totalTrainees = trainees.length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length;
  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile?.profile_completion_score || 0) >= 80
  ).length;

  const metrics = [
    {
      title: "Total Trainees",
      value: totalTrainees,
      icon: Users,
      description: `${activeTrainees} active`,
      color: "blue",
      trend: totalTrainees > 0 ? `${Math.round((activeTrainees / totalTrainees) * 100)}% active` : null
    },
    {
      title: "Active This Week",
      value: activeTrainees,
      icon: Activity,
      description: `${Math.round((activeTrainees / Math.max(totalTrainees, 1)) * 100)}% engagement`,
      color: "green",
      trend: activeTrainees > 0 ? "Engaged trainees" : null
    },
    {
      title: "Completed Profiles",
      value: completedProfiles,
      icon: Target,
      description: `${Math.round((completedProfiles / Math.max(totalTrainees, 1)) * 100)}% completion rate`,
      color: "purple",
      trend: completedProfiles > 0 ? `${completedProfiles}/${totalTrainees} complete` : null
    },
    {
      title: "Unread Messages",
      value: coachMetrics?.unreadMessagesCount || 0,
      icon: MessageCircle,
      description: `${coachMetrics?.recentMessagesCount || 0} in last 24h`,
      color: "orange",
      trend: coachMetrics?.recentMessagesCount ? "Recent activity" : "No recent messages"
    },
    {
      title: "Goals Completed",
      value: coachMetrics?.completedGoalsCount || 0,
      icon: Award,
      description: `${coachMetrics?.totalGoalsCount || 0} total goals`,
      color: "emerald",
      trend: coachMetrics?.completedGoalsCount && coachMetrics?.totalGoalsCount ? 
        `${Math.round((coachMetrics.completedGoalsCount / coachMetrics.totalGoalsCount) * 100)}% success rate` : 
        "No goals yet"
    },
    {
      title: "Average Progress",
      value: totalTrainees > 0 ? 
        `${Math.round(trainees.reduce((acc, t) => acc + (t.trainee_profile?.profile_completion_score || 0), 0) / totalTrainees)}%` : 
        "0%",
      icon: TrendingUp,
      description: "Profile completion",
      color: "pink",
      trend: "Overall progress"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      green: "bg-green-50 border-green-200 text-green-900",
      purple: "bg-purple-50 border-purple-200 text-purple-900",
      orange: "bg-orange-50 border-orange-200 text-orange-900",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
      pink: "bg-pink-50 border-pink-200 text-pink-900"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      emerald: "text-emerald-600 bg-emerald-100",
      pink: "text-pink-600 bg-pink-100"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {metrics.map((metric, index) => (
        <Card key={index} className={cn("border", getColorClasses(metric.color))}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-2 rounded-lg", getIconColorClasses(metric.color))}>
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {metric.value}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {metric.description}
                </p>
                
                {metric.trend && (
                  <Badge variant="secondary" className="text-xs bg-white/50">
                    {metric.trend}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoachMetricsOverview;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  MessageCircle,
  Target,
  Award,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachMetricsOverviewProps {
  trainees: any[];
  className?: string;
}

const CoachMetricsOverview = ({ trainees, className }: CoachMetricsOverviewProps) => {
  // Calculate metrics
  const totalTrainees = trainees.length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length;
  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile?.profile_completion_score || 0) >= 80
  ).length;
  
  // Mock additional metrics - in real app these would come from backend
  const mockMetrics = {
    totalMessages: Math.floor(Math.random() * 100) + 50,
    avgResponseTime: Math.floor(Math.random() * 60) + 15, // minutes
    weeklyGoalsAchieved: Math.floor(Math.random() * totalTrainees * 0.8),
    satisfactionScore: 85 + Math.floor(Math.random() * 15), // 85-100%
  };

  const metrics = [
    {
      title: "Total Trainees",
      value: totalTrainees,
      icon: Users,
      description: `${activeTrainees} active`,
      color: "blue",
      trend: totalTrainees > 0 ? "+12% this month" : null
    },
    {
      title: "Active This Week",
      value: activeTrainees,
      icon: Activity,
      description: `${Math.round((activeTrainees / Math.max(totalTrainees, 1)) * 100)}% engagement`,
      color: "green",
      trend: activeTrainees > 0 ? "+5% vs last week" : null
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
      title: "Messages Today",
      value: mockMetrics.totalMessages,
      icon: MessageCircle,
      description: `Avg ${mockMetrics.avgResponseTime}min response`,
      color: "orange",
      trend: "↑ 23% vs yesterday"
    },
    {
      title: "Weekly Goals Met",
      value: mockMetrics.weeklyGoalsAchieved,
      icon: Award,
      description: `${Math.round((mockMetrics.weeklyGoalsAchieved / Math.max(totalTrainees, 1)) * 100)}% success rate`,
      color: "emerald",
      trend: "🎯 Above target"
    },
    {
      title: "Satisfaction Score",
      value: `${mockMetrics.satisfactionScore}%`,
      icon: TrendingUp,
      description: "Based on feedback",
      color: "pink",
      trend: "↑ 2% this month"
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Calendar, Zap, Crown, Infinity } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import ProMemberBadge from "@/components/ui/pro-member-badge";

const DashboardStats = () => {
  const { profile } = useProfile();
  const { isProMember } = useSubscription();
  const navigate = useNavigate();

  if (!profile) return null;

  const stats = [
    {
      title: "AI Generations",
      value: isProMember ? "∞" : profile.ai_generations_remaining || 0,
      icon: Zap,
      trend: isProMember ? "Unlimited" : `${profile.ai_generations_remaining || 0} remaining`,
      color: isProMember ? "text-yellow-600" : "text-blue-600",
      bgColor: isProMember ? "bg-yellow-50" : "bg-blue-50",
    },
    {
      title: "Profile Complete",
      value: "85%",
      icon: Target,
      trend: "+15% this week",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Days Active",
      value: "12",
      icon: Calendar,
      trend: "Great streak!",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Progress",
      value: "94%",
      icon: TrendingUp,
      trend: "+8% this month",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {stat.title}
              {stat.title === "AI Generations" && isProMember && (
                <ProMemberBadge variant="compact" className="ml-2" />
              )}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.title === "AI Generations" && isProMember && (
                  <Infinity className="inline w-5 h-5 ml-1 text-yellow-600" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stat.trend}
            </p>
            {stat.title === "AI Generations" && !isProMember && profile.ai_generations_remaining <= 2 && (
              <Button
                size="sm"
                onClick={() => navigate('/pro')}
                className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs"
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Brain, Scale, Target } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import ProMemberBadge from "@/components/ui/pro-member-badge";

interface DashboardStatsProps {
  className?: string;
}

const DashboardStats = () => {
  const { profile } = useProfile();
  const { isProMember } = useSubscription();
  const { tFrom } = useI18n();
  const tDashboard = tFrom('dashboard');

  // Calculate profile completion score
  // const profileCompletionScore = profile ? calculateProfileCompletion(profile) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Profile Completion Card with Pro Badge */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            {String(tDashboard("profileCompletion"))}
          </CardTitle>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            {isProMember && <ProMemberBadge variant="compact" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">
            {profile?.profile_completion_score || 0}%
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${profile?.profile_completion_score || 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Generations Card with Pro Enhancement */}
      <Card className={cn(
        "border-green-200",
        isProMember ? "bg-gradient-to-br from-yellow-50 to-orange-100" : "bg-gradient-to-br from-green-50 to-emerald-100"
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={cn(
            "text-sm font-medium",
            isProMember ? "text-orange-700" : "text-green-700"
          )}>
            {String(tDashboard("aiGenerations"))}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Brain className={cn(
              "h-4 w-4",
              isProMember ? "text-orange-600" : "text-green-600"
            )} />
            {isProMember && <ProMemberBadge variant="compact" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "text-2xl font-bold",
            isProMember ? "text-orange-800" : "text-green-800"
          )}>
            {isProMember ? "∞" : (profile?.ai_generations_remaining || 0)}
          </div>
          <p className={cn(
            "text-xs mt-1",
            isProMember ? "text-orange-600" : "text-green-600"
          )}>
            {isProMember ? "Unlimited AI generations" : `${String(tDashboard("remaining"))}`}
          </p>
        </CardContent>
      </Card>

      {/* Current Weight Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">
            {String(tDashboard("currentWeight"))}
          </CardTitle>
          <Scale className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">
            {profile?.weight ? `${profile.weight} kg` : '--'}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {String(tDashboard("lastUpdated"))}
          </p>
        </CardContent>
      </Card>

      {/* Active Goals Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">
            {String(tDashboard("activeGoals"))}
          </CardTitle>
          <Target className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800">3</div>
          <p className="text-xs text-orange-600 mt-1">
            {String(tDashboard("inProgress"))}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

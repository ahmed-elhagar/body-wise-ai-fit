
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Target, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CoachAnalyticsTabProps {
  trainees: any[];
}

export const CoachAnalyticsTab = ({ trainees }: CoachAnalyticsTabProps) => {
  const { t } = useI18n();

  const analytics = {
    totalClients: trainees.length,
    activeClients: trainees.filter(t => t.lastActivity && new Date(t.lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    goalCompletionRate: 78,
    avgProgressRate: 85
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:totalClients') || 'Total Clients'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:activeClients') || 'Active This Week'}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeClients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:goalCompletion') || 'Goal Completion'}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.goalCompletionRate}%</div>
            <Progress value={analytics.goalCompletionRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('coach:avgProgress') || 'Avg Progress'}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgProgressRate}%</div>
            <Progress value={analytics.avgProgressRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('coach:performanceAnalytics') || 'Performance Analytics'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('coach:analyticsComingSoon') || 'Advanced analytics coming soon'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

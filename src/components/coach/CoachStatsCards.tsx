
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, TrendingUp, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface CoachStatsCardsProps {
  stats: {
    totalClients: number;
    messagesToday: number;
    successRate: number;
    monthlyGoals: number;
  };
}

export const CoachStatsCards = ({ stats }: CoachStatsCardsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("coach:trainees")}</CardTitle>
          <Users className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{stats.totalClients}</div>
          <p className="text-xs text-muted-foreground">{t("coach:activeClients")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("coach:messagesToday")}</CardTitle>
          <MessageCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{stats.messagesToday}</div>
          <p className="text-xs text-muted-foreground">{t("coach:clientInteractions")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("coach:successRate")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">{t("coach:clientGoalAchievement")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("coach:thisMonth")}</CardTitle>
          <Calendar className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{stats.monthlyGoals}</div>
          <p className="text-xs text-muted-foreground">{t("coach:goalsCompleted")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

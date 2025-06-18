import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Calendar, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoachAnalyticsTabProps {
  trainees: any[];
}

export const CoachAnalyticsTab = ({ trainees }: CoachAnalyticsTabProps) => {
  const { t } = useLanguage();

  // Calculate analytics data
  const totalTrainees = trainees.length;
  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile?.profile_completion_score || 0) >= 80
  ).length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length;

  const avgCompletionScore = totalTrainees > 0 
    ? Math.round(trainees.reduce((sum, t) => sum + (t.trainee_profile?.profile_completion_score || 0), 0) / totalTrainees)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Total Trainees')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalTrainees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Avg. Completion')}</p>
                <p className="text-2xl font-bold text-gray-900">{avgCompletionScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Active Rate')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTrainees > 0 ? Math.round((activeTrainees / totalTrainees) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('Engagement')}</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('Trainee Performance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalTrainees === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('No data available')}</p>
                <p className="text-sm text-gray-400">{t('Add trainees to see performance analytics')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainees.map((trainee) => (
                  <div key={trainee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {trainee.trainee_profile?.first_name} {trainee.trainee_profile?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {trainee.trainee_profile?.fitness_goal || 'General Fitness'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {trainee.trainee_profile?.profile_completion_score || 0}%
                      </div>
                      <Badge 
                        variant={(trainee.trainee_profile?.profile_completion_score || 0) >= 80 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {(trainee.trainee_profile?.profile_completion_score || 0) >= 80 ? 'Complete' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('Weekly Overview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('Analytics Coming Soon')}</p>
              <p className="text-sm text-gray-400">{t('Detailed charts and insights will be available here')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

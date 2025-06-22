
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Activity, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CoachTraineeRelationship } from "@/features/coach/types/coach.types";

interface TraineeProgressOverviewProps {
  trainees: CoachTraineeRelationship[];
  onViewAllTrainees: () => void;
}

const TraineeProgressOverview = ({ trainees, onViewAllTrainees }: TraineeProgressOverviewProps) => {
  const { t } = useLanguage();

  const getProgressStats = () => {
    const total = trainees.length;
    const highCompletion = trainees.filter(t => (t.trainee_profile?.profile_completion_score || 0) >= 80).length;
    const activeUsers = trainees.filter(t => (t.trainee_profile?.ai_generations_remaining || 0) > 0).length;
    const avgCompletion = total > 0 
      ? trainees.reduce((sum, t) => sum + (t.trainee_profile?.profile_completion_score || 0), 0) / total 
      : 0;

    return { total, highCompletion, activeUsers, avgCompletion };
  };

  const stats = getProgressStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('Trainee Progress Overview')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onViewAllTrainees}>
            {t('View All')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-sm text-gray-600">{t('Total Trainees')}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.highCompletion}</div>
            <p className="text-sm text-gray-600">{t('High Completion')}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
            <p className="text-sm text-gray-600">{t('Active Users')}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.avgCompletion)}%</div>
            <p className="text-sm text-gray-600">{t('Avg Completion')}</p>
          </div>
        </div>

        {/* Recent Trainees */}
        {trainees.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('Recent Trainees')}</h4>
            {trainees.slice(0, 3).map((trainee) => {
              const profile = trainee.trainee_profile;
              const fullName = profile 
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                : 'Unknown User';
              const completion = profile?.profile_completion_score || 0;
              
              return (
                <div key={trainee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{fullName}</p>
                      <p className="text-xs text-gray-600">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={completion >= 80 ? "default" : completion >= 60 ? "secondary" : "outline"}>
                      {completion}%
                    </Badge>
                  </div>
                </div>
              );
            })}
            {trainees.length > 3 && (
              <Button variant="ghost" size="sm" onClick={onViewAllTrainees} className="w-full">
                {t('View')} {trainees.length - 3} {t('more trainees')}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">{t('No trainees yet')}</p>
            <p className="text-sm text-gray-500">{t('Start by adding your first trainee')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TraineeProgressOverview;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Activity,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeProgressOverviewProps {
  trainees: any[];
  onViewAllTrainees: () => void;
}

export const TraineeProgressOverview = ({ trainees, onViewAllTrainees }: TraineeProgressOverviewProps) => {
  const { t } = useLanguage();
  
  const totalTrainees = trainees.length;
  const activeTrainees = trainees.filter(t => 
    (t.trainee_profile?.ai_generations_remaining || 0) > 0
  ).length;
  const completedProfiles = trainees.filter(t => 
    (t.trainee_profile?.profile_completion_score || 0) >= 80
  ).length;
  
  const avgCompletionScore = totalTrainees > 0 
    ? Math.round(trainees.reduce((sum, t) => sum + (t.trainee_profile?.profile_completion_score || 0), 0) / totalTrainees)
    : 0;

  const recentTrainees = trainees
    .sort((a, b) => new Date(b.assigned_at || 0).getTime() - new Date(a.assigned_at || 0).getTime())
    .slice(0, 3);

  if (totalTrainees === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('Trainee Progress Overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('No trainees assigned yet')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('Start by adding your first trainee to begin coaching')}
            </p>
            <Button onClick={onViewAllTrainees}>
              <Users className="w-4 h-4 mr-2" />
              {t('Add Trainee')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('Total')}</p>
              <p className="text-xl font-bold text-gray-900">{totalTrainees}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('Active')}</p>
              <p className="text-xl font-bold text-gray-900">{activeTrainees}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('Completed')}</p>
              <p className="text-xl font-bold text-gray-900">{completedProfiles}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('Avg. Progress')}</p>
              <p className="text-xl font-bold text-gray-900">{avgCompletionScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('Progress Summary')}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onViewAllTrainees}>
              {t('View All')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('Overall Profile Completion')}</span>
                <span className="font-medium">{avgCompletionScore}%</span>
              </div>
              <Progress value={avgCompletionScore} className="h-2" />
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{t('Recent Trainee Activity')}</h4>
              <div className="space-y-3">
                {recentTrainees.map((trainee) => {
                  const profile = trainee.trainee_profile || {};
                  const completionScore = profile.profile_completion_score || 0;
                  const hasLowProgress = completionScore < 50;
                  
                  return (
                    <div key={trainee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {(profile.first_name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {profile.first_name || 'Unknown'} {profile.last_name || 'User'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {profile.fitness_goal || 'General Fitness'}
                            {hasLowProgress && (
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{completionScore}%</div>
                        <Badge 
                          variant={completionScore >= 80 ? "default" : completionScore >= 50 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {completionScore >= 80 ? 'Complete' : completionScore >= 50 ? 'In Progress' : 'Needs Attention'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

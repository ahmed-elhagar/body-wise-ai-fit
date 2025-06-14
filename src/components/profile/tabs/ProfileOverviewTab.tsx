
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Target, Activity, Heart } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";

const ProfileOverviewTab = () => {
  const { profile } = useProfile();
  const { t } = useI18n();

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            {t('No profile data available')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('Profile Overview')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Name')}</label>
              <p className="text-lg">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Age')}</label>
              <p className="text-lg">{profile.age || 'Not set'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Weight')}</label>
              <p className="text-lg">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Height')}</label>
              <p className="text-lg">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('Fitness Goals')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="outline">{profile.fitness_goal || 'Not set'}</Badge>
            <p className="text-sm text-gray-600">
              {profile.target_weight ? `Target weight: ${profile.target_weight} kg` : 'No target weight set'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('Activity Level')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">{profile.activity_level || 'Not set'}</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewTab;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle, Info } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";

const ProfileHealthTab = () => {
  const { profile } = useProfile();
  const { t } = useI18n();

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            {t('No health data available')}
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
            <Heart className="h-5 w-5" />
            {t('Health Metrics')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Body Fat %')}</label>
              <p className="text-lg">{profile.body_fat_percentage ? `${profile.body_fat_percentage}%` : 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">{t('Body Shape')}</label>
              <p className="text-lg">{profile.body_shape || 'Not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('Health Conditions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profile.health_conditions && profile.health_conditions.length > 0 ? (
              profile.health_conditions.map((condition, index) => (
                <Badge key={index} variant="outline">{condition}</Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">{t('No health conditions reported')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('Dietary Information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">{t('Allergies')}</label>
            <div className="mt-1 space-x-1">
              {profile.allergies && profile.allergies.length > 0 ? (
                profile.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">{allergy}</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t('No allergies reported')}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">{t('Dietary Restrictions')}</label>
            <div className="mt-1 space-x-1">
              {profile.dietary_restrictions && profile.dietary_restrictions.length > 0 ? (
                profile.dietary_restrictions.map((restriction, index) => (
                  <Badge key={index} variant="secondary">{restriction}</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t('No dietary restrictions')}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHealthTab;

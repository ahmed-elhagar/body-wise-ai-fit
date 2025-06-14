
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Globe, Shield } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useI18n } from "@/hooks/useI18n";

const ProfileSettingsTab = () => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            {t('Loading settings...')}
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
            <Bell className="h-5 w-5" />
            {t('Notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('Email Notifications')}</label>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => 
                updatePreferences({
                  notifications: { ...preferences.notifications, email: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('Workout Reminders')}</label>
            <Switch
              checked={preferences.notifications.workout_reminders}
              onCheckedChange={(checked) => 
                updatePreferences({
                  notifications: { ...preferences.notifications, workout_reminders: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('Meal Reminders')}</label>
            <Switch
              checked={preferences.notifications.meal_reminders}
              onCheckedChange={(checked) => 
                updatePreferences({
                  notifications: { ...preferences.notifications, meal_reminders: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('Language & Units')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('Language')}</label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'en' | 'ar') => updatePreferences({ language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">{t('Weight Units')}</label>
            <Select
              value={preferences.units.weight}
              onValueChange={(value: 'kg' | 'lbs') => 
                updatePreferences({ units: { ...preferences.units, weight: value } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('Privacy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('Profile Visibility')}</label>
            <Select
              value={preferences.privacy.profile_visibility}
              onValueChange={(value: 'public' | 'private' | 'friends') => 
                updatePreferences({ 
                  privacy: { ...preferences.privacy, profile_visibility: value } 
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">{t('Public')}</SelectItem>
                <SelectItem value="friends">{t('Friends Only')}</SelectItem>
                <SelectItem value="private">{t('Private')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t('Share Workouts')}</label>
            <Switch
              checked={preferences.privacy.workout_sharing}
              onCheckedChange={(checked) => 
                updatePreferences({
                  privacy: { ...preferences.privacy, workout_sharing: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;

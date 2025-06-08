
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useI18n, Language } from "@/hooks/useI18n";
import { Badge } from '@/components/ui/badge';
import { Save, User, Bell, Shield, Globe, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettings {
  displayName: string;
  bio: string;
  language: Language;
  notifications: {
    email: boolean;
    push: boolean;
    meals: boolean;
    workouts: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showProgress: boolean;
    allowMessages: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

interface EnhancedSettingsFormProps {
  userSettings: UserSettings;
  onSave: (settings: UserSettings) => void;
  isLoading?: boolean;
}

const EnhancedSettingsForm = ({ userSettings, onSave, isLoading = false }: EnhancedSettingsFormProps) => {
  const { t, language, changeLanguage } = useI18n();
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSettings(userSettings);
    setHasChanges(false);
  }, [userSettings]);

  const handleChange = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (typeof newSettings[section] === 'object') {
        (newSettings[section] as any)[field] = value;
      } else {
        (newSettings as any)[section] = value;
      }
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    handleChange('language', '', newLanguage);
    changeLanguage(newLanguage);
  };

  const handleSave = async () => {
    try {
      await onSave(settings);
      setHasChanges(false);
      toast.success(t('Settings saved successfully'));
    } catch (error) {
      toast.error(t('Failed to save settings'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('Profile Settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">{t('Display Name')}</Label>
            <Input
              id="displayName"
              value={settings.displayName}
              onChange={(e) => handleChange('displayName', '', e.target.value)}
              placeholder={t('Enter your display name')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">{t('Bio')}</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => handleChange('bio', '', e.target.value)}
              placeholder={t('Tell us about yourself')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('Language & Region')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('Language')}</Label>
            <Select
              value={settings.language}
              onValueChange={(value: Language) => handleLanguageChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('Select language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('Theme')}</Label>
            <Select
              value={settings.theme}
              onValueChange={(value: 'light' | 'dark' | 'auto') => handleChange('theme', '', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('Select theme')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('Light')}</SelectItem>
                <SelectItem value="dark">{t('Dark')}</SelectItem>
                <SelectItem value="auto">{t('Auto')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('Notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">{t('Email Notifications')}</Label>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => handleChange('notifications', 'email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">{t('Push Notifications')}</Label>
            <Switch
              id="push-notifications"
              checked={settings.notifications.push}
              onCheckedChange={(checked) => handleChange('notifications', 'push', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <Label htmlFor="meal-reminders">{t('Meal Reminders')}</Label>
            <Switch
              id="meal-reminders"
              checked={settings.notifications.meals}
              onCheckedChange={(checked) => handleChange('notifications', 'meals', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="workout-reminders">{t('Workout Reminders')}</Label>
            <Switch
              id="workout-reminders"
              checked={settings.notifications.workouts}
              onCheckedChange={(checked) => handleChange('notifications', 'workouts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('Privacy Settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visible">{t('Profile Visible')}</Label>
              <p className="text-sm text-gray-500">{t('Allow others to see your profile')}</p>
            </div>
            <Switch
              id="profile-visible"
              checked={settings.privacy.profileVisible}
              onCheckedChange={(checked) => handleChange('privacy', 'profileVisible', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-progress">{t('Show Progress')}</Label>
              <p className="text-sm text-gray-500">{t('Display your fitness progress to others')}</p>
            </div>
            <Switch
              id="show-progress"
              checked={settings.privacy.showProgress}
              onCheckedChange={(checked) => handleChange('privacy', 'showProgress', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-messages">{t('Allow Messages')}</Label>
              <p className="text-sm text-gray-500">{t('Let other users send you messages')}</p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.privacy.allowMessages}
              onCheckedChange={(checked) => handleChange('privacy', 'allowMessages', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {hasChanges && (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            {t('Unsaved changes')}
          </Badge>
        )}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="min-w-[120px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? t('Saving...') : t('Save Changes')}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSettingsForm;

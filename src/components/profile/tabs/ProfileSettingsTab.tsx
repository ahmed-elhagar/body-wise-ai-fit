
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "@/contexts/LanguageContext";

export const ProfileSettingsTab = () => {
  const { t } = useTranslation('common');
  const { changeLanguage, language } = useLanguage();
  const { preferences, updatePreferences, isLoading } = useUserPreferences();

  if (isLoading) {
    return <div className="p-4">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications || false}
              onCheckedChange={(checked) => 
                updatePreferences({ email_notifications: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications || false}
              onCheckedChange={(checked) => 
                updatePreferences({ push_notifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Units */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Units</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={language}
              onValueChange={(value: 'en' | 'ar') => changeLanguage(value)}
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

          <div className="space-y-2">
            <Label>Measurement Units</Label>
            <Select
              value={preferences.measurement_units || 'metric'}
              onValueChange={(value: 'metric' | 'imperial') => 
                updatePreferences({ measurement_units: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics">Share Analytics Data</Label>
            <Switch
              id="analytics"
              checked={preferences.data_sharing_analytics || false}
              onCheckedChange={(checked) => 
                updatePreferences({ data_sharing_analytics: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

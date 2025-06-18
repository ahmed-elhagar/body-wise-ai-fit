
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Globe, Bell, Shield, Moon, Sun, Monitor } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useSettingsData } from "../hooks/useSettingsData";

export const GeneralSettingsTab = () => {
  const { language, isRTL } = useLanguage();
  const { t } = useI18n();
  const { settingsData, updateSettingsData, saveSettings } = useSettingsData();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const generalSettings = settingsData.general || {};

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={generalSettings.preferred_language || 'en'}
                onValueChange={(value) => updateSettingsData('general', { preferred_language: value })}
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
              <Label htmlFor="measurement">Measurement Units</Label>
              <Select
                value={generalSettings.measurement_units || 'metric'}
                onValueChange={(value) => updateSettingsData('general', { measurement_units: value })}
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
          </div>
        </CardContent>
      </Card>

      {/* Theme & Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Theme & Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme Preference</Label>
            <div className="flex gap-2">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'auto', icon: Monitor, label: 'Auto' }
              ].map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={generalSettings.theme_preference === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettingsData('general', { theme_preference: value })}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your fitness progress
                </p>
              </div>
              <Switch
                checked={generalSettings.push_notifications ?? true}
                onCheckedChange={(checked) => updateSettingsData('general', { push_notifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get weekly summaries and important updates via email
                </p>
              </div>
              <Switch
                checked={generalSettings.email_notifications ?? false}
                onCheckedChange={(checked) => updateSettingsData('general', { email_notifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and tips
                </p>
              </div>
              <Switch
                checked={generalSettings.marketing_emails ?? false}
                onCheckedChange={(checked) => updateSettingsData('general', { marketing_emails: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Data Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve the app by sharing anonymous usage data
                </p>
              </div>
              <Switch
                checked={generalSettings.data_sharing_analytics ?? false}
                onCheckedChange={(checked) => updateSettingsData('general', { data_sharing_analytics: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Research Data Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Contribute to health and fitness research (optional)
                </p>
              </div>
              <Switch
                checked={generalSettings.data_sharing_research ?? false}
                onCheckedChange={(checked) => updateSettingsData('general', { data_sharing_research: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;

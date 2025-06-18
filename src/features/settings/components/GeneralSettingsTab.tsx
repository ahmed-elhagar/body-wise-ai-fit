
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Globe, Bell, Shield, Loader2 } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useSettingsData } from '../hooks/useSettingsData';
import { toast } from "sonner";

export const GeneralSettingsTab = () => {
  const { language, setLanguage } = useLanguage();
  const { settingsData, updateSettingsData, saveSettings, isLoading } = useSettingsData();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
    updateSettingsData('general', { preferred_language: newLanguage });
  };

  const handleSaveSettings = async () => {
    const result = await saveSettings();
    if (result.success) {
      toast.success('Settings saved successfully!');
    } else {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* Language & Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-fitness-primary" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Display Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="units">Measurement Units</Label>
            <Select 
              value={settingsData.general.measurement_units || 'metric'} 
              onValueChange={(value) => updateSettingsData('general', { measurement_units: value })}
            >
              <SelectTrigger className="mt-1">
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

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-fitness-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={settingsData.general.theme_preference || 'light'} 
              onValueChange={(value) => updateSettingsData('general', { theme_preference: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-fitness-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Receive workout and meal reminders</p>
            </div>
            <Switch
              id="notifications"
              checked={settingsData.general.push_notifications ?? true}
              onCheckedChange={(checked) => updateSettingsData('general', { push_notifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailUpdates">Email Updates</Label>
              <p className="text-sm text-gray-600">Weekly progress reports and tips</p>
            </div>
            <Switch
              id="emailUpdates"
              checked={settingsData.general.email_notifications ?? false}
              onCheckedChange={(checked) => updateSettingsData('general', { email_notifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-fitness-primary" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dataSharing">Anonymous Data Sharing</Label>
              <p className="text-sm text-gray-600">Help improve our AI recommendations</p>
            </div>
            <Switch
              id="dataSharing"
              checked={settingsData.general.data_sharing_analytics ?? false}
              onCheckedChange={(checked) => updateSettingsData('general', { data_sharing_analytics: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          className="bg-fitness-gradient hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
};

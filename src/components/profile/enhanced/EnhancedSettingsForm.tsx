
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Settings, Bell, Globe, Shield } from "lucide-react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";

const EnhancedSettingsForm = () => {
  const { markStepComplete } = useOnboardingProgress();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profile_visibility: 'private',
      data_sharing_analytics: true,
      data_sharing_research: false,
    },
    preferences: {
      theme: 'light',
      measurement_units: 'metric',
      auto_meal_planning: true,
      auto_exercise_planning: true,
      ai_suggestions: true,
    }
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      markStepComplete('preferences');
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Language & Localization */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Language & Localization</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Preferred Language</Label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="measurement_units">Measurement Units</Label>
            <Select 
              value={settings.preferences.measurement_units} 
              onValueChange={(value) => updateSetting('preferences', 'measurement_units', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates and reminders via email</p>
            </div>
            <Switch
              id="email_notifications"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Get real-time notifications on your device</p>
            </div>
            <Switch
              id="push_notifications"
              checked={settings.notifications.push}
              onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms_notifications">SMS Notifications</Label>
              <p className="text-sm text-gray-600">Receive important updates via text message</p>
            </div>
            <Switch
              id="sms_notifications"
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing_emails">Marketing Emails</Label>
              <p className="text-sm text-gray-600">Receive promotional content and tips</p>
            </div>
            <Switch
              id="marketing_emails"
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Privacy & Data</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="profile_visibility">Profile Visibility</Label>
            <Select 
              value={settings.privacy.profile_visibility} 
              onValueChange={(value) => updateSetting('privacy', 'profile_visibility', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data_analytics">Analytics Data Sharing</Label>
              <p className="text-sm text-gray-600">Help improve the app with anonymous usage data</p>
            </div>
            <Switch
              id="data_analytics"
              checked={settings.privacy.data_sharing_analytics}
              onCheckedChange={(checked) => updateSetting('privacy', 'data_sharing_analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data_research">Research Data Sharing</Label>
              <p className="text-sm text-gray-600">Contribute to health and fitness research</p>
            </div>
            <Switch
              id="data_research"
              checked={settings.privacy.data_sharing_research}
              onCheckedChange={(checked) => updateSetting('privacy', 'data_sharing_research', checked)}
            />
          </div>
        </div>
      </Card>

      {/* App Preferences */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">App Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={settings.preferences.theme} 
              onValueChange={(value) => updateSetting('preferences', 'theme', value)}
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

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto_meal_planning">Automatic Meal Planning</Label>
              <p className="text-sm text-gray-600">Generate meal plans automatically</p>
            </div>
            <Switch
              id="auto_meal_planning"
              checked={settings.preferences.auto_meal_planning}
              onCheckedChange={(checked) => updateSetting('preferences', 'auto_meal_planning', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto_exercise_planning">Automatic Exercise Planning</Label>
              <p className="text-sm text-gray-600">Generate workout plans automatically</p>
            </div>
            <Switch
              id="auto_exercise_planning"
              checked={settings.preferences.auto_exercise_planning}
              onCheckedChange={(checked) => updateSetting('preferences', 'auto_exercise_planning', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai_suggestions">AI Suggestions</Label>
              <p className="text-sm text-gray-600">Receive personalized AI recommendations</p>
            </div>
            <Switch
              id="ai_suggestions"
              checked={settings.preferences.ai_suggestions}
              onCheckedChange={(checked) => updateSetting('preferences', 'ai_suggestions', checked)}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-fitness-gradient hover:opacity-90 w-full md:w-auto"
        >
          {isUpdating ? (
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

export default EnhancedSettingsForm;

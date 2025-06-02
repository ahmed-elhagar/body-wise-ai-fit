
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Globe, Bell, Shield, Loader2 } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { toast } from "sonner";

const EnhancedSettingsForm = () => {
  const { language, setLanguage } = useLanguage();
  const { profile, updateProfile } = useProfile();
  const { preferences: userPreferences, updatePreferences, isUpdating } = useUserPreferences();
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false,
    dataSharing: false,
    measurementUnits: 'metric',
  });

  // Initialize preferences from user_preferences table
  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        theme: userPreferences.theme_preference || 'light',
        notifications: userPreferences.push_notifications ?? true,
        emailUpdates: userPreferences.email_notifications ?? false,
        dataSharing: userPreferences.data_sharing_analytics ?? false,
        measurementUnits: userPreferences.measurement_units || 'metric',
      });
    }
  }, [userPreferences]);

  const handleLanguageChange = async (newLanguage: string) => {
    setIsLanguageLoading(true);
    try {
      setLanguage(newLanguage as Language);
      if (profile) {
        await updateProfile({ preferred_language: newLanguage });
        toast.success('Language preference saved!');
      }
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language preference');
    } finally {
      setIsLanguageLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({
        theme_preference: preferences.theme as 'light' | 'dark' | 'auto',
        push_notifications: preferences.notifications,
        email_notifications: preferences.emailUpdates,
        data_sharing_analytics: preferences.dataSharing,
        measurement_units: preferences.measurementUnits as 'metric' | 'imperial',
      });
      toast.success('Preferences saved successfully! Changes will apply to your workout and meal plans.');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="space-y-6">
      {/* Language & Localization */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Language & Region</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Display Language</Label>
            <Select value={language} onValueChange={handleLanguageChange} disabled={isLanguageLoading}>
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
              value={preferences.measurementUnits} 
              onValueChange={(value) => setPreferences({...preferences, measurementUnits: value})}
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
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Palette className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Appearance</h3>
        </div>
        
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select 
            value={preferences.theme} 
            onValueChange={(value) => setPreferences({...preferences, theme: value})}
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
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Receive workout and meal reminders</p>
            </div>
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
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
              checked={preferences.emailUpdates}
              onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
            />
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Privacy</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dataSharing">Anonymous Data Sharing</Label>
            <p className="text-sm text-gray-600">Help improve our AI recommendations</p>
          </div>
          <Switch
            id="dataSharing"
            checked={preferences.dataSharing}
            onCheckedChange={(checked) => setPreferences({...preferences, dataSharing: checked})}
          />
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences}
          className="bg-fitness-gradient hover:opacity-90"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSettingsForm;

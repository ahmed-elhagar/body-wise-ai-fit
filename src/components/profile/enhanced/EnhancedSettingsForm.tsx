
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Globe, Bell, Shield } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";

const EnhancedSettingsForm = () => {
  const { t, language, setLanguage } = useLanguage();
  const { profile, updateProfile } = useProfile();
  const { markStepComplete } = useOnboardingProgress();
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: false,
    dataSharing: false,
    measurementUnits: 'metric',
  });

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage as Language);
    if (profile) {
      await updateProfile({ preferred_language: newLanguage });
      toast.success('Language preference saved!');
    }
  };

  const handleSavePreferences = async () => {
    try {
      markStepComplete('preferences');
      toast.success('Preferences saved successfully!');
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
          <h3 className="text-lg font-semibold text-gray-800">{t('language')} & Region</h3>
        </div>
        
        <div className="space-y-4">
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
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSettingsForm;

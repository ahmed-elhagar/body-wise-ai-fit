
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
  units: string;
}

interface GeneralSettingsSectionProps {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  saving: boolean;
  onSave: () => void;
}

const GeneralSettingsSection = ({ preferences, setPreferences, saving, onSave }: GeneralSettingsSectionProps) => {
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">General Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Notifications</Label>
            <p className="text-sm text-gray-600">Receive app notifications</p>
          </div>
          <Switch
            checked={preferences.notifications}
            onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Updates</Label>
            <p className="text-sm text-gray-600">Weekly progress reports</p>
          </div>
          <Switch
            checked={preferences.emailUpdates}
            onCheckedChange={(checked) => handlePreferenceChange('emailUpdates', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
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
          <Label>Units</Label>
          <Select value={preferences.units} onValueChange={(value) => handlePreferenceChange('units', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onSave} 
          className="w-full"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default GeneralSettingsSection;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProfileSettingsTab = () => {
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    data_sharing_analytics: true,
    data_sharing_research: false,
    ai_suggestions: true,
    automatic_meal_planning: true,
    automatic_exercise_planning: true,
    progress_reminders: true,
    preferred_language: 'en',
    theme_preference: 'light',
    measurement_units: 'metric',
    profile_visibility: 'private'
  });

  const handleSave = async () => {
    try {
      // Here you would typically save to your preferences API
      console.log('Saving preferences:', preferences);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_notifications">Email Notifications</Label>
            <Switch
              id="email_notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, email_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push_notifications">Push Notifications</Label>
            <Switch
              id="push_notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, push_notifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing_emails">Marketing Emails</Label>
            <Switch
              id="marketing_emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, marketing_emails: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="progress_reminders">Progress Reminders</Label>
            <Switch
              id="progress_reminders"
              checked={preferences.progress_reminders}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, progress_reminders: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="preferred_language">Preferred Language</Label>
            <Select 
              value={preferences.preferred_language} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_language: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="theme_preference">Theme</Label>
            <Select 
              value={preferences.theme_preference} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, theme_preference: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="measurement_units">Measurement Units</Label>
            <Select 
              value={preferences.measurement_units} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, measurement_units: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ai_suggestions">AI Suggestions</Label>
            <Switch
              id="ai_suggestions"
              checked={preferences.ai_suggestions}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, ai_suggestions: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="automatic_meal_planning">Automatic Meal Planning</Label>
            <Switch
              id="automatic_meal_planning"
              checked={preferences.automatic_meal_planning}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, automatic_meal_planning: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="automatic_exercise_planning">Automatic Exercise Planning</Label>
            <Switch
              id="automatic_exercise_planning"
              checked={preferences.automatic_exercise_planning}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, automatic_exercise_planning: checked }))
              }
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;

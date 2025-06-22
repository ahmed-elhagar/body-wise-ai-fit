
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NotificationSettingsSectionProps {
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
  setPreferences: (prefs: any) => void;
}

const NotificationSettingsSection = ({ preferences, setPreferences }: NotificationSettingsSectionProps) => {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Notifications</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Push Notifications</Label>
            <p className="text-xs text-gray-600">Workout and meal reminders</p>
          </div>
          <Switch
            checked={preferences.notifications}
            onCheckedChange={(checked) => setPreferences({...preferences, notifications: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Email Updates</Label>
            <p className="text-xs text-gray-600">Weekly progress reports</p>
          </div>
          <Switch
            checked={preferences.emailUpdates}
            onCheckedChange={(checked) => setPreferences({...preferences, emailUpdates: checked})}
          />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettingsSection;

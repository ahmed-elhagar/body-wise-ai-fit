
import { useState } from "react";
import { 
  GeneralSettingsSection, 
  NotificationSettingsSection, 
  AccountSecuritySection, 
  SettingsFormActions 
} from "./settings";
import { toast } from "sonner";

const CompactSettingsForm = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    measurementUnits: 'metric',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-3">
      <GeneralSettingsSection 
        preferences={preferences}
        setPreferences={setPreferences}
      />

      <NotificationSettingsSection 
        preferences={preferences}
        setPreferences={setPreferences}
      />

      <AccountSecuritySection />

      <SettingsFormActions 
        isUpdating={isUpdating}
        completionPercentage={85}
        onSave={handleSave}
      />
    </div>
  );
};

export default CompactSettingsForm;

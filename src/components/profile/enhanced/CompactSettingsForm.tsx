
import { useState } from "react";
import { 
  GeneralSettingsSection, 
  NotificationSettingsSection, 
  AccountSecuritySection, 
  SettingsFormActions 
} from "./settings";

const CompactSettingsForm = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    measurementUnits: 'metric',
  });

  const [loading, setLoading] = useState({ 
    email: false, 
    password: false, 
    prefs: false 
  });

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

      <AccountSecuritySection 
        loading={loading}
        setLoading={setLoading}
      />

      <SettingsFormActions 
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default CompactSettingsForm;

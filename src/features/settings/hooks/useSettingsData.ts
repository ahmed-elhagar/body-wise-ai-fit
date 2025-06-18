
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/features/profile';

export const useSettingsData = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [settingsData, setSettingsData] = useState<any>({
    general: {},
    health: {},
    food: {},
    conditions: {}
  });

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    if (!profile) {
      setIsLoading(true);
      return;
    }

    // Map profile data to settings state
    setSettingsData({
      general: {
        theme_preference: 'light',
        measurement_units: 'metric',
        push_notifications: true,
        email_notifications: false,
        data_sharing_analytics: false,
        preferred_language: 'en',
        ...profile
      },
      health: profile,
      food: profile,
      conditions: profile
    });

    setIsLoading(false);
  }, [user?.id, profile]);

  const updateSettingsData = (section: string, data: any) => {
    setSettingsData(prevSettings => ({
      ...prevSettings,
      [section]: { ...prevSettings[section], ...data }
    }));
  };

  const saveSettings = async () => {
    // TODO: Implement settings save logic
    return { success: true };
  };

  return {
    settingsData,
    isLoading: isLoading || profileLoading,
    updateSettingsData,
    saveSettings
  };
};

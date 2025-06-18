import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/features/profile';

export const useSettingsData = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

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
    setSettings({
      theme: 'system', // Example setting
      notificationsEnabled: true, // Example setting
      language: 'en', // Example setting
      ...profile
    });

    setIsLoading(false);
  }, [user?.id, profile]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  };

  return {
    settings,
    isLoading: isLoading || profileLoading,
    updateSetting
  };
};

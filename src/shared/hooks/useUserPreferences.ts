import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  notifications: {
    email: boolean;
    push: boolean;
    mealReminders: boolean;
    workoutReminders: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
    analyticsOptIn: boolean;
  };
  display: {
    units: 'metric' | 'imperial';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
    timeFormat: '12h' | '24h';
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    mealReminders: true,
    workoutReminders: true
  },
  privacy: {
    profileVisible: true,
    dataSharing: false,
    analyticsOptIn: true
  },
  display: {
    units: 'metric',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  }
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage or API
    const loadPreferences = async () => {
      try {
        const stored = localStorage.getItem('userPreferences');
        if (stored) {
          setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    setSaving(true);
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      
      // Here you would also save to your backend API
      // await savePreferencesToAPI(newPreferences);
      
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('userPreferences');
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    resetPreferences
  };
};

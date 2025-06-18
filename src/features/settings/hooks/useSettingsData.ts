
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import type { SettingsFormData, FoodPreferences, SpecialCondition } from '../types';

export const useSettingsData = () => {
  const { profile, updateProfile, isLoading: profileLoading } = useProfile();
  const { preferences, updatePreferences, isUpdating } = useUserPreferences();
  
  const [settingsData, setSettingsData] = useState<SettingsFormData>({
    general: {},
    foodPreferences: {
      preferredCuisines: [],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isKeto: false,
      isPaleo: false,
      isHalal: false,
      isKosher: false,
      dietaryRestrictions: [],
      allergies: [],
    },
    healthConditions: [],
    specialConditions: [],
  });

  // Initialize settings data from profile and preferences
  useEffect(() => {
    if (profile && preferences) {
      setSettingsData({
        general: {
          theme_preference: preferences.theme_preference || 'light',
          preferred_language: profile.preferred_language || 'en',
          measurement_units: preferences.measurement_units || 'metric',
          email_notifications: preferences.email_notifications ?? true,
          push_notifications: preferences.push_notifications ?? true,
          marketing_emails: preferences.marketing_emails ?? false,
          data_sharing_analytics: preferences.data_sharing_analytics ?? true,
          ai_suggestions: preferences.ai_suggestions ?? true,
          automatic_meal_planning: preferences.automatic_meal_planning ?? true,
          automatic_exercise_planning: preferences.automatic_exercise_planning ?? true,
          progress_reminders: preferences.progress_reminders ?? true,
          profile_visibility: preferences.profile_visibility || 'private',
        },
        foodPreferences: {
          preferredCuisines: profile.preferred_foods || [],
          isVegetarian: (profile.dietary_restrictions || []).includes('vegetarian'),
          isVegan: (profile.dietary_restrictions || []).includes('vegan'),
          isGlutenFree: (profile.dietary_restrictions || []).includes('gluten_free'),
          isKeto: (profile.dietary_restrictions || []).includes('keto'),
          isPaleo: (profile.dietary_restrictions || []).includes('paleo'),
          isHalal: (profile.dietary_restrictions || []).includes('halal'),
          isKosher: (profile.dietary_restrictions || []).includes('kosher'),
          dietaryRestrictions: profile.dietary_restrictions || [],
          allergies: profile.allergies || [],
        },
        healthConditions: profile.health_conditions || [],
        specialConditions: (profile.special_conditions as SpecialCondition[]) || [],
      });
    }
  }, [profile, preferences]);

  const updateSettingsData = (section: keyof SettingsFormData, data: any) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const saveSettings = async () => {
    try {
      // Update profile data
      if (profile && updateProfile) {
        await updateProfile({
          preferred_language: settingsData.general.preferred_language,
          preferred_foods: settingsData.foodPreferences.preferredCuisines,
          dietary_restrictions: settingsData.foodPreferences.dietaryRestrictions,
          allergies: settingsData.foodPreferences.allergies,
          health_conditions: settingsData.healthConditions,
          special_conditions: settingsData.specialConditions as any,
        });
      }

      // Update user preferences
      if (preferences && updatePreferences) {
        await updatePreferences({
          theme_preference: settingsData.general.theme_preference as 'light' | 'dark' | 'auto',
          measurement_units: settingsData.general.measurement_units as 'metric' | 'imperial',
          email_notifications: settingsData.general.email_notifications,
          push_notifications: settingsData.general.push_notifications,
          marketing_emails: settingsData.general.marketing_emails,
          data_sharing_analytics: settingsData.general.data_sharing_analytics,
          ai_suggestions: settingsData.general.ai_suggestions,
          automatic_meal_planning: settingsData.general.automatic_meal_planning,
          automatic_exercise_planning: settingsData.general.automatic_exercise_planning,
          progress_reminders: settingsData.general.progress_reminders,
          profile_visibility: settingsData.general.profile_visibility as 'private' | 'public' | 'friends',
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error };
    }
  };

  return {
    settingsData,
    updateSettingsData,
    saveSettings,
    isLoading: profileLoading || isUpdating,
    profile,
    preferences,
  };
};

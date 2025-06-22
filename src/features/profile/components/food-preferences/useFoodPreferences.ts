
import { useState, useEffect } from 'react';
import { useProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "sonner";

interface FoodPreferencesState {
  preferredCuisines: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  isHalal: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isKeto: boolean;
  isLowCarb: boolean;
}

export const useFoodPreferences = () => {
  const { profile, updateProfile, isLoading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  
  const [preferences, setPreferences] = useState<FoodPreferencesState>({
    preferredCuisines: [],
    allergies: [],
    dietaryRestrictions: [],
    isHalal: false,
    isVegetarian: false,
    isVegan: false,
    isKeto: false,
    isLowCarb: false
  });

  // Update preferences when profile loads
  useEffect(() => {
    if (profile) {
      const currentRestrictions = profile.dietary_restrictions || [];
      setPreferences({
        preferredCuisines: profile.preferred_foods || [],
        allergies: profile.allergies || [],
        dietaryRestrictions: currentRestrictions.filter(r => 
          !['Halal', 'Vegetarian', 'Vegan', 'Keto', 'Low Carb'].includes(r)
        ),
        isHalal: currentRestrictions.includes('Halal'),
        isVegetarian: currentRestrictions.includes('Vegetarian'),
        isVegan: currentRestrictions.includes('Vegan'),
        isKeto: currentRestrictions.includes('Keto'),
        isLowCarb: currentRestrictions.includes('Low Carb')
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Build dietary restrictions array
      const dietaryRestrictions = [...preferences.dietaryRestrictions];
      if (preferences.isHalal) dietaryRestrictions.push('Halal');
      if (preferences.isVegetarian) dietaryRestrictions.push('Vegetarian');
      if (preferences.isVegan) dietaryRestrictions.push('Vegan');
      if (preferences.isKeto) dietaryRestrictions.push('Keto');
      if (preferences.isLowCarb) dietaryRestrictions.push('Low Carb');

      await updateProfile({
        preferred_foods: preferences.preferredCuisines,
        allergies: preferences.allergies,
        dietary_restrictions: [...new Set(dietaryRestrictions)]
      });
      
      toast.success('Food preferences updated successfully! This will affect your future meal plans.');
    } catch (error) {
      console.error('Error updating food preferences:', error);
      toast.error('Failed to update food preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    setPreferences,
    handleSave,
    isLoading: isLoading || profileLoading
  };
};

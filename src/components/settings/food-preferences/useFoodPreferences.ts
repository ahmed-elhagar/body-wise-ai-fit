
import { useState } from 'react';
import { useProfile } from "@/hooks/useProfile";
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
  const { profile, updateProfile } = useProfile();
  
  const [preferences, setPreferences] = useState<FoodPreferencesState>({
    preferredCuisines: profile?.preferred_foods || [],
    allergies: profile?.allergies || [],
    dietaryRestrictions: profile?.dietary_restrictions || [],
    isHalal: false,
    isVegetarian: false,
    isVegan: false,
    isKeto: false,
    isLowCarb: false
  });

  const handleSave = async () => {
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
        dietary_restrictions: [...new Set(dietaryRestrictions)] // Remove duplicates
      });
      
      toast.success('Food preferences updated successfully!');
    } catch (error) {
      console.error('Error updating food preferences:', error);
      toast.error('Failed to update food preferences');
    }
  };

  return {
    preferences,
    setPreferences,
    handleSave
  };
};

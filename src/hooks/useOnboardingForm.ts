
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";

export interface OnboardingFormData {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  nationality: string;
  body_shape: string;
  body_fat_percentage: string;
  fitness_goal: string;
  activity_level: string;
  health_conditions: string[];
  allergies: string[];
  preferred_foods: string[];
  dietary_restrictions: string[];
}

export const useOnboardingForm = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    body_fat_percentage: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  // Populate form with existing user data
  useEffect(() => {
    console.log('useOnboardingForm - User or profile changed:', { user: !!user, profile: !!profile });
    
    if (user && profile) {
      console.log('useOnboardingForm - Updating form data from profile:', profile);
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || user.user_metadata?.first_name || '',
        last_name: profile.last_name || user.user_metadata?.last_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        body_fat_percentage: profile.body_fat_percentage?.toString() || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      }));
    } else if (user?.user_metadata) {
      console.log('useOnboardingForm - Updating form data from user metadata:', user.user_metadata);
      setFormData(prev => ({
        ...prev,
        first_name: user.user_metadata.first_name || '',
        last_name: user.user_metadata.last_name || '',
      }));
    }
  }, [user, profile]);

  const updateFormData = (field: string, value: string | string[]) => {
    console.log(`useOnboardingForm - Updating field ${field} with value:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('useOnboardingForm - New form data:', newData);
      return newData;
    });
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    console.log(`useOnboardingForm - Updating array field ${field} with value:`, arrayValue);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  return {
    formData,
    updateFormData,
    handleArrayInput,
  };
};

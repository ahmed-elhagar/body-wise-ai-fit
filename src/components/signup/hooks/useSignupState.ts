
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { SignupFormData } from "../types";
import { mapBodyFatToBodyShape, isValidBodyShape } from "@/utils/signupValidation";

const STORAGE_KEY = "fitfatta_signup_progress";

export const useSignupState = () => {
  const { user, signUp } = useAuth();
  const { profile, updateProfile } = useProfile();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    nationality: "",
    bodyFatPercentage: 20,
    bodyShape: "",
    fitnessGoal: "",
    activityLevel: "",
    healthConditions: [],
    allergies: [],
    preferredFoods: [],
    dietaryRestrictions: [],
    specialConditions: []
  });

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setFormData(prev => ({ ...prev, ...parsed.formData }));
        setCurrentStep(parsed.currentStep || 1);
        setAccountCreated(parsed.accountCreated || false);
      } catch (error) {
        console.error("Failed to load signup progress:", error);
      }
    }
  }, []);

  // Save progress whenever form data or step changes
  useEffect(() => {
    if (currentStep > 1 || accountCreated) {
      const progressData = {
        formData,
        currentStep,
        accountCreated,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    }
  }, [formData, currentStep, accountCreated]);

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: keyof SignupFormData, value: string) => {
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const createAccount = async () => {
    setIsLoading(true);
    try {
      console.log('Creating account for:', formData.email);
      const result = await signUp(formData.email, formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim()
      });

      console.log('SignUp result:', result);

      // Check for errors more thoroughly
      if (result?.error) {
        console.error('Signup error details:', result.error);
        
        // Handle specific error cases
        const errorMessage = result.error.message || '';
        const lowerErrorMessage = errorMessage.toLowerCase();
        
        // Check for various "user exists" error patterns
        if (lowerErrorMessage.includes('user already registered') || 
            lowerErrorMessage.includes('already registered') || 
            lowerErrorMessage.includes('user already exists') ||
            lowerErrorMessage.includes('already exists') ||
            lowerErrorMessage.includes('email already in use') ||
            lowerErrorMessage.includes('duplicate') ||
            result.error.status === 422) {
          throw new Error('USER_ALREADY_EXISTS');
        }
        
        // Throw the original error message for other cases
        throw new Error(errorMessage || 'Account creation failed');
      }

      // If we get here, account creation was successful
      console.log('Account created successfully');
      setAccountCreated(true);
      return { success: true };
    } catch (error: any) {
      console.error('Account creation error in hook:', error);
      // Re-throw the error so the component can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async () => {
    if (!accountCreated && !user) {
      return { success: false, error: "Account not created yet" };
    }

    setIsLoading(true);
    try {
      // Ensure body shape is set based on body fat percentage and gender
      const calculatedBodyShape = mapBodyFatToBodyShape(formData.bodyFatPercentage, formData.gender);
      
      // Validate that the body shape is correct
      if (!isValidBodyShape(calculatedBodyShape)) {
        console.error('Invalid body shape calculated:', calculatedBodyShape);
        throw new Error('Invalid body shape value');
      }

      console.log('🔍 Profile completion data preparation:', {
        bodyFatPercentage: formData.bodyFatPercentage,
        gender: formData.gender,
        calculatedBodyShape,
        isValidShape: isValidBodyShape(calculatedBodyShape)
      });

      const profileData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        nationality: formData.nationality.trim(),
        fitness_goal: formData.fitnessGoal,
        activity_level: formData.activityLevel,
        body_fat_percentage: formData.bodyFatPercentage,
        body_shape: calculatedBodyShape,
        health_conditions: formData.healthConditions.filter(Boolean),
        allergies: formData.allergies.filter(Boolean),
        dietary_restrictions: formData.dietaryRestrictions.filter(Boolean),
        preferred_foods: formData.preferredFoods.filter(Boolean),
        special_conditions: formData.specialConditions.filter(Boolean),
        profile_completion_score: 95,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with data:', profileData);

      const updateResult = await updateProfile(profileData);
      
      if (updateResult?.error) {
        console.error('Profile update error:', updateResult.error);
        throw new Error(updateResult.error.message || 'Profile update failed');
      }

      // Clear saved progress
      localStorage.removeItem(STORAGE_KEY);
      
      return { success: true };
    } catch (error: any) {
      console.error('Profile completion error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return {
    currentStep,
    formData,
    isLoading,
    accountCreated,
    updateField,
    handleArrayInput,
    createAccount,
    completeProfile,
    nextStep,
    prevStep,
    setCurrentStep
  };
};

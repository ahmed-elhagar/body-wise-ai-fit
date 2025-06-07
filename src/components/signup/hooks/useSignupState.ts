
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { SignupFormData } from "../types";
import { mapBodyFatToBodyShape } from "@/utils/signupValidation";

const STORAGE_KEY = "fitgenius_signup_progress";

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

  // Check if user has incomplete profile and redirect to appropriate step
  useEffect(() => {
    if (user && profile) {
      console.log("Checking user profile completion:", {
        hasBasicInfo: !!(profile.first_name && profile.last_name),
        hasPhysicalInfo: !!(profile.age && profile.gender && profile.height && profile.weight),
        hasGoals: !!(profile.fitness_goal && profile.activity_level),
        onboardingCompleted: profile.onboarding_completed
      });

      if (!profile.onboarding_completed) {
        // User exists but profile incomplete - determine which step to start from
        if (!profile.first_name || !profile.last_name) {
          setCurrentStep(2); // Skip account creation, go to physical info
        } else if (!profile.age || !profile.gender || !profile.height || !profile.weight) {
          setCurrentStep(2);
        } else if (!profile.body_fat_percentage) {
          setCurrentStep(3);
        } else if (!profile.fitness_goal || !profile.activity_level) {
          setCurrentStep(4);
        } else {
          setCurrentStep(5);
        }
        setAccountCreated(true);
      }
    }
  }, [user, profile]);

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
      const result = await signUp(formData.email, formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim()
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Account creation failed');
      }

      setAccountCreated(true);
      setCurrentStep(2);
      return { success: true };
    } catch (error: any) {
      console.error('Account creation error:', error);
      return { success: false, error: error.message };
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
        body_shape: mapBodyFatToBodyShape(formData.bodyFatPercentage, formData.gender),
        health_conditions: formData.healthConditions.filter(Boolean),
        allergies: formData.allergies.filter(Boolean),
        dietary_restrictions: formData.dietaryRestrictions.filter(Boolean),
        preferred_foods: formData.preferredFoods.filter(Boolean),
        special_conditions: formData.specialConditions.filter(Boolean),
        profile_completion_score: 95,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      const updateResult = await updateProfile(profileData);
      
      if (updateResult?.error) {
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

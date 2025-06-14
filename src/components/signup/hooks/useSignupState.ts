import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SignupFormData } from '../types';

const totalSteps = 4;

interface UseSignupState {
  currentStep: number;
  formData: SignupFormData;
  isLoading: boolean;
  error: string | null;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  updateField: (field: keyof SignupFormData, value: any) => void;
  handleSubmit: () => Promise<void>;
}

export const useSignupState = (): UseSignupState => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    activity_level: '',
    health_goal: '',
    bodyFatPercentage: 0,
    bodyShape: '',
    dietary_preferences: [],
    food_allergies: [],
    special_conditions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, updateProfile } = useAuth();
  const navigate = useNavigate();

  const goToNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const goToPrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Create account
      const authResult = await signUp(formData.email, formData.password);
      
      if (!authResult) {
        throw new Error('Failed to create account');
      }

      // Update profile
      const profileResult = await updateProfile({
        ...formData,
        onboarding_completed: true
      });

      if (!profileResult) {
        throw new Error('Failed to update profile');
      }

      setCurrentStep(totalSteps);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    formData,
    isLoading,
    error,
    goToNextStep,
    goToPrevStep,
    updateField,
    handleSubmit
  };
};

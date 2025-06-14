
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SignupFormData } from '../types';

const totalSteps = 5;

interface UseSignupState {
  currentStep: number;
  formData: SignupFormData;
  isLoading: boolean;
  error: string | null;
  accountCreated: boolean;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  updateField: (field: keyof SignupFormData, value: any) => void;
  handleSubmit: () => Promise<void>;
  handleArrayInput: (field: keyof SignupFormData, value: string[]) => void;
  createAccount: () => Promise<void>;
  completeProfile: () => Promise<{ success: boolean; error?: string }>;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
}

export const useSignupState = (): UseSignupState => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    activity_level: '',
    activityLevel: '',
    health_goal: '',
    fitnessGoal: '',
    bodyFatPercentage: 0,
    bodyShape: '',
    dietary_preferences: [],
    food_allergies: [],
    special_conditions: [],
    healthConditions: [],
    allergies: [],
    preferredFoods: [],
    dietaryRestrictions: [],
    specialConditions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const goToNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const goToPrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const nextStep = goToNextStep;
  const prevStep = goToPrevStep;

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleArrayInput = (field: keyof SignupFormData, value: string[]) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const createAccount = async () => {
    try {
      setIsLoading(true);
      const result = await signUp(formData.email, formData.password);
      if (result) {
        setAccountCreated(true);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Completing profile with data:', formData);
      // Mock profile completion
      setCurrentStep(totalSteps);
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Failed to complete profile');
      return { success: false, error: err?.message || 'Failed to complete profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Create account
      const authResult = await signUp(formData.email, formData.password);
      
      if (!authResult) {
        throw new Error('Failed to create account');
      }

      setCurrentStep(totalSteps);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    formData,
    isLoading,
    error,
    accountCreated,
    goToNextStep,
    goToPrevStep,
    updateField,
    handleSubmit,
    handleArrayInput,
    createAccount,
    completeProfile,
    nextStep,
    prevStep,
    setCurrentStep
  };
};

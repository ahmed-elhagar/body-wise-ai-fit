
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingNavigation from "@/components/onboarding/OnboardingNavigation";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    nationality: "",
    // Health & Goals
    body_shape: "",
    health_conditions: [] as string[],
    fitness_goal: "",
    activity_level: "",
    // Nutrition
    allergies: [] as string[],
    preferred_foods: [] as string[],
    dietary_restrictions: [] as string[]
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.age && 
               formData.gender && formData.height && formData.weight && 
               formData.nationality && formData.body_shape;
      case 2:
        return formData.fitness_goal && formData.activity_level;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save user data to Supabase
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender as any,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nationality: formData.nationality,
        body_shape: formData.body_shape as any,
        health_conditions: formData.health_conditions,
        fitness_goal: formData.fitness_goal as any,
        activity_level: formData.activity_level as any,
        allergies: formData.allergies,
        preferred_foods: formData.preferred_foods,
        dietary_restrictions: formData.dietary_restrictions
      };

      updateProfile(profileData);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateFormData(field, items);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <OnboardingStep1 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <OnboardingStep2 
            formData={formData} 
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
          />
        );
      case 3:
        return (
          <OnboardingStep3 
            handleArrayInput={handleArrayInput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <OnboardingHeader 
          step={step} 
          totalSteps={totalSteps} 
          progress={progress} 
        />

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          {renderStepContent()}

          <OnboardingNavigation
            step={step}
            totalSteps={totalSteps}
            isStepValid={isStepValid()}
            isUpdating={isUpdating}
            onBack={handleBack}
            onNext={handleNext}
          />
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

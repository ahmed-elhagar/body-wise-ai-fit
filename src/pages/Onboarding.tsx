
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { validateOnboardingStep } from "@/utils/onboardingValidation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingNavigation from "@/components/onboarding/OnboardingNavigation";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState(1);
  const { formData, updateFormData, handleArrayInput } = useOnboardingForm();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const isStepValid = (): boolean => {
    return validateOnboardingStep(step, formData);
  };

  const handleNext = async () => {
    if (!isStepValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save user data to Supabase
      try {
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
          dietary_restrictions: formData.dietary_restrictions,
          onboarding_completed: true // Mark onboarding as completed
        };

        console.log("Onboarding - Saving complete profile data:", profileData);
        
        await updateProfile(profileData);
        
        toast.success('Profile completed successfully! Redirecting to dashboard...');
        
        // Small delay to ensure the profile update is processed
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);

      } catch (error) {
        console.error('Onboarding - Error updating profile:', error);
        toast.error('Failed to save profile. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
            formData={formData}
            updateFormData={updateFormData}
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

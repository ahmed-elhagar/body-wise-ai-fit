
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { validateOnboardingStep } from "@/utils/onboardingValidation";
import ModernOnboardingHeader from "@/components/onboarding/ModernOnboardingHeader";
import ModernOnboardingNavigation from "@/components/onboarding/ModernOnboardingNavigation";
import EnhancedOnboardingStep1 from "@/components/onboarding/EnhancedOnboardingStep1";
import EnhancedOnboardingStep2 from "@/components/onboarding/EnhancedOnboardingStep2";
import EnhancedOnboardingStep3 from "@/components/onboarding/EnhancedOnboardingStep3";
import EnhancedOnboardingStep4 from "@/components/onboarding/EnhancedOnboardingStep4";

const EnhancedOnboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating, profile } = useProfile();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const { formData, updateFormData, handleArrayInput } = useOnboardingForm();
  const [isCompleting, setIsCompleting] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Check if user has already completed onboarding
  useEffect(() => {
    if (!authLoading && profile && profile.onboarding_completed && !isCompleting) {
      console.log('EnhancedOnboarding - User has completed onboarding, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [profile, authLoading, navigate, isCompleting]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isStepValid = (): boolean => {
    return validateOnboardingStep(step, formData);
  };

  const handleNext = async () => {
    console.log('EnhancedOnboarding - handleNext called, step:', step, 'isStepValid:', isStepValid());
    
    if (!isStepValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (step < totalSteps) {
      console.log('EnhancedOnboarding - Moving to next step:', step + 1);
      setStep(step + 1);
    } else {
      // Final step - save and complete
      setIsCompleting(true);
      try {
        console.log('EnhancedOnboarding - Final step, saving profile data');
        
        const profileData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender as any,
          height: formData.height ? parseFloat(formData.height) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          nationality: formData.nationality === "prefer_not_to_say" ? null : formData.nationality,
          body_shape: formData.body_shape as any,
          health_conditions: formData.health_conditions,
          fitness_goal: formData.fitness_goal as any,
          activity_level: formData.activity_level as any,
          allergies: formData.allergies,
          preferred_foods: formData.preferred_foods,
          dietary_restrictions: formData.dietary_restrictions,
          onboarding_completed: true,
          ai_generations_remaining: 5
        };

        console.log("EnhancedOnboarding - Saving complete profile data:", profileData);
        
        await updateProfile(profileData);
        
        console.log('EnhancedOnboarding - Profile saved successfully, redirecting to success page');
        
        navigate('/onboarding-success', { replace: true });

      } catch (error) {
        console.error('EnhancedOnboarding - Unexpected error:', error);
        toast.error('Something went wrong. Please try again.');
        setIsCompleting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <EnhancedOnboardingStep1 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <EnhancedOnboardingStep2 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <EnhancedOnboardingStep3 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <EnhancedOnboardingStep4 
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
          />
        );
      default:
        return null;
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <ModernOnboardingHeader 
          step={step} 
          totalSteps={totalSteps} 
          progress={progress} 
        />

        <Card className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[400px] sm:min-h-[500px]">
            {renderStepContent()}
          </div>

          <ModernOnboardingNavigation
            step={step}
            totalSteps={totalSteps}
            isStepValid={isStepValid()}
            isUpdating={isUpdating || isCompleting}
            onBack={handleBack}
            onNext={handleNext}
            onSkip={handleSkip}
            canSkip={step === 2 || step === 3}
          />
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOnboarding;

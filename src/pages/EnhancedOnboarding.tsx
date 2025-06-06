import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useEmailConfirmation } from "@/hooks/useEmailConfirmation";
import { toast } from "sonner";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { validateOnboardingStep } from "@/utils/onboardingValidation";
import ModernOnboardingHeader from "@/components/onboarding/ModernOnboardingHeader";
import EnhancedOnboardingStep1 from "@/components/onboarding/EnhancedOnboardingStep1";
import EnhancedOnboardingStep2 from "@/components/onboarding/EnhancedOnboardingStep2";
import EnhancedOnboardingStep3 from "@/components/onboarding/EnhancedOnboardingStep3";
import EnhancedOnboardingStep4 from "@/components/onboarding/EnhancedOnboardingStep4";
import WelcomeSuccessPage from "@/components/onboarding/WelcomeSuccessPage";
import ModernOnboardingNavigation from "@/components/onboarding/ModernOnboardingNavigation";

const EnhancedOnboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating, profile } = useProfile();
  const { user, loading: authLoading } = useAuth();
  const { isEmailConfirmationEnabled } = useEmailConfirmation();
  const [step, setStep] = useState(1);
  const { formData, updateFormData, handleArrayInput } = useOnboardingForm();
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Check if user needs to confirm their email (only if email confirmation is enabled)
  useEffect(() => {
    if (!authLoading) {
      if (isEmailConfirmationEnabled && !user) {
        setShowEmailConfirmation(true);
      } else {
        setShowEmailConfirmation(false);
      }
    }
  }, [user, authLoading, isEmailConfirmationEnabled]);

  // Check if user has already completed onboarding
  useEffect(() => {
    if (!authLoading && profile && profile.onboarding_completed && !isCompleting && !showSuccess) {
      console.log('Onboarding - User has completed onboarding, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [profile, authLoading, navigate, isCompleting, showSuccess]);

  const isStepValid = (): boolean => {
    return validateOnboardingStep(step, formData);
  };

  const handleNext = async () => {
    console.log('Onboarding - handleNext called, step:', step, 'isStepValid:', isStepValid());
    
    if (!isStepValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (step < totalSteps) {
      console.log('Onboarding - Moving to next step:', step + 1);
      setStep(step + 1);
    } else {
      // Final step - save and complete
      setIsCompleting(true);
      try {
        console.log('Onboarding - Final step, saving profile data');
        
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

        console.log("Onboarding - Saving complete profile data:", profileData);
        
        await updateProfile(profileData);
        
        console.log('Onboarding - Profile saved successfully, showing success page');
        setIsCompleting(false);
        setShowSuccess(true);

      } catch (error) {
        console.error('Onboarding - Unexpected error:', error);
        toast.error('Something went wrong. Please try again.');
        setIsCompleting(false);
      }
    }
  };

  const handleGetStarted = async () => {
    console.log('Onboarding - Getting started, redirecting to dashboard');
    toast.success('🚀 Let\'s start your fitness journey!');
    
    // Force a small delay to ensure profile is saved
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 500);
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

  // Show success page after completion
  if (showSuccess) {
    return (
      <WelcomeSuccessPage
        userName={formData.first_name || 'there'}
        onGetStarted={handleGetStarted}
      />
    );
  }

  // Show email confirmation message if email confirmation is enabled and user hasn't confirmed their email
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent you a confirmation email. Please click the link in the email to verify your account and continue with setup.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Back to Sign In
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <ModernOnboardingHeader 
          step={step} 
          totalSteps={totalSteps} 
          progress={progress} 
        />

        <Card className="p-4 md:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[500px]">
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
            canSkip={step === 2 || step === 3} // Allow skipping on optional steps
          />
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOnboarding;

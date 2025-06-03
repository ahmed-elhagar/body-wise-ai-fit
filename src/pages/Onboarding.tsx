
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const { formData, updateFormData, handleArrayInput } = useOnboardingForm();
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // Check if user needs to confirm their email
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // No user means they haven't confirmed email yet
        setShowEmailConfirmation(true);
      } else {
        // User is confirmed, proceed with onboarding
        setShowEmailConfirmation(false);
      }
    }
  }, [user, authLoading]);

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
      // Save user data to Supabase and trigger AI generation
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
          onboarding_completed: true, // Mark onboarding as completed
          ai_generations_remaining: 5 // Set initial AI generation credits
        };

        console.log("Onboarding - Saving complete profile data and preparing AI generation:", profileData);
        
        await updateProfile(profileData);
        
        toast.success('🎉 Profile completed! Redirecting to dashboard where your AI content will be generated...');
        
        // Navigate to dashboard where initial AI generation will trigger
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

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

  // Show email confirmation message if user hasn't confirmed their email
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-fitness-primary-600 hover:to-fitness-primary-700 transition-all duration-300"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

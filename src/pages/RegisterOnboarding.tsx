
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
import ModernOnboardingNavigation from "@/components/onboarding/ModernOnboardingNavigation";
import RegisterStep from "@/components/onboarding/RegisterStep";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingStep7 from "@/components/onboarding/OnboardingStep7";
import OnboardingStep8 from "@/components/onboarding/OnboardingStep8";

const RegisterOnboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating, profile } = useProfile();
  const { user, loading: authLoading, signUp } = useAuth();
  const { isEmailConfirmationEnabled } = useEmailConfirmation();
  
  const [step, setStep] = useState(0); // Start with registration (step 0)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { formData, updateFormData } = useOnboardingForm();

  // Calculate total steps: Registration + Onboarding steps
  const onboardingSteps = formData.gender === 'female' ? 8 : 7;
  const totalSteps = 1 + onboardingSteps; // Registration + onboarding
  const progress = (step / (totalSteps - 1)) * 100;

  // Protect from logged-in users who have completed onboarding
  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.onboarding_completed && !isCompleting) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate, isCompleting]);

  // Check if user needs to confirm their email
  useEffect(() => {
    if (!authLoading) {
      if (isEmailConfirmationEnabled && !user && step > 0) {
        setShowEmailConfirmation(true);
      } else {
        setShowEmailConfirmation(false);
      }
    }
  }, [user, authLoading, isEmailConfirmationEnabled, step]);

  const handleRegistration = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    setIsRegistering(true);
    try {
      await signUp(data.email, data.password, { 
        first_name: data.firstName, 
        last_name: data.lastName 
      });
      
      // Pre-populate form with registration data
      updateFormData("first_name", data.firstName);
      updateFormData("last_name", data.lastName);
      
      console.log('Registration successful, proceeding to onboarding');
      toast.success('Account created successfully! Let\'s complete your profile.');
      setStep(1); // Move to first onboarding step
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsRegistering(false);
    }
  };

  const isStepValid = (): boolean => {
    if (step === 0) return true; // Registration step has its own validation
    return validateOnboardingStep(step, formData);
  };

  const getStepSkippable = (): boolean => {
    // Steps 6, 7, 8 are optional/skippable (health, special conditions, dietary)
    return step >= 6;
  };

  const handleNext = async () => {
    if (!isStepValid() && !getStepSkippable()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Skip step 7 for non-females
    if (step === 6 && formData.gender !== 'female') {
      setStep(8);
      return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      // Skip step 7 for non-females when going back
      if (step === 8 && formData.gender !== 'female') {
        setStep(6);
      } else {
        setStep(step - 1);
      }
    }
  };

  const handleSkip = () => {
    if (getStepSkippable()) {
      handleNext();
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      // Map activity level to valid database values
      const activityLevelMapping = {
        'sedentary': 'sedentary',
        'light': 'lightly_active',
        'moderate': 'moderately_active', 
        'active': 'very_active',
        'very_active': 'extremely_active'
      };

      const mappedActivityLevel = activityLevelMapping[formData.activity_level as keyof typeof activityLevelMapping] || 'moderately_active';

      // Ensure body fat percentage is properly converted
      const bodyFatValue = formData.body_fat_percentage ? 
        (typeof formData.body_fat_percentage === 'string' ? 
          parseFloat(formData.body_fat_percentage) : 
          formData.body_fat_percentage) : null;

      // Map special conditions with proper null handling
      const pregnancyTrimester = formData.pregnancy_trimester && formData.pregnancy_trimester !== 'none' && formData.pregnancy_trimester !== '' ? 
        parseInt(formData.pregnancy_trimester) : null;
      
      const breastfeedingLevel = formData.breastfeeding_level && formData.breastfeeding_level !== 'none' && formData.breastfeeding_level !== '' ? 
        formData.breastfeeding_level : null;
      
      const fastingType = formData.fasting_type && formData.fasting_type !== 'none' && formData.fasting_type !== '' ? 
        formData.fasting_type : null;

      const profileData = {
        // Basic Personal Information
        first_name: formData.first_name?.trim() || null,
        last_name: formData.last_name?.trim() || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        nationality: formData.nationality === "prefer_not_to_say" ? null : formData.nationality?.trim() || null,
        
        // Body Composition
        body_shape: formData.body_shape || null,
        body_fat_percentage: bodyFatValue,
        
        // Fitness Goals & Preferences
        fitness_goal: formData.fitness_goal || null,
        activity_level: mappedActivityLevel,
        
        // Health Information
        health_conditions: formData.health_conditions && formData.health_conditions.length > 0 ? formData.health_conditions : [],
        allergies: formData.allergies && formData.allergies.length > 0 ? formData.allergies : [],
        
        // Dietary Preferences
        preferred_foods: formData.preferred_foods && formData.preferred_foods.length > 0 ? formData.preferred_foods : [],
        dietary_restrictions: formData.dietary_restrictions && formData.dietary_restrictions.length > 0 ? formData.dietary_restrictions : [],
        
        // Special Conditions
        pregnancy_trimester: pregnancyTrimester,
        breastfeeding_level: breastfeedingLevel,
        fasting_type: fastingType,
        special_conditions: formData.special_conditions && formData.special_conditions.length > 0 ? formData.special_conditions : [],
        
        // Completion Status
        onboarding_completed: true,
        ai_generations_remaining: 5
      };

      console.log('Saving complete profile data:', profileData);

      const result = await updateProfile(profileData);
      
      if (result.error) {
        console.error('Profile update failed:', result.error);
        toast.error('Failed to save your profile. Please try again.');
        setIsCompleting(false);
        return;
      }
      
      navigate('/onboarding-success', { replace: true });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsCompleting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <RegisterStep onRegister={handleRegistration} loading={isRegistering} />;
      case 1:
        return <OnboardingStep1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <OnboardingStep2 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <OnboardingStep3 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <OnboardingStep4 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <OnboardingStep5 formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <OnboardingStep6 formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <OnboardingStep7 formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <OnboardingStep8 formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Show email confirmation message if needed
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              We've sent you a confirmation email. Please click the link in the email to verify your account and continue with setup.
            </p>
            
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
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
          step={step + 1} 
          totalSteps={totalSteps} 
          progress={progress} 
        />

        <Card className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[400px] sm:min-h-[500px]">
            {renderStepContent()}
          </div>

          {step > 0 && (
            <ModernOnboardingNavigation
              step={step}
              totalSteps={totalSteps}
              isStepValid={isStepValid()}
              isUpdating={isUpdating || isCompleting}
              canSkip={getStepSkippable()}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default RegisterOnboarding;

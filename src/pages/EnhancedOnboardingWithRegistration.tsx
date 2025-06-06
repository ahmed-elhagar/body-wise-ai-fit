
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { validateOnboardingStep } from "@/utils/onboardingValidation";
import ModernOnboardingHeader from "@/components/onboarding/ModernOnboardingHeader";
import ModernOnboardingNavigation from "@/components/onboarding/ModernOnboardingNavigation";
import EnhancedOnboardingStep1 from "@/components/onboarding/EnhancedOnboardingStep1";
import EnhancedOnboardingStep2 from "@/components/onboarding/EnhancedOnboardingStep2";
import EnhancedOnboardingStep3 from "@/components/onboarding/EnhancedOnboardingStep3";
import EnhancedOnboardingStep4 from "@/components/onboarding/EnhancedOnboardingStep4";

const EnhancedOnboardingWithRegistration = () => {
  const navigate = useNavigate();
  const { user, signUp, loading: authLoading } = useAuth();
  const { updateProfile, isUpdating } = useProfile();
  const [step, setStep] = useState(1);
  const { formData, updateFormData, handleArrayInput } = useOnboardingForm();
  const [isCompleting, setIsCompleting] = useState(false);
  const [registrationData, setRegistrationData] = useState<{email: string, password: string} | null>(null);

  const totalSteps = 5; // Added registration step
  const progress = (step / totalSteps) * 100;

  // Redirect if user is already authenticated and has completed onboarding
  useEffect(() => {
    if (user && !authLoading) {
      // Check if user has completed onboarding
      const checkOnboardingStatus = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        if (profile?.onboarding_completed) {
          navigate('/dashboard', { replace: true });
        }
      };
      
      checkOnboardingStatus();
    }
  }, [user, authLoading, navigate]);

  const isStepValid = (): boolean => {
    if (step === 1) {
      // Registration step validation
      return !!(registrationData?.email && registrationData?.password && registrationData.password.length >= 6);
    }
    return validateOnboardingStep(step - 1, formData); // Adjust for registration step
  };

  const handleNext = async () => {
    console.log('Onboarding - handleNext called, step:', step, 'isStepValid:', isStepValid());
    
    if (!isStepValid()) {
      if (step === 1) {
        toast.error('Please enter a valid email and password (minimum 6 characters)');
      } else {
        toast.error('Please fill in all required fields');
      }
      return;
    }

    if (step === 1) {
      // Handle registration
      if (!registrationData) return;
      
      try {
        setIsCompleting(true);
        console.log('Registering user with email:', registrationData.email);
        
        await signUp(registrationData.email, registrationData.password, {
          first_name: '', // Will be filled in later steps
          last_name: ''
        });
        
        console.log('Registration successful, moving to profile setup');
        setStep(2);
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setIsCompleting(false);
      }
    } else if (step < totalSteps) {
      console.log('Onboarding - Moving to next step:', step + 1);
      setStep(step + 1);
    } else {
      // Final step - complete profile
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
        
        console.log('Onboarding - Profile saved successfully, redirecting to success page');
        
        // Redirect to success page instead of dashboard
        navigate('/onboarding-success', { replace: true });

      } catch (error) {
        console.error('Onboarding - Unexpected error:', error);
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
    if (step < totalSteps && step !== 1) { // Can't skip registration
      setStep(step + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Start your personalized fitness journey with FitFatta</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registrationData?.email || ''}
                  onChange={(e) => setRegistrationData({
                    ...registrationData,
                    email: e.target.value,
                    password: registrationData?.password || ''
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registrationData?.password || ''}
                  onChange={(e) => setRegistrationData({
                    ...registrationData,
                    email: registrationData?.email || '',
                    password: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a secure password (min. 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">What's Next?</h4>
                    <p className="text-sm text-blue-700">
                      After creating your account, we'll guide you through a quick setup to personalize your fitness experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <EnhancedOnboardingStep1 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 3:
        return (
          <EnhancedOnboardingStep2 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <EnhancedOnboardingStep3 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
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
            canSkip={step === 3 || step === 4} // Allow skipping on optional steps, but not registration
          />
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOnboardingWithRegistration;


import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSignupState } from "./hooks/useSignupState";
import { validateSignupStep, validateProfileCompletion } from "@/utils/signupValidation";
import SignupProgress from "./SignupProgress";
import SignupNavigation from "./SignupNavigation";
import AccountCreationStep from "./steps/AccountCreationStep";
import PhysicalInfoStep from "./steps/PhysicalInfoStep";
import BodyCompositionStep from "./steps/BodyCompositionStep";
import GoalsActivityStep from "./steps/GoalsActivityStep";
import HealthInfoStep from "./steps/HealthInfoStep";
import { SIGNUP_STEPS } from "./types";

const NewSignupForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const {
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
  } = useSignupState();

  // Redirect completed users to dashboard
  useEffect(() => {
    if (user && profile?.onboarding_completed === true) {
      console.log('User onboarding completed, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, navigate]);

  // Validation logic - step 1 is always considered valid for UI purposes
  const isStepValid = currentStep === 1 ? true : validateSignupStep(currentStep, formData);
  const currentStepData = SIGNUP_STEPS[currentStep - 1];

  const handleNext = async () => {
    if (currentStep === 1 && !accountCreated) {
      // For step 1, validate before creating account
      const step1Valid = validateSignupStep(currentStep, formData);
      if (!step1Valid) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      const result = await createAccount();
      if (result.success) {
        toast.success("Account created! Please complete your profile.");
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } else {
      // For other steps, validate current step or allow if optional
      const stepValid = validateSignupStep(currentStep, formData);
      if (stepValid || currentStepData?.isOptional) {
        nextStep();
      } else {
        toast.error("Please fill in all required fields");
      }
    }
  };

  const handleComplete = async () => {
    console.log('Attempting to complete profile with data:', formData);
    
    // Validate all required data before completion
    const isValid = validateProfileCompletion(formData);
    if (!isValid) {
      toast.error("Please complete all required fields before finishing");
      return;
    }
    
    const result = await completeProfile();
    if (result.success) {
      toast.success("Profile completed successfully! Welcome to FitGenius!");
      navigate('/welcome', { replace: true });
    } else {
      console.error('Profile completion failed:', result.error);
      toast.error(result.error || "Failed to complete profile setup");
    }
  };

  const handleSkip = () => {
    if (currentStepData?.isOptional) {
      nextStep();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountCreationStep
            formData={formData}
            updateField={updateField}
            onNext={createAccount}
            isLoading={isLoading}
            accountCreated={accountCreated}
          />
        );
      case 2:
        return (
          <PhysicalInfoStep
            formData={formData}
            updateField={updateField}
          />
        );
      case 3:
        return (
          <BodyCompositionStep
            formData={formData}
            updateField={updateField}
          />
        );
      case 4:
        return (
          <GoalsActivityStep
            formData={formData}
            updateField={updateField}
          />
        );
      case 5:
        return (
          <HealthInfoStep
            formData={formData}
            handleArrayInput={handleArrayInput}
            updateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <SignupProgress currentStep={currentStep} />
        
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[500px]">
            {renderCurrentStep()}
          </div>

          {currentStep > 1 && (
            <SignupNavigation
              currentStep={currentStep}
              totalSteps={SIGNUP_STEPS.length}
              isStepValid={isStepValid}
              isLoading={isLoading}
              onBack={prevStep}
              onNext={handleNext}
              onComplete={handleComplete}
              canSkip={currentStepData?.isOptional}
              onSkip={handleSkip}
            />
          )}
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewSignupForm;

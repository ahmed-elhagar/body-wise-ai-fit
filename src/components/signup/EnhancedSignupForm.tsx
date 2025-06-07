
import { useSignupState } from "./hooks/useSignupState";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignupProgress from "./SignupProgress";
import AccountCreationStep from "./steps/AccountCreationStep";
import PhysicalInfoStep from "./steps/PhysicalInfoStep";
import BodyCompositionStep from "./steps/BodyCompositionStep";
import GoalsStep from "./steps/GoalsStep";
import HealthInfoStep from "./steps/HealthInfoStep";
import SignupNavigation from "./SignupNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { SIGNUP_STEPS } from "./types";

const EnhancedSignupForm = () => {
  const navigate = useNavigate();
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

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.password);
      case 2:
        return !!(formData.age && formData.gender && formData.height && formData.weight);
      case 3:
        return !!(formData.bodyFatPercentage);
      case 4:
        return !!(formData.fitnessGoal && formData.activityLevel);
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !accountCreated) {
      const result = await createAccount();
      if (result.success) {
        nextStep();
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } else if (currentStep === 5) {
      const result = await completeProfile();
      if (result.success) {
        toast.success("Profile completed successfully!");
        navigate('/dashboard');
      } else {
        toast.error(result.error || "Failed to complete profile");
      }
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (currentStep === 5) {
      completeProfile().then((result) => {
        if (result.success) {
          toast.success("Profile completed successfully!");
          navigate('/dashboard');
        } else {
          toast.error(result.error || "Failed to complete profile");
        }
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountCreationStep
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
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
          <GoalsStep
            formData={formData}
            updateField={updateField}
          />
        );
      case 5:
        return (
          <HealthInfoStep
            formData={formData}
            updateField={updateField}
            handleArrayInput={handleArrayInput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to FitGenius
          </h1>
          <p className="text-gray-600">
            Let's create your personalized fitness journey
          </p>
        </div>

        <SignupProgress 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        <Card className="mt-8">
          <CardContent className="p-8">
            {renderCurrentStep()}

            {currentStep > 1 && (
              <SignupNavigation
                currentStep={currentStep}
                totalSteps={SIGNUP_STEPS.length}
                isStepValid={validateCurrentStep()}
                isLoading={isLoading}
                onBack={prevStep}
                onNext={handleNext}
                onComplete={handleNext}
                canSkip={currentStep === 5}
                onSkip={handleSkip}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;


import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateStep, getStepTitle, getStepDescription } from "@/utils/signupValidation";
import FlowHeader from "@/components/onboarding/FlowHeader";
import FlowNavigation from "@/components/onboarding/FlowNavigation";
import AccountStep from "@/components/onboarding/steps/AccountStep";
import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep";
import PhysicalStatsStep from "@/components/onboarding/steps/PhysicalStatsStep";
import BodyCompositionStep from "@/components/onboarding/steps/BodyCompositionStep";
import FitnessGoalsStep from "@/components/onboarding/steps/FitnessGoalsStep";
import HealthPreferencesStep from "@/components/onboarding/steps/HealthPreferencesStep";
import LifePhaseStep from "@/components/onboarding/steps/LifePhaseStep";
import { useSignupFlow } from "@/hooks/useSignupFlow";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const SignupFlow = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { formData, updateField, resetForm } = useSignupFlow();

  // Calculate total steps based on gender
  const getTotalSteps = () => {
    if (!formData.gender) return 7;
    return formData.gender === 'female' ? 7 : 6;
  };

  const totalSteps = getTotalSteps();

  // Redirect authenticated users with completed profiles
  useEffect(() => {
    if (!authLoading && user) {
      console.log('SignupFlow - User is authenticated');
    }
  }, [user, authLoading]);

  const isStepValid = (): boolean => {
    return validateStep(step, formData);
  };

  const getStepSkippable = (): boolean => {
    // Steps 6 and 7 are optional/skippable
    return step >= 6;
  };

  const handleNext = async () => {
    if (!isStepValid() && !getStepSkippable()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Skip step 7 for non-females
    if (step === 6 && formData.gender !== 'female') {
      await completeSetup();
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await completeSetup();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      // Skip step 7 for non-females when going back
      if (step === 7 && formData.gender !== 'female') {
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

  const completeSetup = async () => {
    setIsProcessing(true);
    try {
      // First create the user account
      try {
        await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName
        });
      } catch (signupError: any) {
        toast.error(signupError.message || 'Failed to create account');
        return;
      }

      // Map activity level to valid database values
      const activityLevelMapping = {
        'sedentary': 'sedentary',
        'light': 'lightly_active',
        'moderate': 'moderately_active', 
        'active': 'very_active',
        'very_active': 'extremely_active'
      };

      const mappedActivityLevel = activityLevelMapping[formData.activityLevel as keyof typeof activityLevelMapping] || 'moderately_active';

      const pregnancyTrimester = formData.pregnancyTrimester && formData.pregnancyTrimester !== 'none' ? 
        parseInt(formData.pregnancyTrimester) : null;
      
      const breastfeedingLevel = formData.breastfeedingLevel && formData.breastfeedingLevel !== 'none' ? 
        formData.breastfeedingLevel : null;
      
      const fastingType = formData.fastingType && formData.fastingType !== 'none' ? 
        formData.fastingType : null;

      // Map body fat to body shape
      const getBodyShape = (percentage: number, gender: string) => {
        if (gender === 'male') {
          if (percentage < 15) return 'lean';
          if (percentage < 22) return 'average';
          return 'fuller';
        } else {
          if (percentage < 22) return 'lean';
          if (percentage < 30) return 'average';
          return 'fuller';
        }
      };

      const profileData = {
        first_name: formData.firstName?.trim(),
        last_name: formData.lastName?.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        body_shape: getBodyShape(formData.bodyFatPercentage, formData.gender),
        body_fat_percentage: formData.bodyFatPercentage,
        fitness_goal: formData.fitnessGoal,
        activity_level: mappedActivityLevel,
        health_conditions: formData.healthConditions || [],
        allergies: formData.allergies || [],
        dietary_restrictions: formData.dietaryRestrictions || [],
        pregnancy_trimester: pregnancyTrimester,
        breastfeeding_level: breastfeedingLevel,
        fasting_type: fastingType,
        onboarding_completed: true,
        ai_generations_remaining: 5
      };

      // Add a small delay to ensure user is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await updateProfile(profileData);
      
      if (result.error) {
        console.error('Profile update failed:', result.error);
        toast.error('Failed to save your profile. Please try again.');
        return;
      }
      
      toast.success('Welcome to FitGenius! Your account is ready.');
      navigate('/onboarding-success', { replace: true });

    } catch (error) {
      console.error('Setup completion error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <AccountStep 
            formData={formData} 
            updateField={updateField} 
          />
        );
      case 2:
        return (
          <BasicInfoStep 
            formData={formData} 
            updateField={updateField}
          />
        );
      case 3:
        return (
          <PhysicalStatsStep 
            formData={formData}
            updateField={updateField}
          />
        );
      case 4:
        return (
          <BodyCompositionStep 
            formData={formData}
            updateField={updateField}
          />
        );
      case 5:
        return (
          <FitnessGoalsStep 
            formData={formData}
            updateField={updateField}
          />
        );
      case 6:
        return (
          <HealthPreferencesStep 
            formData={formData}
            updateField={updateField}
          />
        );
      case 7:
        return (
          <LifePhaseStep 
            formData={formData}
            updateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Loading"
          description="Please wait..."
          timeout={3000}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <FlowHeader 
          step={step} 
          totalSteps={totalSteps} 
          title={getStepTitle(step)}
          description={getStepDescription(step)}
        />

        <Card className="p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            {renderStepContent()}
          </div>

          <FlowNavigation
            step={step}
            totalSteps={totalSteps}
            isStepValid={isStepValid()}
            isProcessing={isProcessing || isUpdating}
            canSkip={getStepSkippable()}
            onBack={handleBack}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        </Card>
      </div>
    </div>
  );
};

export default SignupFlow;

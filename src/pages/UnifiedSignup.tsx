
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateNewSignupStep, getStepTitle, getStepDescription } from "@/utils/newSignupValidation";
import SignupHeader from "@/components/signup/SignupHeader";
import SignupNavigation from "@/components/signup/SignupNavigation";
import Step1Account from "@/components/signup/steps/Step1Account";
import Step2BasicInfo from "@/components/signup/steps/Step2BasicInfo";
import Step3PhysicalStats from "@/components/signup/steps/Step3PhysicalStats";
import Step4BodyComposition from "@/components/signup/steps/Step4BodyComposition";
import Step5FitnessGoals from "@/components/signup/steps/Step5FitnessGoals";
import Step6HealthPreferences from "@/components/signup/steps/Step6HealthPreferences";
import Step7LifePhase from "@/components/signup/steps/Step7LifePhase";
import { useNewSignupForm } from "@/hooks/useNewSignupForm";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const UnifiedSignup = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { formData, updateFormData, resetForm } = useNewSignupForm();

  // Calculate total steps based on gender
  const getTotalSteps = () => {
    if (!formData.gender) return 7;
    return formData.gender === 'female' ? 7 : 6;
  };

  const totalSteps = getTotalSteps();

  // Redirect authenticated users with completed profiles
  useEffect(() => {
    if (!authLoading && user) {
      console.log('UnifiedSignup - User is authenticated, allowing profile completion');
    }
  }, [user, authLoading]);

  const isStepValid = (): boolean => {
    return validateNewSignupStep(step, formData);
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

    // Handle account creation after step 1
    if (step === 1) {
      await handleSignUp();
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

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSigningUp(true);
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      
      toast.success('Account created! Let\'s complete your profile.');
      setStep(2);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSigningUp(false);
    }
  };

  const completeSetup = async () => {
    if (!user) {
      toast.error('Please create an account first');
      return;
    }

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

      const pregnancyTrimester = formData.pregnancy_trimester && formData.pregnancy_trimester !== 'none' ? 
        parseInt(formData.pregnancy_trimester) : null;
      
      const breastfeedingLevel = formData.breastfeeding_level && formData.breastfeeding_level !== 'none' ? 
        formData.breastfeeding_level : null;
      
      const fastingType = formData.fasting_type && formData.fasting_type !== 'none' ? 
        formData.fasting_type : null;

      const profileData = {
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        body_shape: formData.body_shape,
        body_fat_percentage: formData.body_fat_percentage,
        fitness_goal: formData.fitness_goal,
        activity_level: mappedActivityLevel,
        health_conditions: formData.health_conditions || [],
        allergies: formData.allergies || [],
        dietary_restrictions: formData.dietary_restrictions || [],
        pregnancy_trimester: pregnancyTrimester,
        breastfeeding_level: breastfeedingLevel,
        fasting_type: fastingType,
        onboarding_completed: true,
        ai_generations_remaining: 5
      };

      const result = await updateProfile(profileData);
      
      if (result.error) {
        console.error('Profile update failed:', result.error);
        toast.error('Failed to save your profile. Please try again.');
        return;
      }
      
      toast.success('Welcome to FitFatta! Your profile is ready.');
      navigate('/dashboard', { replace: true });

    } catch (error) {
      console.error('Setup completion error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Account 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <Step2BasicInfo 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Step3PhysicalStats 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Step4BodyComposition 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <Step5FitnessGoals 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <Step6HealthPreferences 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 7:
        return (
          <Step7LifePhase 
            formData={formData}
            updateFormData={updateFormData}
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
        <SignupHeader 
          step={step} 
          totalSteps={totalSteps} 
          title={getStepTitle(step)}
          description={getStepDescription(step)}
        />

        <Card className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[500px] sm:min-h-[600px]">
            {renderStepContent()}
          </div>

          <SignupNavigation
            step={step}
            totalSteps={totalSteps}
            isStepValid={isStepValid()}
            isUpdating={isSigningUp || isUpdating || isCompleting}
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

export default UnifiedSignup;

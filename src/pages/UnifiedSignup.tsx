
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateUnifiedStep } from "@/utils/unifiedValidation";
import UnifiedHeader from "@/components/unified/UnifiedHeader";
import UnifiedNavigation from "@/components/unified/UnifiedNavigation";
import UnifiedStep1 from "@/components/unified/UnifiedStep1";
import UnifiedStep2 from "@/components/unified/UnifiedStep2";
import UnifiedStep3 from "@/components/unified/UnifiedStep3";
import UnifiedStep4 from "@/components/unified/UnifiedStep4";
import UnifiedStep5 from "@/components/unified/UnifiedStep5";
import UnifiedStep6 from "@/components/unified/UnifiedStep6";
import { useUnifiedForm } from "@/hooks/useUnifiedForm";

const UnifiedSignup = () => {
  const navigate = useNavigate();
  const { updateProfile, isUpdating } = useProfile();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { formData, updateFormData, resetForm } = useUnifiedForm();

  // Calculate total steps based on gender
  const getTotalSteps = () => {
    if (!formData.gender) return 6;
    return formData.gender === 'female' ? 6 : 5;
  };

  const totalSteps = getTotalSteps();
  const progress = (step / totalSteps) * 100;

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isStepValid = (): boolean => {
    return validateUnifiedStep(step, formData);
  };

  const getStepSkippable = (): boolean => {
    // Steps 5 and 6 are optional/skippable
    return step >= 5;
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

    // Skip step 6 for non-females
    if (step === 5 && formData.gender !== 'female') {
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
      // Skip step 6 for non-females when going back
      if (step === 6 && formData.gender !== 'female') {
        setStep(5);
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

    setIsSigningUp(true);
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      
      toast.success('Account created! Let\'s set up your profile.');
      setStep(2);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSigningUp(false);
    }
  };

  const completeSetup = async () => {
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

      const bodyFatValue = formData.body_fat_percentage ? 
        (typeof formData.body_fat_percentage === 'string' ? 
          parseFloat(formData.body_fat_percentage) : 
          formData.body_fat_percentage) : null;

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
        body_fat_percentage: bodyFatValue,
        fitness_goal: formData.fitness_goal,
        activity_level: mappedActivityLevel,
        health_conditions: formData.health_conditions || [],
        allergies: formData.allergies || [],
        preferred_foods: formData.preferred_foods || [],
        dietary_restrictions: formData.dietary_restrictions || [],
        pregnancy_trimester: pregnancyTrimester,
        breastfeeding_level: breastfeedingLevel,
        fasting_type: fastingType,
        special_conditions: formData.special_conditions || [],
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
          <UnifiedStep1 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <UnifiedStep2 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <UnifiedStep3 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <UnifiedStep4 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <UnifiedStep5 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <UnifiedStep6 
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
        <UnifiedHeader 
          step={step} 
          totalSteps={totalSteps} 
          progress={progress} 
        />

        <Card className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="min-h-[400px] sm:min-h-[500px]">
            {renderStepContent()}
          </div>

          <UnifiedNavigation
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


import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { validateSignupStep, validateProfileCompletion, mapBodyFatToBodyShape } from "@/utils/signupValidation";
import { useSignupState } from "./hooks/useSignupState";
import SignupProgress from "./SignupProgress";
import SignupNavigation from "./SignupNavigation";

// Step components
import AccountCreationStep from "./steps/AccountCreationStep";
import PhysicalInfoStep from "./steps/PhysicalInfoStep";
import BodyCompositionStep from "./steps/BodyCompositionStep";
import GoalsActivityStep from "./steps/GoalsActivityStep";
import HealthInfoStep from "./steps/HealthInfoStep";

const EnhancedSignupForm = () => {
  const {
    currentStep,
    formData,
    updateField,
    nextStep,
    prevStep,
    setCurrentStep
  } = useSignupState();
  
  const { signup, isLoading } = useSignup();

  const handleNext = () => {
    console.log(`Attempting to move from step ${currentStep} to ${currentStep + 1}`);
    
    if (validateSignupStep(currentStep, formData)) {
      console.log(`✅ Step ${currentStep} validation passed`);
      nextStep();
    } else {
      console.log(`❌ Step ${currentStep} validation failed`);
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handlePrevious = () => {
    console.log(`Moving back from step ${currentStep} to ${currentStep - 1}`);
    prevStep();
  };

  const handleStepClick = (step: number) => {
    console.log(`Direct navigation to step ${step} requested`);
    
    // Allow navigation to any previous step or the next step if current is valid
    if (step <= currentStep || (step === currentStep + 1 && validateSignupStep(currentStep, formData))) {
      console.log(`✅ Navigation to step ${step} allowed`);
      setCurrentStep(step);
    } else {
      console.log(`❌ Navigation to step ${step} blocked - must complete current step first`);
      toast.error("Please complete the current step first");
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting signup submission process');
    console.log('Form data before submission:', formData);
    
    if (!validateProfileCompletion(formData)) {
      console.log('❌ Profile validation failed');
      toast.error("Please complete all required fields");
      return;
    }

    try {
      // Map body fat percentage to body shape
      const bodyShape = mapBodyFatToBodyShape(
        parseFloat(formData.bodyFatPercentage?.toString() || '20'), 
        formData.gender
      );
      
      console.log(`📊 Mapped body shape: ${bodyShape} (from ${formData.bodyFatPercentage}% body fat, ${formData.gender})`);

      // Prepare signup data with proper type conversion
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        bodyFatPercentage: parseFloat(formData.bodyFatPercentage?.toString() || '20'),
        bodyShape,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel,
        healthConditions: formData.healthConditions || [],
        allergies: formData.allergies || [],
        nationality: formData.nationality || 'US'
      };

      console.log('📤 Submitting signup data:', signupData);
      await signup(signupData);
      
    } catch (error) {
      console.error('❌ Signup submission failed:', error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  const renderStep = () => {
    const bodyCompositionProps = {
      formData: {
        height: formData.height,
        weight: formData.weight,
        targetWeight: formData.targetWeight,
        bodyShape: formData.bodyShape,
        bodyFatPercentage: formData.bodyFatPercentage?.toString() || '',
        muscleMass: formData.muscleMass,
        activityLevel: formData.activityLevel
      },
      updateField
    };

    switch (currentStep) {
      case 1:
        return <AccountCreationStep formData={formData} updateField={updateField} />;
      case 2:
        return <PhysicalInfoStep formData={formData} updateField={updateField} />;
      case 3:
        return <BodyCompositionStep {...bodyCompositionProps} />;
      case 4:
        return <GoalsActivityStep formData={formData} updateField={updateField} />;
      case 5:
        return <HealthInfoStep formData={formData} updateField={updateField} />;
      default:
        return <AccountCreationStep formData={formData} updateField={updateField} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <SignupProgress 
          currentStep={currentStep} 
          totalSteps={5}
          onStepClick={handleStepClick}
        />
        
        <Card className="mt-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {renderStep()}
            
            <SignupNavigation
              currentStep={currentStep}
              totalSteps={5}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              canProceed={validateSignupStep(currentStep, formData)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;

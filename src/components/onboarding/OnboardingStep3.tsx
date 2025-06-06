
import { Target } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import UnifiedBodyFatSelector from "./UnifiedBodyFatSelector";
import { useState, useEffect } from "react";

interface OnboardingStep3Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep3 = ({ formData, updateFormData }: OnboardingStep3Props) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(() => {
    const existingValue = formData.body_fat_percentage;
    if (existingValue && !isNaN(parseFloat(existingValue.toString()))) {
      return parseFloat(existingValue.toString());
    }
    return formData.gender === 'male' ? 20 : 25;
  });

  useEffect(() => {
    if (!formData.body_fat_percentage || formData.body_fat_percentage === '') {
      const defaultValue = formData.gender === 'male' ? 20 : 25;
      setBodyFatPercentage(defaultValue);
      updateFormData("body_fat_percentage", defaultValue.toString());
    }
  }, [formData.gender, formData.body_fat_percentage, updateFormData]);

  const handleBodyFatChange = (value: number) => {
    setBodyFatPercentage(value);
    updateFormData("body_fat_percentage", value.toString());
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600 text-sm sm:text-base">Help us understand your current physique</p>
      </div>

      <UnifiedBodyFatSelector
        value={bodyFatPercentage}
        onChange={handleBodyFatChange}
        gender={formData.gender}
      />
    </div>
  );
};

export default OnboardingStep3;

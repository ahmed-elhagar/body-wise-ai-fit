
import { Target } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import UnifiedBodyFatSelector from "./UnifiedBodyFatSelector";
import { useState, useEffect } from "react";

interface EnhancedOnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep2 = ({ formData, updateFormData }: EnhancedOnboardingStep2Props) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(() => {
    // Initialize with form data value or gender-based default
    if (formData.body_fat_percentage && formData.body_fat_percentage !== '') {
      const parsed = parseFloat(formData.body_fat_percentage);
      if (!isNaN(parsed)) return parsed;
    }
    return formData.gender === 'male' ? 20 : 25;
  });

  // Update form data whenever body fat percentage changes
  useEffect(() => {
    console.log('EnhancedOnboardingStep2 - Body fat percentage changed:', bodyFatPercentage);
    updateFormData("body_fat_percentage", bodyFatPercentage.toString());
  }, [bodyFatPercentage, updateFormData]);

  // Sync with form data changes from outside
  useEffect(() => {
    if (formData.body_fat_percentage && formData.body_fat_percentage !== '') {
      const parsed = parseFloat(formData.body_fat_percentage);
      if (!isNaN(parsed) && parsed !== bodyFatPercentage) {
        setBodyFatPercentage(parsed);
      }
    }
  }, [formData.body_fat_percentage]);

  const handleBodyFatChange = (value: number) => {
    console.log('EnhancedOnboardingStep2 - Body fat change handler called with:', value);
    setBodyFatPercentage(value);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Help us understand your current physique</p>
      </div>

      <UnifiedBodyFatSelector
        value={bodyFatPercentage}
        onChange={handleBodyFatChange}
        gender={formData.gender}
      />
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <strong>Debug Info:</strong><br />
          Current Value: {bodyFatPercentage}<br />
          Form Data Value: {formData.body_fat_percentage}<br />
          Gender: {formData.gender}
        </div>
      )}
    </div>
  );
};

export default EnhancedOnboardingStep2;

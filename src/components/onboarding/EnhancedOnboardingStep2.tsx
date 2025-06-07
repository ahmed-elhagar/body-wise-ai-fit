
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
    console.log('🔄 EnhancedOnboardingStep2 - Body fat percentage changed:', bodyFatPercentage);
    const stringValue = bodyFatPercentage.toString();
    console.log('📤 Updating form data with body_fat_percentage:', stringValue);
    updateFormData("body_fat_percentage", stringValue);
  }, [bodyFatPercentage, updateFormData]);

  // Sync with form data changes from outside
  useEffect(() => {
    if (formData.body_fat_percentage && formData.body_fat_percentage !== '') {
      const parsed = parseFloat(formData.body_fat_percentage);
      if (!isNaN(parsed) && parsed !== bodyFatPercentage) {
        console.log('🔄 Syncing body fat from form data:', parsed);
        setBodyFatPercentage(parsed);
      }
    }
  }, [formData.body_fat_percentage]);

  const handleBodyFatChange = (value: number) => {
    console.log('🎯 EnhancedOnboardingStep2 - Body fat change handler called with:', value);
    console.log('🔍 Value type:', typeof value, 'Is number:', !isNaN(value));
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
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm space-y-1">
          <strong>🐛 Debug Info:</strong><br />
          <div>Current Value: {bodyFatPercentage} (type: {typeof bodyFatPercentage})</div>
          <div>Form Data Value: "{formData.body_fat_percentage}" (type: {typeof formData.body_fat_percentage})</div>
          <div>Gender: {formData.gender}</div>
          <div>Is Valid Number: {!isNaN(bodyFatPercentage)}</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOnboardingStep2;

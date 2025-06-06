
import { Target } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import ScrollableBodyShapeSelector from "./ScrollableBodyShapeSelector";
import MotivationSelector from "./MotivationSelector";
import { useState } from "react";

interface EnhancedOnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep2 = ({ formData, updateFormData }: EnhancedOnboardingStep2Props) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(
    formData.gender === 'male' ? 20 : 25
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your body & motivation</h2>
        <p className="text-gray-600">Help us understand your current state and goals</p>
      </div>

      <ScrollableBodyShapeSelector
        value={formData.body_shape}
        onChange={(value) => updateFormData("body_shape", value)}
        bodyFatValue={bodyFatPercentage}
        onBodyFatChange={setBodyFatPercentage}
        gender={formData.gender}
      />

      <div className="border-t pt-8">
        <MotivationSelector
          value={formData.preferred_foods} // Using this field temporarily for motivations
          onChange={(value) => updateFormData("preferred_foods", value)}
        />
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep2;

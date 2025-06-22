
import { Target } from "lucide-react";
import BodyShapeSelector from "@/features/profile/components/BodyShapeSelector";
import { SignupFormData } from "../types";
import { mapBodyFatToBodyShape } from "@/utils/signupValidation";
import { useEffect } from "react";

interface BodyCompositionStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const BodyCompositionStep = ({ formData, updateField }: BodyCompositionStepProps) => {
  // Ensure there's always a default value
  const currentBodyFat = formData.bodyFatPercentage || (formData.gender === 'male' ? 20 : 25);
  
  const handleBodyFatChange = (value: number) => {
    console.log('Body fat percentage changed to:', value);
    updateField("bodyFatPercentage", value);
    
    // Auto-update body shape based on fat percentage
    const autoBodyShape = mapBodyFatToBodyShape(value, formData.gender || 'male');
    updateField("bodyShape", autoBodyShape);
  };

  // Auto-set body shape when component mounts or gender changes
  useEffect(() => {
    if (formData.bodyFatPercentage && formData.gender) {
      const autoBodyShape = mapBodyFatToBodyShape(formData.bodyFatPercentage, formData.gender);
      updateField("bodyShape", autoBodyShape);
    }
  }, [formData.gender, updateField]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Select your current body fat percentage to help us create your personalized plan</p>
      </div>

      <div className="space-y-6">
        <BodyShapeSelector
          value={currentBodyFat}
          onChange={handleBodyFatChange}
          gender={formData.gender || 'male'}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't worry if you're not sure - you can always adjust this later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default BodyCompositionStep;

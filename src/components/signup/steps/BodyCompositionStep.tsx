
import { Target } from "lucide-react";
import BodyShapeSelector from "@/components/auth/BodyShapeSelector";
import { SignupFormData } from "../types";

interface BodyCompositionStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const BodyCompositionStep = ({ formData, updateField }: BodyCompositionStepProps) => {
  const handleBodyFatChange = (value: string) => {
    // Convert string to number when updating the form data
    updateField("bodyFatPercentage", parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Select your current body type</p>
      </div>

      <BodyShapeSelector
        value={formData.bodyFatPercentage?.toString() || ""}
        onChange={handleBodyFatChange}
        gender={formData.gender}
      />
    </div>
  );
};

export default BodyCompositionStep;

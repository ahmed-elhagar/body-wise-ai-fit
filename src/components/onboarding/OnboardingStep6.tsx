
import { Shield } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import HealthIssuesSelector from "./HealthIssuesSelector";

interface OnboardingStep6Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep6 = ({ formData, updateFormData }: OnboardingStep6Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Health Information</h2>
        <p className="text-gray-600 text-sm sm:text-base">Help us create safer recommendations</p>
        <div className="inline-flex items-center gap-2 mt-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Optional</span>
        </div>
      </div>

      <div className="px-4">
        <HealthIssuesSelector
          value={formData.health_conditions}
          onChange={(value) => updateFormData("health_conditions", value)}
        />
      </div>
    </div>
  );
};

export default OnboardingStep6;

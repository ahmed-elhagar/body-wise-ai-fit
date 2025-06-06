
import { Heart } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import ActivityLevelSelector from "./ActivityLevelSelector";

interface OnboardingStep5Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep5 = ({ formData, updateFormData }: OnboardingStep5Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Activity Level</h2>
        <p className="text-gray-600 text-sm sm:text-base">How active are you currently?</p>
      </div>

      <div className="px-4">
        <ActivityLevelSelector
          value={formData.activity_level}
          onChange={(value) => updateFormData("activity_level", value)}
        />
      </div>
    </div>
  );
};

export default OnboardingStep5;

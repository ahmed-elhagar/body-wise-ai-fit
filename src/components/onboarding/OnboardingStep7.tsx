
import { Baby } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import SpecialConditionsSelector from "./SpecialConditionsSelector";

interface OnboardingStep7Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep7 = ({ formData, updateFormData }: OnboardingStep7Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl mb-4 shadow-lg">
          <Baby className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Special Conditions</h2>
        <p className="text-gray-600 text-sm sm:text-base">Any special health considerations? (Optional)</p>
      </div>

      <div className="px-4">
        <SpecialConditionsSelector
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>
    </div>
  );
};

export default OnboardingStep7;

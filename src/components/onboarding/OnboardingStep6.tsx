
import { Utensils } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import DietaryRestrictionsSelector from "./DietaryRestrictionsSelector";
import NationalitySelector from "./NationalitySelector";

interface OnboardingStep6Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep6 = ({ formData, updateFormData }: OnboardingStep6Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Dietary Preferences</h2>
        <p className="text-gray-600 text-sm sm:text-base">Tell us about your food preferences and restrictions</p>
      </div>

      <div className="space-y-6 px-4">
        <DietaryRestrictionsSelector
          value={formData.dietary_restrictions}
          onChange={(value) => updateFormData("dietary_restrictions", value)}
        />
        
        <NationalitySelector
          value={formData.nationality}
          onChange={(value) => updateFormData("nationality", value)}
        />
      </div>
    </div>
  );
};

export default OnboardingStep6;

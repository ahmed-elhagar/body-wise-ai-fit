
import { Target, User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import BodyFatSlider from "./BodyFatSlider";
import EnhancedMotivationSelector from "./EnhancedMotivationSelector";

interface EnhancedOnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep2 = ({ formData, updateFormData }: EnhancedOnboardingStep2Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Body & Motivation</h2>
        <p className="text-gray-600 text-sm md:text-base">Help us understand your current state and what drives you</p>
      </div>

      {/* Body Fat Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">Current Body Composition *</h3>
        </div>
        <BodyFatSlider
          value={formData.body_fat_percentage ? parseInt(formData.body_fat_percentage) : 25}
          onChange={(value) => updateFormData("body_fat_percentage", value.toString())}
          gender={formData.gender}
        />
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">What Motivates You?</h3>
        </div>
        <EnhancedMotivationSelector
          value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods : []}
          onChange={(value) => updateFormData("preferred_foods", value)}
        />
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep2;

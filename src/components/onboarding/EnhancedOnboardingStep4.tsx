
import { CheckCircle } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import FitnessProfileSummary from "./FitnessProfileSummary";

interface EnhancedOnboardingStep4Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const EnhancedOnboardingStep4 = ({ formData }: EnhancedOnboardingStep4Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your personalized profile is ready!</h2>
        <p className="text-gray-600">Review your fitness profile summary</p>
      </div>

      <FitnessProfileSummary formData={formData} />

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-green-600 mb-2">
          <CheckCircle className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {formData.first_name}, your personalized fitness plan is ready!
        </h3>
        <p className="text-green-700 text-sm">
          Based on your profile, we'll create customized meal plans and exercise routines just for you.
        </p>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep4;

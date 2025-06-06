
import { Activity } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GoalBodyTypeSelector from "./GoalBodyTypeSelector";

interface OnboardingStep4Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const OnboardingStep4 = ({ formData, updateFormData }: OnboardingStep4Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Fitness Goals</h2>
        <p className="text-gray-600 text-sm sm:text-base">What do you want to achieve?</p>
      </div>

      <div className="px-4">
        <GoalBodyTypeSelector
          value={formData.fitness_goal}
          onChange={(value) => updateFormData("fitness_goal", value)}
        />
      </div>
    </div>
  );
};

export default OnboardingStep4;

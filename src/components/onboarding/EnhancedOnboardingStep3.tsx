
import { Activity } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GoalBodyTypeSelector from "./GoalBodyTypeSelector";
import HealthIssuesSelector from "./HealthIssuesSelector";
import ActivityLevelSelector from "./ActivityLevelSelector";

interface EnhancedOnboardingStep3Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep3 = ({ formData, updateFormData }: EnhancedOnboardingStep3Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Health</h2>
        <p className="text-gray-600">Define your targets and current condition</p>
      </div>

      <GoalBodyTypeSelector
        value={formData.fitness_goal}
        onChange={(value) => updateFormData("fitness_goal", value)}
      />

      <div className="border-t pt-8">
        <HealthIssuesSelector
          value={formData.health_conditions}
          onChange={(value) => updateFormData("health_conditions", value)}
        />
      </div>

      <div className="border-t pt-8">
        <ActivityLevelSelector
          value={formData.activity_level}
          onChange={(value) => updateFormData("activity_level", value)}
        />
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;

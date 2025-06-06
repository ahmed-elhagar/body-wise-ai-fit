
import { Heart, Activity, Clipboard } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GoalBodyTypeSelector from "./GoalBodyTypeSelector";
import ActivityLevelSelector from "./ActivityLevelSelector";
import HealthConditionsAutocomplete from "./HealthConditionsAutocomplete";

interface EnhancedOnboardingStep3Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep3 = ({ formData, updateFormData }: EnhancedOnboardingStep3Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Health</h2>
        <p className="text-gray-600">Tell us about your fitness goals and health</p>
      </div>

      <div className="space-y-8">
        {/* Fitness Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">What's your main fitness goal?</h3>
          </div>
          <GoalBodyTypeSelector
            value={formData.fitness_goal}
            onChange={(value) => updateFormData("fitness_goal", value)}
          />
        </div>

        {/* Activity Level Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">How active are you currently?</h3>
          </div>
          <ActivityLevelSelector
            value={formData.activity_level}
            onChange={(value) => updateFormData("activity_level", value)}
          />
        </div>

        {/* Health Conditions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clipboard className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Health Information</h3>
          </div>
          <HealthConditionsAutocomplete
            value={formData.health_conditions}
            onChange={(value) => updateFormData("health_conditions", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;

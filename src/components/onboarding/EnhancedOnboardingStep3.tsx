
import { Activity, Heart, AlertTriangle } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GoalBodyTypeSelector from "./GoalBodyTypeSelector";
import HealthIssuesSelector from "./HealthIssuesSelector";
import ActivityLevelSelector from "./ActivityLevelSelector";
import HealthNotesSection from "./HealthNotesSection";

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
        <p className="text-gray-600">Define your targets and current health status</p>
      </div>

      <GoalBodyTypeSelector
        value={formData.fitness_goal}
        onChange={(value) => updateFormData("fitness_goal", value)}
      />

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Activity Level</h3>
        </div>
        <ActivityLevelSelector
          value={formData.activity_level}
          onChange={(value) => updateFormData("activity_level", value)}
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-800">Health Information</h3>
        </div>
        
        <div className="space-y-6">
          <HealthIssuesSelector
            value={formData.health_conditions}
            onChange={(value) => updateFormData("health_conditions", value)}
          />
          
          <HealthNotesSection
            value={formData.health_notes || ''}
            onChange={(value) => updateFormData("health_notes", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;


import { Activity, Heart, AlertTriangle, Shield } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import GoalBodyTypeSelector from "./GoalBodyTypeSelector";
import HealthIssuesSelector from "./HealthIssuesSelector";
import ActivityLevelSelector from "./ActivityLevelSelector";
import HealthNotesSection from "./HealthNotesSection";
import SpecialConditionsSelector from "./SpecialConditionsSelector";

interface EnhancedOnboardingStep3Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep3 = ({ formData, updateFormData }: EnhancedOnboardingStep3Props) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Goals & Health Profile</h2>
        <p className="text-gray-600 text-sm sm:text-base">Define your targets and comprehensive health status</p>
      </div>

      {/* Fitness Goals Section - Mobile responsive */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200 mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Fitness Goals</h3>
        </div>
        <GoalBodyTypeSelector
          value={formData.fitness_goal}
          onChange={(value) => updateFormData("fitness_goal", value)}
        />
      </div>

      {/* Activity Level Section - Mobile responsive */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200 mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-green-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Activity Level</h3>
        </div>
        <ActivityLevelSelector
          value={formData.activity_level}
          onChange={(value) => updateFormData("activity_level", value)}
        />
      </div>

      {/* Health Information Section - Mobile responsive */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-200 mx-4">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Health Information</h3>
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

      {/* Special Conditions Section - Mobile responsive */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200 mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Special Conditions</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Optional</span>
        </div>
        <SpecialConditionsSelector
          formData={formData}
          updateFormData={updateFormData}
        />
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;

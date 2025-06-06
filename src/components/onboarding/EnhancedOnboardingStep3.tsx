
import { Activity, Target, Heart, Zap, TrendingUp } from "lucide-react";
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
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Goals & Health</h2>
        <p className="text-gray-600 text-sm md:text-base">Define your targets and current condition</p>
      </div>

      {/* Fitness Goal Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 md:p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Your Fitness Goal *</h3>
            <p className="text-sm text-gray-600">What do you want to achieve?</p>
          </div>
        </div>
        <GoalBodyTypeSelector
          value={formData.fitness_goal}
          onChange={(value) => updateFormData("fitness_goal", value)}
        />
      </div>

      {/* Activity Level Section */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 md:p-6 border border-orange-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Activity Level *</h3>
            <p className="text-sm text-gray-600">How active are you currently?</p>
          </div>
        </div>
        <ActivityLevelSelector
          value={formData.activity_level}
          onChange={(value) => updateFormData("activity_level", value)}
        />
      </div>

      {/* Health Conditions Section */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 md:p-6 border border-red-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Health Conditions</h3>
            <p className="text-sm text-gray-600">Optional - helps us create safer recommendations</p>
          </div>
        </div>
        <HealthIssuesSelector
          value={formData.health_conditions}
          onChange={(value) => updateFormData("health_conditions", value)}
        />
      </div>

      {/* Progress Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-800 mb-1">Personalized Recommendations</h4>
            <p className="text-sm text-indigo-700">Your goals and activity level help us create workout plans and meal recommendations that match your fitness level and aspirations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;

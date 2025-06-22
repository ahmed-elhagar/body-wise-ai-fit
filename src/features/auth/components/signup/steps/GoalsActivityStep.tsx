
import { CheckCircle } from "lucide-react";
import GoalBodyTypeSelector from "@/features/profile/components/onboarding/GoalBodyTypeSelector";
import ActivityLevelSelector from "@/features/profile/components/onboarding/ActivityLevelSelector";
import { SignupFormData } from "../types";

interface GoalsActivityStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const GoalsActivityStep = ({ formData, updateField }: GoalsActivityStepProps) => {
  const isValid = !!(formData.fitnessGoal && formData.activityLevel);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
        <p className="text-gray-600">Tell us about your fitness goals</p>
      </div>

      <GoalBodyTypeSelector
        value={formData.fitnessGoal}
        onChange={(value) => updateField("fitnessGoal", value)}
      />

      <ActivityLevelSelector
        value={formData.activityLevel}
        onChange={(value) => updateField("activityLevel", value)}
      />

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          Please select both your fitness goal and activity level
        </div>
      )}
    </div>
  );
};

export default GoalsActivityStep;

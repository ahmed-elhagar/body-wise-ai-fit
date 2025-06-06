
import { Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface FitnessGoalsStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string) => void;
}

const FitnessGoalsStep = ({ formData, updateField }: FitnessGoalsStepProps) => {
  const fitnessGoals = [
    { id: 'weight_loss', label: 'Lose Weight', emoji: '📉', description: 'Reduce body weight and fat' },
    { id: 'muscle_gain', label: 'Build Muscle', emoji: '💪', description: 'Increase muscle mass and strength' },
    { id: 'maintain', label: 'Maintain', emoji: '⚖️', description: 'Keep current weight and fitness' },
    { id: 'endurance', label: 'Improve Endurance', emoji: '🏃', description: 'Better cardiovascular fitness' },
    { id: 'strength', label: 'Get Stronger', emoji: '🏋️', description: 'Increase overall strength' },
    { id: 'tone', label: 'Tone Up', emoji: '✨', description: 'Define and sculpt muscles' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', emoji: '🛋️' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', emoji: '🚶' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', emoji: '🏃' },
    { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', emoji: '💪' },
    { id: 'very_active', label: 'Extremely Active', description: 'Very hard exercise, physical job', emoji: '🏋️' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Define your fitness objectives</p>
      </div>

      <div className="space-y-8">
        {/* Fitness Goals */}
        <div className="space-y-4">
          <Label className="text-base sm:text-lg font-semibold text-gray-800">What's your main fitness goal?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fitnessGoals.map((goal) => (
              <Button
                key={goal.id}
                type="button"
                variant={formData.fitnessGoal === goal.id ? "default" : "outline"}
                className={`h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 ${
                  formData.fitnessGoal === goal.id ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600' : ''
                }`}
                onClick={() => updateField("fitnessGoal", goal.id)}
              >
                <span className="text-lg sm:text-2xl">{goal.emoji}</span>
                <div className="text-center">
                  <div className="font-medium text-xs sm:text-sm">{goal.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{goal.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-4">
          <Label className="text-base sm:text-lg font-semibold text-gray-800">How active are you currently?</Label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <Button
                key={level.id}
                type="button"
                variant={formData.activityLevel === level.id ? "default" : "outline"}
                className={`w-full h-auto p-3 sm:p-4 flex justify-between items-center ${
                  formData.activityLevel === level.id ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600' : ''
                }`}
                onClick={() => updateField("activityLevel", level.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg sm:text-xl">{level.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base">{level.label}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{level.description}</div>
                  </div>
                </div>
                {formData.activityLevel === level.id && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessGoalsStep;

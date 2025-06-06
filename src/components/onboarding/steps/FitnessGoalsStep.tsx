
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
    { id: 'weight_loss', label: 'Lose Weight', emoji: '📉', description: 'Reduce body weight and fat', color: 'from-red-500 to-red-600' },
    { id: 'muscle_gain', label: 'Build Muscle', emoji: '💪', description: 'Increase muscle mass and strength', color: 'from-orange-500 to-orange-600' },
    { id: 'maintain', label: 'Maintain', emoji: '⚖️', description: 'Keep current weight and fitness', color: 'from-green-500 to-green-600' },
    { id: 'endurance', label: 'Improve Endurance', emoji: '🏃', description: 'Better cardiovascular fitness', color: 'from-blue-500 to-blue-600' },
    { id: 'strength', label: 'Get Stronger', emoji: '🏋️', description: 'Increase overall strength', color: 'from-purple-500 to-purple-600' },
    { id: 'tone', label: 'Tone Up', emoji: '✨', description: 'Define and sculpt muscles', color: 'from-pink-500 to-pink-600' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', emoji: '🛋️', color: 'from-gray-500 to-gray-600' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', emoji: '🚶', color: 'from-blue-400 to-blue-500' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', emoji: '🏃', color: 'from-green-500 to-green-600' },
    { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', emoji: '💪', color: 'from-orange-500 to-orange-600' },
    { id: 'very_active', label: 'Extremely Active', description: 'Very hard exercise, physical job', emoji: '🏋️', color: 'from-red-500 to-red-600' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
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
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-200 ${
                  formData.fitnessGoal === goal.id 
                    ? `bg-gradient-to-r ${goal.color} text-white border-0 shadow-lg transform scale-105` 
                    : 'hover:shadow-md hover:scale-102 border-2 border-gray-200 bg-white'
                }`}
                onClick={() => updateField("fitnessGoal", goal.id)}
              >
                <span className="text-2xl">{goal.emoji}</span>
                <div className="text-center">
                  <div className="font-medium text-sm">{goal.label}</div>
                  <div className={`text-xs ${formData.fitnessGoal === goal.id ? 'text-white/90' : 'text-gray-500'} hidden sm:block`}>
                    {goal.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-4">
          <Label className="text-base sm:text-lg font-semibold text-gray-800">How active are you currently?</Label>
          <div className="space-y-3">
            {activityLevels.map((level) => (
              <Button
                key={level.id}
                type="button"
                variant="outline"
                className={`w-full h-auto p-4 flex justify-between items-center transition-all duration-200 ${
                  formData.activityLevel === level.id 
                    ? `bg-gradient-to-r ${level.color} text-white border-0 shadow-lg` 
                    : 'hover:shadow-md border-2 border-gray-200 bg-white'
                }`}
                onClick={() => updateField("activityLevel", level.id)}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium text-base">{level.label}</div>
                    <div className={`text-sm ${formData.activityLevel === level.id ? 'text-white/90' : 'text-gray-500'}`}>
                      {level.description}
                    </div>
                  </div>
                </div>
                {formData.activityLevel === level.id && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-current" fill="currentColor" viewBox="0 0 20 20">
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

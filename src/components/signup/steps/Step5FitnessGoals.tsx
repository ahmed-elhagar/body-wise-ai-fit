
import { Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

interface Step5FitnessGoalsProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string) => void;
}

const Step5FitnessGoals = ({ formData, updateFormData }: Step5FitnessGoalsProps) => {
  const fitnessGoals = [
    { id: 'weight_loss', label: 'Lose Weight', emoji: '📉', description: 'Reduce body weight and fat' },
    { id: 'muscle_gain', label: 'Build Muscle', emoji: '💪', description: 'Increase muscle mass and strength' },
    { id: 'maintain', label: 'Maintain', emoji: '⚖️', description: 'Keep current weight and fitness' },
    { id: 'endurance', label: 'Improve Endurance', emoji: '🏃', description: 'Better cardiovascular fitness' },
    { id: 'strength', label: 'Get Stronger', emoji: '🏋️', description: 'Increase overall strength' },
    { id: 'tone', label: 'Tone Up', emoji: '✨', description: 'Define and sculpt muscles' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'very_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Fitness Goals */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">What's your main fitness goal?</Label>
          <div className="grid grid-cols-2 gap-3">
            {fitnessGoals.map((goal) => (
              <Button
                key={goal.id}
                type="button"
                variant={formData.fitness_goal === goal.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                  formData.fitness_goal === goal.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("fitness_goal", goal.id)}
              >
                <span className="text-2xl">{goal.emoji}</span>
                <div className="text-center">
                  <div className="font-medium text-sm">{goal.label}</div>
                  <div className="text-xs text-gray-500">{goal.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">How active are you currently?</Label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <Button
                key={level.id}
                type="button"
                variant={formData.activity_level === level.id ? "default" : "outline"}
                className={`w-full h-auto p-4 flex justify-between items-center ${
                  formData.activity_level === level.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("activity_level", level.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-500">{level.description}</div>
                </div>
                {formData.activity_level === level.id && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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

export default Step5FitnessGoals;

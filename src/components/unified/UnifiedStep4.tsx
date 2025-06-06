
import { Target, Activity } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UnifiedFormData } from "@/hooks/useUnifiedForm";

interface UnifiedStep4Props {
  formData: UnifiedFormData;
  updateFormData: (field: string, value: string) => void;
}

const UnifiedStep4 = ({ formData, updateFormData }: UnifiedStep4Props) => {
  const fitnessGoals = [
    { id: 'lose_weight', label: 'Lose Weight', icon: '🎯', description: 'Burn fat and get leaner' },
    { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪', description: 'Build strength and size' },
    { id: 'maintain_fitness', label: 'Stay Fit', icon: '⚖️', description: 'Maintain current fitness' },
    { id: 'improve_endurance', label: 'Improve Endurance', icon: '🏃', description: 'Boost cardiovascular fitness' },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Desk job, little exercise' },
    { id: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'very_active', label: 'Extremely Active', description: 'Physical job + exercise' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
        <p className="text-gray-600">What do you want to achieve?</p>
      </div>

      <div className="space-y-8">
        {/* Fitness Goals */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Primary Fitness Goal
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fitnessGoals.map((goal) => (
              <Button
                key={goal.id}
                type="button"
                variant={formData.fitness_goal === goal.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-start text-left ${
                  formData.fitness_goal === goal.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("fitness_goal", goal.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{goal.icon}</span>
                  <span className="font-semibold">{goal.label}</span>
                </div>
                <span className="text-sm text-gray-600">{goal.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Current Activity Level
          </Label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <Button
                key={level.id}
                type="button"
                variant={formData.activity_level === level.id ? "default" : "outline"}
                className={`w-full h-auto p-4 flex items-center justify-between text-left ${
                  formData.activity_level === level.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("activity_level", level.id)}
              >
                <div>
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                </div>
                {formData.activity_level === level.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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

export default UnifiedStep4;

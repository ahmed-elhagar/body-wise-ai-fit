
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedOnboardingStep3Props {
  formData: any;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep3 = ({ formData, updateFormData }: EnhancedOnboardingStep3Props) => {
  const fitnessGoals = [
    { id: 'lose_weight', label: 'Lose Weight', icon: '📉', description: 'Burn fat and reduce body weight' },
    { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪', description: 'Build lean muscle mass' },
    { id: 'get_toned', label: 'Get Toned', icon: '✨', description: 'Define and sculpt your body' },
    { id: 'improve_endurance', label: 'Improve Endurance', icon: '🏃', description: 'Boost cardiovascular fitness' },
    { id: 'increase_strength', label: 'Increase Strength', icon: '🏋️', description: 'Build raw power and strength' },
    { id: 'maintain_fitness', label: 'Maintain Fitness', icon: '⚖️', description: 'Stay in current shape' }
  ];

  const healthIssues = [
    { id: 'no_issues', label: 'No Health Issues', icon: '✅' },
    { id: 'sensitive_back', label: 'Sensitive Back', icon: '🦴' },
    { id: 'sensitive_knees', label: 'Sensitive Knees', icon: '🦵' },
    { id: 'heart_condition', label: 'Heart Condition', icon: '❤️' },
    { id: 'diabetes', label: 'Diabetes', icon: '🩺' },
    { id: 'high_blood_pressure', label: 'High Blood Pressure', icon: '📈' },
    { id: 'other', label: 'Other', icon: '📋' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { id: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { id: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, training 2x/day' }
  ];

  const selectedHealthIssues = formData.health_conditions || [];

  const toggleHealthIssue = (issueId: string) => {
    const current = selectedHealthIssues;
    
    // If selecting "No Health Issues", clear all other selections
    if (issueId === 'no_issues') {
      updateFormData('health_conditions', ['no_issues']);
      return;
    }
    
    // If selecting any specific issue, remove "No Health Issues"
    let updated = current.filter((id: string) => id !== 'no_issues');
    
    if (updated.includes(issueId)) {
      updated = updated.filter((id: string) => id !== issueId);
    } else {
      updated = [...updated, issueId];
    }
    
    updateFormData('health_conditions', updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Health</h2>
        <p className="text-gray-600">What do you want to achieve and any health considerations?</p>
      </div>

      {/* Fitness Goals */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Primary Fitness Goal *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fitnessGoals.map((goal) => (
            <Button
              key={goal.id}
              type="button"
              variant="outline"
              data-testid={`goal-${goal.id}`}
              onClick={() => updateFormData('fitness_goal', goal.id)}
              className={`h-auto p-4 text-left border-2 transition-all duration-200 ${
                formData.fitness_goal === goal.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{goal.icon}</span>
                <div>
                  <div className="font-semibold">{goal.label}</div>
                  <div className="text-sm opacity-70">{goal.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Health Issues */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Health Considerations
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {healthIssues.map((issue) => (
            <Button
              key={issue.id}
              type="button"
              variant="outline"
              data-testid={`health-issue-${issue.id}`}
              onClick={() => toggleHealthIssue(issue.id)}
              className={`h-auto p-3 flex flex-col items-center space-y-1 border-2 transition-all duration-200 ${
                selectedHealthIssues.includes(issue.id)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{issue.icon}</span>
              <span className="text-xs font-medium text-center">{issue.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <Label className="text-lg font-semibold text-gray-800 mb-4 block">
          Current Activity Level *
        </Label>
        <Select value={formData.activity_level} onValueChange={(value) => updateFormData('activity_level', value)}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select your current activity level" />
          </SelectTrigger>
          <SelectContent>
            {activityLevels.map((level) => (
              <SelectItem key={level.id} value={level.id} data-testid={`activity-level-${level.id}`}>
                <div className="py-2">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-500">{level.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep3;

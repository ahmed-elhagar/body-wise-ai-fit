
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface FitnessProfileSummaryProps {
  formData: OnboardingFormData;
}

const FitnessProfileSummary = ({ formData }: FitnessProfileSummaryProps) => {
  const calculateBMI = (height: string, weight: string) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = w / ((h / 100) ** 2);
      return bmi.toFixed(1);
    }
    return "N/A";
  };

  const getBMICategory = (bmi: string) => {
    if (bmi === "N/A") return "Unknown";
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const formatGender = (gender: string) => {
    return gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : gender || 'Not specified';
  };

  const formatBodyShape = (shape: string) => {
    const shapes: { [key: string]: string } = {
      'slender': 'Slender',
      'average': 'Average',
      'heavy': 'Heavy'
    };
    return shapes[shape] || shape || 'Not specified';
  };

  const formatGoal = (goal: string) => {
    const goals: { [key: string]: string } = {
      'slim': 'Slim & Toned',
      'fit': 'Fit & Athletic',
      'muscular': 'Muscular',
      'bodybuilding': 'Bodybuilding'
    };
    return goals[goal] || goal || 'Not specified';
  };

  const formatActivity = (activity: string) => {
    const activities: { [key: string]: string } = {
      'sedentary': 'Mostly Sitting',
      'lightly_active': 'Active During Breaks',
      'very_active': 'On Feet All Day'
    };
    return activities[activity] || activity || 'Not specified';
  };

  const bmi = calculateBMI(formData.height || '0', formData.weight || '0');
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <p className="font-medium">{formData.first_name} {formData.last_name}</p>
          </div>
          <div>
            <span className="text-gray-600">Age:</span>
            <p className="font-medium">{formData.age || 'Not specified'}</p>
          </div>
          <div>
            <span className="text-gray-600">Gender:</span>
            <p className="font-medium">{formatGender(formData.gender)}</p>
          </div>
          <div>
            <span className="text-gray-600">Nationality:</span>
            <p className="font-medium">{formData.nationality === 'prefer_not_to_say' ? 'Prefer not to say' : formData.nationality || 'Not specified'}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Profile</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Height:</span>
            <p className="font-medium">{formData.height || 'Not specified'} cm</p>
          </div>
          <div>
            <span className="text-gray-600">Weight:</span>
            <p className="font-medium">{formData.weight || 'Not specified'} kg</p>
          </div>
          <div>
            <span className="text-gray-600">BMI:</span>
            <div className="flex items-center gap-2">
              <p className="font-medium">{bmi}</p>
              <Badge variant={bmiCategory === 'Normal' ? 'default' : 'secondary'} className="text-xs">
                {bmiCategory}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-gray-600">Body Shape:</span>
            <p className="font-medium">{formatBodyShape(formData.body_shape)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Activity</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Fitness Goal:</span>
            <p className="font-medium">{formatGoal(formData.fitness_goal)}</p>
          </div>
          <div>
            <span className="text-gray-600">Activity Level:</span>
            <p className="font-medium">{formatActivity(formData.activity_level)}</p>
          </div>
          {formData.health_conditions && formData.health_conditions.length > 0 && formData.health_conditions[0] !== 'no_issues' && (
            <div>
              <span className="text-gray-600">Health Considerations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.health_conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {formData.preferred_foods && formData.preferred_foods.length > 0 && (
            <div>
              <span className="text-gray-600">Motivations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.preferred_foods.map((motivation, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {motivation.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FitnessProfileSummary;

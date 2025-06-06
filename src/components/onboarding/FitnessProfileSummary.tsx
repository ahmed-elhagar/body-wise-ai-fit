
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Target, Activity, Heart } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface FitnessProfileSummaryProps {
  formData: OnboardingFormData;
}

const FitnessProfileSummary = ({ formData }: FitnessProfileSummaryProps) => {
  const getActivityLevelLabel = (level: string) => {
    const levels = {
      sedentary: 'Sedentary',
      light: 'Lightly Active',
      moderate: 'Moderately Active',
      very_active: 'Very Active'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getFitnessGoalLabel = (goal: string) => {
    const goals = {
      lose_weight: 'Lose Weight',
      gain_muscle: 'Build Muscle',
      maintain: 'Stay Healthy',
      endurance: 'Build Endurance'
    };
    return goals[goal as keyof typeof goals] || goal;
  };

  const getGenderLabel = (gender: string) => {
    const genders = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
      prefer_not_to_say: 'Prefer not to say'
    };
    return genders[gender as keyof typeof genders] || gender;
  };

  const getBodyShapeLabel = (shape: string) => {
    const shapes = {
      lean: 'Lean',
      athletic: 'Athletic',
      average: 'Average',
      curvy: 'Curvy',
      heavy: 'Heavy'
    };
    return shapes[shape as keyof typeof shapes] || shape;
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData.first_name} {formData.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{formData.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{getGenderLabel(formData.gender)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{formData.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{formData.weight} kg</span>
              </div>
              {formData.body_shape && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Shape:</span>
                  <span className="font-medium">{getBodyShapeLabel(formData.body_shape)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Goals & Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Goals & Activity</h3>
            </div>
            
            <div className="space-y-3">
              {formData.fitness_goal && (
                <div>
                  <span className="text-gray-600 text-sm">Fitness Goal:</span>
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    {getFitnessGoalLabel(formData.fitness_goal)}
                  </Badge>
                </div>
              )}
              
              {formData.activity_level && (
                <div>
                  <span className="text-gray-600 text-sm">Activity Level:</span>
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    {getActivityLevelLabel(formData.activity_level)}
                  </Badge>
                </div>
              )}

              {formData.health_conditions && (
                <div>
                  <span className="text-gray-600 text-sm">Health Notes:</span>
                  <p className="text-sm text-gray-700 mt-1 p-2 bg-yellow-50 rounded">
                    {formData.health_conditions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FitnessProfileSummary;


import { Card } from "@/components/ui/card";
import { User, Target, Activity, Heart } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface FitnessProfileSummaryProps {
  formData: OnboardingFormData;
}

const FitnessProfileSummary = ({ formData }: FitnessProfileSummaryProps) => {
  const bmi = formData.height && formData.weight 
    ? (parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-gray-800">Personal Info</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Name:</span> {formData.first_name} {formData.last_name}</div>
            <div><span className="text-gray-600">Age:</span> {formData.age} years</div>
            <div><span className="text-gray-600">Gender:</span> {formData.gender}</div>
            {formData.nationality && formData.nationality !== 'prefer_not_to_say' && (
              <div><span className="text-gray-600">Nationality:</span> {formData.nationality}</div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-gray-800">Physical Stats</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-600">Height:</span> {formData.height} cm</div>
            <div><span className="text-gray-600">Weight:</span> {formData.weight} kg</div>
            {bmi && <div><span className="text-gray-600">BMI:</span> {bmi}</div>}
            {formData.body_shape && (
              <div><span className="text-gray-600">Body Shape:</span> {formData.body_shape}</div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-purple-500" />
            <h4 className="font-medium text-gray-800">Fitness Goals</h4>
          </div>
          <div className="space-y-2 text-sm">
            {formData.fitness_goal && (
              <div><span className="text-gray-600">Goal:</span> {formData.fitness_goal}</div>
            )}
            {formData.activity_level && (
              <div><span className="text-gray-600">Activity Level:</span> {formData.activity_level}</div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h4 className="font-medium text-gray-800">Health & Preferences</h4>
          </div>
          <div className="space-y-2 text-sm">
            {formData.health_conditions && formData.health_conditions.length > 0 && (
              <div>
                <span className="text-gray-600">Health Conditions:</span> 
                {formData.health_conditions.join(', ')}
              </div>
            )}
            {formData.preferred_foods && formData.preferred_foods.length > 0 && (
              <div>
                <span className="text-gray-600">Motivations:</span> 
                {formData.preferred_foods.join(', ')}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FitnessProfileSummary;

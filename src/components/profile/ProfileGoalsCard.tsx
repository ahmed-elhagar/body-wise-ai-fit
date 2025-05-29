
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Activity, Heart } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  onEdit: () => void;
}

const ProfileGoalsCard = ({ formData, onEdit }: ProfileGoalsCardProps) => {
  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'sedentary': return 'bg-red-100 text-red-800';
      case 'lightly_active': return 'bg-yellow-100 text-yellow-800';
      case 'moderately_active': return 'bg-blue-100 text-blue-800';
      case 'very_active': return 'bg-green-100 text-green-800';
      case 'extremely_active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFitnessGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'bg-red-100 text-red-800';
      case 'muscle_gain': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'endurance': return 'bg-purple-100 text-purple-800';
      case 'weight_gain': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Health & Goals</h3>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Goals
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals & Activity */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Goals & Activity</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fitness Goal:</span>
              {formData.fitness_goal ? (
                <Badge className={getFitnessGoalColor(formData.fitness_goal)}>
                  {formData.fitness_goal.replace('_', ' ')}
                </Badge>
              ) : (
                <span className="text-gray-400">Not set</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Activity Level:</span>
              {formData.activity_level ? (
                <Badge className={getActivityLevelColor(formData.activity_level)}>
                  {formData.activity_level.replace('_', ' ')}
                </Badge>
              ) : (
                <span className="text-gray-400">Not set</span>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Health Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 block mb-1">Health Conditions:</span>
              <div className="flex flex-wrap gap-1">
                {formData.health_conditions && formData.health_conditions.length > 0 ? (
                  formData.health_conditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">None specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600 block mb-1">Allergies:</span>
              <div className="flex flex-wrap gap-1">
                {formData.allergies && formData.allergies.length > 0 ? (
                  formData.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferred Foods */}
      {formData.preferred_foods && formData.preferred_foods.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3">Preferred Foods</h4>
          <div className="flex flex-wrap gap-2">
            {formData.preferred_foods.map((food: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {food}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileGoalsCard;

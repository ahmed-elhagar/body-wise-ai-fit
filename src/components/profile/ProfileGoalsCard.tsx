
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Utensils, Activity } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  onEdit: () => void;
}

const ProfileGoalsCard = ({ formData, onEdit }: ProfileGoalsCardProps) => {
  const getFitnessGoalColor = (goal: string) => {
    switch (goal?.toLowerCase()) {
      case 'weight_loss': return 'bg-red-100 text-red-800';
      case 'muscle_gain': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-green-100 text-green-800';
      case 'endurance': return 'bg-purple-100 text-purple-800';
      case 'strength': return 'bg-orange-100 text-orange-800';
      case 'flexibility': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'sedentary': return 'bg-red-100 text-red-800';
      case 'lightly_active': return 'bg-yellow-100 text-yellow-800';
      case 'moderately_active': return 'bg-blue-100 text-blue-800';
      case 'very_active': return 'bg-green-100 text-green-800';
      case 'extremely_active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatGoalText = (goal: string) => {
    return goal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set';
  };

  const formatActivityText = (level: string) => {
    return level?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not set';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Goals & Preferences
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Goals
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fitness Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Fitness Goals
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Primary Goal:</span>
                <Badge className={getFitnessGoalColor(formData.fitness_goal)}>
                  {formatGoalText(formData.fitness_goal)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Activity Level:</span>
                <Badge className={getActivityLevelColor(formData.activity_level)}>
                  {formatActivityText(formData.activity_level)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Dietary Preferences
            </h4>
            <div className="space-y-2">
              {formData.preferred_foods?.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500">Preferred Foods:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.preferred_foods.slice(0, 3).map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {food}
                      </Badge>
                    ))}
                    {formData.preferred_foods.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{formData.preferred_foods.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No preferred foods set</p>
              )}

              {formData.dietary_restrictions?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Dietary Restrictions:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.dietary_restrictions.map((restriction: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comprehensive Goals Summary */}
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800">Your Personalized Plan</h4>
          <p className="text-sm text-blue-700">
            Based on your {formatGoalText(formData.fitness_goal).toLowerCase()} goal and {formatActivityText(formData.activity_level).toLowerCase()} lifestyle, 
            our AI will create customized meal plans and workout routines tailored specifically for you.
          </p>
          {(formData.health_conditions?.length > 0 || formData.allergies?.length > 0) && (
            <p className="text-sm text-blue-600">
              Your health considerations and dietary restrictions have been noted for safe, personalized recommendations.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;

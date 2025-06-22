
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Activity, Utensils } from "lucide-react";

interface ProfileGoalsCardProps {
  profile?: any;
  formData?: any;
  updateFormData?: (field: string, value: any) => void;
  handleArrayInput?: (field: string, value: string) => void;
  saveGoalsAndActivity?: () => Promise<boolean>;
  isUpdating?: boolean;
  validationErrors?: Record<string, string>;
  onUpdate?: () => void;
}

const ProfileGoalsCard = ({ 
  profile, 
  formData, 
  updateFormData, 
  handleArrayInput, 
  saveGoalsAndActivity, 
  isUpdating, 
  validationErrors,
  onUpdate 
}: ProfileGoalsCardProps) => {
  // Use formData if available (edit mode), otherwise use profile (display mode)
  const data = formData || profile;
  
  if (!data) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-600" />
            Goals & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No goals data available</p>
        </CardContent>
      </Card>
    );
  }

  const getFitnessGoalInfo = (goal: string) => {
    const goals = {
      'weight_loss': { label: 'Weight Loss', color: 'bg-red-100 text-red-800', icon: '🔥' },
      'muscle_gain': { label: 'Muscle Gain', color: 'bg-blue-100 text-blue-800', icon: '💪' },
      'maintenance': { label: 'Maintenance', color: 'bg-green-100 text-green-800', icon: '⚖️' },
      'endurance': { label: 'Endurance', color: 'bg-purple-100 text-purple-800', icon: '🏃' },
      'strength': { label: 'Strength', color: 'bg-orange-100 text-orange-800', icon: '🏋️' },
      'flexibility': { label: 'Flexibility', color: 'bg-pink-100 text-pink-800', icon: '🧘' },
    };
    return goals[goal?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const getActivityLevelInfo = (level: string) => {
    const levels = {
      'sedentary': { label: 'Sedentary', color: 'bg-red-100 text-red-800', icon: '🪑' },
      'lightly_active': { label: 'Lightly Active', color: 'bg-yellow-100 text-yellow-800', icon: '🚶' },
      'moderately_active': { label: 'Moderately Active', color: 'bg-blue-100 text-blue-800', icon: '🏃' },
      'very_active': { label: 'Very Active', color: 'bg-green-100 text-green-800', icon: '🏋️' },
      'extremely_active': { label: 'Extremely Active', color: 'bg-purple-100 text-purple-800', icon: '💯' },
    };
    return levels[level?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800', icon: '❓' };
  };

  const fitnessGoal = getFitnessGoalInfo(data.fitness_goal);
  const activityLevel = getActivityLevelInfo(data.activity_level);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-purple-600" />
          Goals & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Fitness Journey
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{fitnessGoal.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">Primary Goal</p>
                  <Badge className={fitnessGoal.color}>
                    {fitnessGoal.label}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{activityLevel.icon}</span>
                <div>
                  <p className="text-xs text-gray-500">Activity Level</p>
                  <Badge className={activityLevel.color}>
                    {activityLevel.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {(data.preferred_foods?.length > 0 || data.dietary_restrictions?.length > 0) && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-green-600" />
                Nutrition Profile
              </h4>
              
              {data.preferred_foods?.length > 0 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Preferred Foods</p>
                  <div className="flex flex-wrap gap-1">
                    {data.preferred_foods.slice(0, 3).map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-100 text-green-700">
                        {food}
                      </Badge>
                    ))}
                    {data.preferred_foods.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                        +{data.preferred_foods.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {data.dietary_restrictions?.length > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Dietary Restrictions</p>
                  <div className="flex flex-wrap gap-1">
                    {data.dietary_restrictions.map((restriction: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;

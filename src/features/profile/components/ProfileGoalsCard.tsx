
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Utensils, Activity, Brain, Sparkles } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsCard = ({ formData }: ProfileGoalsCardProps) => {
  const getFitnessGoalInfo = (goal: string) => {
    const goals = {
      'weight_loss': { label: 'Weight Loss', color: 'bg-red-100 text-red-800 border-red-200', icon: '🔥' },
      'muscle_gain': { label: 'Muscle Gain', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '💪' },
      'maintenance': { label: 'Maintenance', color: 'bg-green-100 text-green-800 border-green-200', icon: '⚖️' },
      'endurance': { label: 'Endurance', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🏃' },
      'strength': { label: 'Strength', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🏋️' },
      'flexibility': { label: 'Flexibility', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '🧘' },
    };
    return goals[goal?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓' };
  };

  const getActivityLevelInfo = (level: string) => {
    const levels = {
      'sedentary': { label: 'Sedentary', color: 'bg-red-100 text-red-800 border-red-200', icon: '🪑' },
      'lightly_active': { label: 'Lightly Active', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🚶' },
      'moderately_active': { label: 'Moderately Active', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🏃' },
      'very_active': { label: 'Very Active', color: 'bg-green-100 text-green-800 border-green-200', icon: '🏋️' },
      'extremely_active': { label: 'Extremely Active', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '💯' },
    };
    return levels[level?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓' };
  };

  const fitnessGoal = getFitnessGoalInfo(formData.fitness_goal);
  const activityLevel = getActivityLevelInfo(formData.activity_level);

  return (
    <Card className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            Goals & Preferences
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Fitness Journey
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{fitnessGoal.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500">Primary Goal</p>
                    <Badge className={`${fitnessGoal.color} border font-medium`}>
                      {fitnessGoal.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{activityLevel.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500">Activity Level</p>
                    <Badge className={`${activityLevel.color} border font-medium`}>
                      {activityLevel.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-green-600" />
              Nutrition Profile
            </h4>
            <div className="space-y-3">
              {formData.preferred_foods?.length > 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Preferred Foods</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.preferred_foods.slice(0, 4).map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {food}
                      </Badge>
                    ))}
                    {formData.preferred_foods.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        +{formData.preferred_foods.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">No food preferences set</p>
                  <p className="text-xs text-gray-400">Add your favorite foods</p>
                </div>
              )}

              {formData.dietary_restrictions?.length > 0 && (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Dietary Restrictions</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.dietary_restrictions.map((restriction: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-blue-800">AI Personalization</h4>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Our AI is crafting a personalized experience based on your {fitnessGoal.label.toLowerCase()} goal 
                and {activityLevel.label.toLowerCase()} lifestyle.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <div className="text-lg">🍽️</div>
                  <div className="text-xs text-blue-600 font-medium">Custom Meals</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <div className="text-lg">💪</div>
                  <div className="text-xs text-blue-600 font-medium">Smart Workouts</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                  <div className="text-lg">📊</div>
                  <div className="text-xs text-blue-600 font-medium">Progress Tracking</div>
                </div>
              </div>
              {(formData.health_conditions?.length > 0 || formData.allergies?.length > 0) && (
                <p className="text-xs text-blue-600 mt-3 p-2 bg-blue-100/50 rounded">
                  ✓ Health considerations and dietary restrictions have been noted for safe recommendations
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;

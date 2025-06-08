
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Edit, Save, X, Activity, Brain, Sparkles } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsCard = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors,
}: ProfileGoalsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const success = await saveGoalsAndActivity();
    if (success) {
      setIsEditing(false);
    }
  };

  const getFitnessGoalInfo = (goal: string) => {
    const goals = {
      'weight_loss': { label: 'Weight Loss', color: 'bg-red-100 text-red-800 border-red-200', icon: '🔥', description: 'Lose weight healthily' },
      'muscle_gain': { label: 'Muscle Gain', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '💪', description: 'Build lean muscle' },
      'maintenance': { label: 'Maintenance', color: 'bg-green-100 text-green-800 border-green-200', icon: '⚖️', description: 'Maintain current weight' },
      'endurance': { label: 'Endurance', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🏃', description: 'Improve stamina' },
      'strength': { label: 'Strength', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🏋️', description: 'Build strength' },
    };
    return goals[goal?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓', description: 'Set your goal' };
  };

  const getActivityLevelInfo = (level: string) => {
    const levels = {
      'sedentary': { label: 'Sedentary', color: 'bg-red-100 text-red-800 border-red-200', icon: '🪑', description: 'Little to no exercise' },
      'lightly_active': { label: 'Lightly Active', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🚶', description: 'Light exercise 1-3 days/week' },
      'moderately_active': { label: 'Moderately Active', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🏃', description: 'Moderate exercise 3-5 days/week' },
      'very_active': { label: 'Very Active', color: 'bg-green-100 text-green-800 border-green-200', icon: '🏋️', description: 'Hard exercise 6-7 days/week' },
      'extremely_active': { label: 'Extremely Active', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '💯', description: 'Very hard exercise, physical job' },
    };
    return levels[level?.toLowerCase()] || { label: 'Not set', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓', description: 'Set your activity level' };
  };

  const fitnessGoal = getFitnessGoalInfo(formData.fitness_goal);
  const activityLevel = getActivityLevelInfo(formData.activity_level);

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20">
      <CardHeader className="bg-gradient-to-r from-green-600/5 to-emerald-600/5 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Goals & Activity
              </span>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Your fitness journey and lifestyle preferences
              </p>
            </div>
          </CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50 border-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="hover:bg-green-50 border-green-200 text-green-600 hover:text-green-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Goals
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fitness_goal" className="text-sm font-medium text-gray-700">
                  Fitness Goal <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.fitness_goal || undefined} onValueChange={(value) => updateFormData('fitness_goal', value)}>
                  <SelectTrigger className={`transition-all ${validationErrors.fitness_goal ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}>
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">🔥 Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">💪 Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">⚖️ Maintenance</SelectItem>
                    <SelectItem value="endurance">🏃 Endurance</SelectItem>
                    <SelectItem value="strength">🏋️ Strength</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.fitness_goal && (
                  <p className="text-sm text-red-500">{validationErrors.fitness_goal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_level" className="text-sm font-medium text-gray-700">
                  Activity Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.activity_level || undefined} onValueChange={(value) => updateFormData('activity_level', value)}>
                  <SelectTrigger className={`transition-all ${validationErrors.activity_level ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">🪑 Sedentary</SelectItem>
                    <SelectItem value="lightly_active">🚶 Lightly Active</SelectItem>
                    <SelectItem value="moderately_active">🏃 Moderately Active</SelectItem>
                    <SelectItem value="very_active">🏋️ Very Active</SelectItem>
                    <SelectItem value="extremely_active">💯 Extremely Active</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.activity_level && (
                  <p className="text-sm text-red-500">{validationErrors.activity_level}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_foods" className="text-sm font-medium text-gray-700">Preferred Foods</Label>
              <Textarea
                id="preferred_foods"
                value={formData.preferred_foods?.join(', ') || ''}
                onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
                placeholder="Enter your preferred foods, separated by commas (e.g., chicken, rice, vegetables)"
                rows={3}
                className="transition-all focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietary_restrictions" className="text-sm font-medium text-gray-700">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={formData.dietary_restrictions?.join(', ') || ''}
                onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
                placeholder="Enter any dietary restrictions, separated by commas (e.g., vegetarian, no nuts)"
                rows={3}
                className="transition-all focus:border-green-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goals Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-white/80 to-green-50/80 rounded-2xl border border-gray-100/50 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{fitnessGoal.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Fitness Goal</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${fitnessGoal.color} border`}>
                      {fitnessGoal.label}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{fitnessGoal.description}</p>
              </div>

              <div className="p-6 bg-gradient-to-r from-white/80 to-blue-50/80 rounded-2xl border border-gray-100/50 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{activityLevel.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Activity Level</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${activityLevel.color} border`}>
                      {activityLevel.label}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{activityLevel.description}</p>
              </div>
            </div>

            {/* Preferences Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Preferred Foods
                </h4>
                {formData.preferred_foods?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferred_foods.slice(0, 6).map((food: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-200">
                        {food}
                      </span>
                    ))}
                    {formData.preferred_foods.length > 6 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border border-gray-200">
                        +{formData.preferred_foods.length - 6} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No preferences set</p>
                )}
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-600" />
                  Dietary Restrictions
                </h4>
                {formData.dietary_restrictions?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.dietary_restrictions.map((restriction: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm border border-orange-200">
                        {restriction}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No restrictions</p>
                )}
              </div>
            </div>

            {/* AI Personalization Summary */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    AI Personalization Active
                    <Activity className="w-4 h-4 text-green-600" />
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Based on your {fitnessGoal.label.toLowerCase()} goal and {activityLevel.label.toLowerCase()} lifestyle, 
                    our AI creates perfectly tailored recommendations.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 text-center">
                      <div className="text-lg">🍽️</div>
                      <div className="text-xs text-green-600 font-medium">Custom Meals</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 text-center">
                      <div className="text-lg">💪</div>
                      <div className="text-xs text-green-600 font-medium">Smart Workouts</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 text-center">
                      <div className="text-lg">📊</div>
                      <div className="text-xs text-green-600 font-medium">Progress Tracking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save, Edit, Utensils, Activity, Brain, Sparkles } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsCard = ({ 
  formData, 
  handleArrayInput,
  saveGoalsAndActivity, 
  isUpdating, 
  validationErrors 
}: ProfileGoalsCardProps) => {
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
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          Goals & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fitness_goal" className="text-sm font-medium">Fitness Goal</Label>
              <Select value={formData.fitness_goal || undefined} onValueChange={(value) => formData.fitness_goal = value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                  <SelectItem value="endurance">Improve Endurance</SelectItem>
                  <SelectItem value="strength">Build Strength</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.fitness_goal && (
                <p className="text-sm text-red-600">{validationErrors.fitness_goal}</p>
              )}
            </div>
            <div>
              <Label htmlFor="activity_level" className="text-sm font-medium">Activity Level</Label>
              <Select value={formData.activity_level || undefined} onValueChange={(value) => formData.activity_level = value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                  <SelectItem value="extremely_active">Extremely Active</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.activity_level && (
                <p className="text-sm text-red-600">{validationErrors.activity_level}</p>
              )}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferred_foods" className="text-sm font-medium">Preferred Foods</Label>
              <Textarea
                id="preferred_foods"
                value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods.join(', ') : ''}
                onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
                placeholder="Foods you enjoy eating"
                rows={3}
                className="mt-1"
              />
              {validationErrors.preferred_foods && (
                <p className="text-sm text-red-600">{validationErrors.preferred_foods}</p>
              )}
            </div>
            <div>
              <Label htmlFor="dietary_restrictions" className="text-sm font-medium">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions.join(', ') : ''}
                onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
                placeholder="Any dietary restrictions or preferences"
                rows={2}
                className="mt-1"
              />
              {validationErrors.dietary_restrictions && (
                <p className="text-sm text-red-600">{validationErrors.dietary_restrictions}</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Personalization Summary */}
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
            </div>
          </div>
        </div>

        <Button 
          onClick={saveGoalsAndActivity} 
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isUpdating ? 'Saving Goals...' : 'Save Goals & Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Save, X, Activity, Heart } from "lucide-react";

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

  return (
    <Card className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            Fitness Goals & Preferences
          </CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="hover:bg-purple-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Goals
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fitness_goal">Fitness Goal</Label>
                <Select value={formData.fitness_goal || ''} onValueChange={(value) => updateFormData('fitness_goal', value)}>
                  <SelectTrigger className={validationErrors.fitness_goal ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="flexibility">Improve Flexibility</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.fitness_goal && (
                  <p className="text-sm text-red-500">{validationErrors.fitness_goal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_level">Activity Level</Label>
                <Select value={formData.activity_level || ''} onValueChange={(value) => updateFormData('activity_level', value)}>
                  <SelectTrigger className={validationErrors.activity_level ? 'border-red-500' : ''}>
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
                  <p className="text-sm text-red-500">{validationErrors.activity_level}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferred_foods">Preferred Foods</Label>
                <Textarea
                  id="preferred_foods"
                  value={formData.preferred_foods?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
                  placeholder="e.g., Chicken, Rice, Vegetables"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                <Textarea
                  id="dietary_restrictions"
                  value={formData.dietary_restrictions?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
                  placeholder="e.g., Vegetarian, Gluten-free"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fitness Goals Display */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Fitness Journey
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Primary Goal</p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                    {formData.fitness_goal?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Not set'}
                  </Badge>
                </div>
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Activity Level</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                    {formData.activity_level?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Not set'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dietary Preferences Display */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;

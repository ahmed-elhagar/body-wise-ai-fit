
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Edit, Save, X } from "lucide-react";

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
    <Card className="bg-gradient-to-br from-white via-green-50/20 to-emerald-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            Goals & Activity
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
                className="bg-green-600 hover:bg-green-700"
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
              className="hover:bg-green-50"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fitness_goal">Fitness Goal</Label>
                <Select value={formData.fitness_goal || undefined} onValueChange={(value) => updateFormData('fitness_goal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.fitness_goal && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.fitness_goal}</p>
                )}
              </div>

              <div>
                <Label htmlFor="activity_level">Activity Level</Label>
                <Select value={formData.activity_level || undefined} onValueChange={(value) => updateFormData('activity_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
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
                  <p className="text-sm text-red-500 mt-1">{validationErrors.activity_level}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="preferred_foods">Preferred Foods</Label>
              <Textarea
                id="preferred_foods"
                value={formData.preferred_foods?.join(', ') || ''}
                onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
                placeholder="Enter your preferred foods, separated by commas"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={formData.dietary_restrictions?.join(', ') || ''}
                onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
                placeholder="Enter any dietary restrictions, separated by commas"
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Fitness Goal</p>
                <p className="font-medium text-gray-900 capitalize">
                  {formData.fitness_goal?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Activity Level</p>
                <p className="font-medium text-gray-900 capitalize">
                  {formData.activity_level?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Preferred Foods</p>
                {formData.preferred_foods?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {formData.preferred_foods.slice(0, 3).map((food: string, index: number) => (
                      <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {food}
                      </span>
                    ))}
                    {formData.preferred_foods.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{formData.preferred_foods.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">None specified</p>
                )}
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Dietary Restrictions</p>
                {formData.dietary_restrictions?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {formData.dietary_restrictions.slice(0, 3).map((restriction: string, index: number) => (
                      <span key={index} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {restriction}
                      </span>
                    ))}
                    {formData.dietary_restrictions.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{formData.dietary_restrictions.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">None specified</p>
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

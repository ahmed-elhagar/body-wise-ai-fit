
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TagsAutocomplete from "../../TagsAutocomplete";

interface ProfileGoalsCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const FOOD_SUGGESTIONS = [
  "Chicken", "Fish", "Beef", "Turkey", "Salmon", "Tuna", "Eggs", 
  "Rice", "Quinoa", "Oats", "Sweet Potato", "Brown Rice", "Pasta",
  "Broccoli", "Spinach", "Kale", "Carrots", "Bell Peppers", "Tomatoes",
  "Almonds", "Walnuts", "Peanut Butter", "Avocado", "Olive Oil",
  "Greek Yogurt", "Cottage Cheese", "Milk", "Cheese", "Beans"
];

const DIETARY_RESTRICTIONS = [
  "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free",
  "Nut-free", "Soy-free", "Egg-free", "Shellfish-free", "Keto",
  "Paleo", "Low-carb", "Low-fat", "Mediterranean", "Halal", "Kosher"
];

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

  const handlePreferredFoodsChange = (foods: string[]) => {
    updateFormData('preferred_foods', foods);
  };

  const handleDietaryRestrictionsChange = (restrictions: string[]) => {
    updateFormData('dietary_restrictions', restrictions);
  };

  return (
    <Card className="bg-gradient-to-br from-white via-green-50/20 to-emerald-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitness_goal">Fitness Goal</Label>
                <Select value={formData.fitness_goal || ''} onValueChange={(value) => updateFormData('fitness_goal', value)}>
                  <SelectTrigger className={validationErrors.fitness_goal ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
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
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (Light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (Moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (Hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (Very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.activity_level && (
                  <p className="text-sm text-red-500">{validationErrors.activity_level}</p>
                )}
              </div>
            </div>

            <TagsAutocomplete
              label="Preferred Foods"
              selectedTags={formData.preferred_foods || []}
              onTagsChange={handlePreferredFoodsChange}
              placeholder="Type foods you enjoy..."
              suggestions={FOOD_SUGGESTIONS}
            />

            <TagsAutocomplete
              label="Dietary Restrictions"
              selectedTags={formData.dietary_restrictions || []}
              onTagsChange={handleDietaryRestrictionsChange}
              placeholder="Type dietary restrictions..."
              suggestions={DIETARY_RESTRICTIONS}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goals Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-medium">Fitness Goal</p>
                <div className="text-lg font-semibold text-gray-800 capitalize">
                  {formData.fitness_goal?.replace('_', ' ') || 'Not set'}
                </div>
              </div>
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-medium">Activity Level</p>
                <div className="text-lg font-semibold text-gray-800 capitalize">
                  {formData.activity_level?.replace('_', ' ') || 'Not set'}
                </div>
              </div>
            </div>

            {/* Food Preferences */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formData.preferred_foods?.length > 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Preferred Foods</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.preferred_foods.map((food: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">No preferred foods specified</p>
                </div>
              )}

              {formData.dietary_restrictions?.length > 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Dietary Restrictions</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.dietary_restrictions.map((restriction: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm text-gray-500">No dietary restrictions specified</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileGoalsCard;

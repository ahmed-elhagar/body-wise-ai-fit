
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EnhancedGoalsFormProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  onSave: () => void;
  isUpdating: boolean;
}

const EnhancedGoalsForm = ({
  formData,
  updateFormData,
  handleArrayInput,
  onSave,
  isUpdating,
}: EnhancedGoalsFormProps) => {
  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Help us understand your fitness goals and preferences
        </p>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Fitness Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fitness_goal">Primary Fitness Goal *</Label>
            <Select 
              value={formData.fitness_goal}
              onValueChange={(value) => updateFormData("fitness_goal", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                <SelectItem value="endurance">Improve Endurance</SelectItem>
                <SelectItem value="weight_gain">Weight Gain</SelectItem>
                <SelectItem value="strength">Build Strength</SelectItem>
                <SelectItem value="flexibility">Improve Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="activity_level">Current Activity Level *</Label>
            <Select 
              value={formData.activity_level}
              onValueChange={(value) => updateFormData("activity_level", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extremely_active">Extremely Active (2x per day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Health Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="health_conditions">Health Conditions (Optional)</Label>
            <Textarea
              id="health_conditions"
              value={formData.health_conditions.join(', ')}
              onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
              placeholder="Any health conditions, injuries, or medical considerations (comma-separated)"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="allergies">Food Allergies (Optional)</Label>
            <Textarea
              id="allergies"
              value={formData.allergies.join(', ')}
              onChange={(e) => handleArrayInput("allergies", e.target.value)}
              placeholder="e.g., nuts, dairy, gluten (comma-separated)"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        {/* Nutrition Preferences */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="preferred_foods">Preferred Foods (Optional)</Label>
            <Textarea
              id="preferred_foods"
              value={formData.preferred_foods.join(', ')}
              onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
              placeholder="Foods you enjoy eating (comma-separated)"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="dietary_restrictions">Dietary Restrictions (Optional)</Label>
            <Textarea
              id="dietary_restrictions"
              value={formData.dietary_restrictions.join(', ')}
              onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
              placeholder="e.g., vegetarian, vegan, keto (comma-separated)"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={onSave}
            disabled={isUpdating}
            className="bg-fitness-gradient hover:opacity-90 w-full md:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Goals & Preferences'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedGoalsForm;

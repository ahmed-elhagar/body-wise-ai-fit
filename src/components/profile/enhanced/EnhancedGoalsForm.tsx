
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Target, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnhancedGoalsFormProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  onSave: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors?: Record<string, string>;
}

const EnhancedGoalsForm = ({
  formData,
  updateFormData,
  handleArrayInput,
  onSave,
  isUpdating,
  validationErrors = {},
}: EnhancedGoalsFormProps) => {
  
  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      // Form was saved successfully
    }
  };

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Target className="w-6 h-6 text-fitness-primary mr-2" />
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Goals & Activity</h2>
        </div>
        <p className="text-sm lg:text-base text-gray-600">
          Define your fitness goals and activity preferences
        </p>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Please fix the validation errors below before saving.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 lg:space-y-6">
        {/* Primary Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fitness_goal" className={hasFieldError('fitness_goal') ? 'text-red-600' : ''}>
              Primary Fitness Goal *
            </Label>
            <Select 
              value={formData.fitness_goal || ''} 
              onValueChange={(value) => updateFormData("fitness_goal", value)}
            >
              <SelectTrigger className={`mt-1 ${hasFieldError('fitness_goal') ? 'border-red-300 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Select your primary goal" />
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
            {hasFieldError('fitness_goal') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('fitness_goal')}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="activity_level" className={hasFieldError('activity_level') ? 'text-red-600' : ''}>
              Current Activity Level *
            </Label>
            <Select 
              value={formData.activity_level || ''} 
              onValueChange={(value) => updateFormData("activity_level", value)}
            >
              <SelectTrigger className={`mt-1 ${hasFieldError('activity_level') ? 'border-red-300 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extremely_active">Extremely Active (2x/day or intense training)</SelectItem>
              </SelectContent>
            </Select>
            {hasFieldError('activity_level') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('activity_level')}</p>
            )}
          </div>
        </div>

        {/* Health Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="health_conditions" className="text-sm font-medium">
              Health Conditions
            </Label>
            <Textarea
              id="health_conditions"
              value={Array.isArray(formData.health_conditions) ? formData.health_conditions.join(', ') : ''}
              onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
              placeholder="List any health conditions, injuries, or medical considerations (comma-separated)"
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us create safer, more personalized recommendations
            </p>
          </div>

          <div>
            <Label htmlFor="allergies" className="text-sm font-medium">
              Food Allergies & Restrictions
            </Label>
            <Textarea
              id="allergies"
              value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : ''}
              onChange={(e) => handleArrayInput("allergies", e.target.value)}
              placeholder="List any food allergies or dietary restrictions (comma-separated)"
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              e.g., peanuts, dairy, gluten, vegetarian, vegan
            </p>
          </div>

          <div>
            <Label htmlFor="preferred_foods" className="text-sm font-medium">
              Preferred Foods
            </Label>
            <Textarea
              id="preferred_foods"
              value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods.join(', ') : ''}
              onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
              placeholder="List foods you enjoy and would like to include in your meal plans (comma-separated)"
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us create meal plans you'll actually enjoy
            </p>
          </div>

          <div>
            <Label htmlFor="dietary_restrictions" className="text-sm font-medium">
              Additional Dietary Preferences
            </Label>
            <Textarea
              id="dietary_restrictions"
              value={Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions.join(', ') : ''}
              onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
              placeholder="Any other dietary preferences or restrictions (comma-separated)"
              rows={2}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              e.g., low-sodium, organic, locally-sourced
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save } from "lucide-react";

interface EnhancedGoalsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  onSave: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const EnhancedGoalsForm = ({
  formData,
  updateFormData,
  handleArrayInput,
  onSave,
  isUpdating,
  validationErrors
}: EnhancedGoalsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goals & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fitness_goal">Fitness Goal</Label>
            <Select value={formData.fitness_goal} onValueChange={(value) => updateFormData('fitness_goal', value)}>
              <SelectTrigger>
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
              <p className="text-sm text-red-500 mt-1">{validationErrors.fitness_goal}</p>
            )}
          </div>

          <div>
            <Label htmlFor="activity_level">Activity Level</Label>
            <Select value={formData.activity_level} onValueChange={(value) => updateFormData('activity_level', value)}>
              <SelectTrigger>
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
              <p className="text-sm text-red-500 mt-1">{validationErrors.activity_level}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="health_conditions">Health Conditions</Label>
          <Textarea
            id="health_conditions"
            value={formData.health_conditions?.join(', ') || ''}
            onChange={(e) => handleArrayInput('health_conditions', e.target.value)}
            placeholder="Enter any health conditions, separated by commas"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies?.join(', ') || ''}
            onChange={(e) => handleArrayInput('allergies', e.target.value)}
            placeholder="Enter any allergies, separated by commas"
            rows={3}
          />
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

        <Button 
          onClick={onSave} 
          disabled={isUpdating}
          className="w-full md:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Goals & Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalsForm;

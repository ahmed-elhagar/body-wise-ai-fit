
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

interface HealthGoalsCardProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const HealthGoalsCard = ({ formData, updateFormData, handleArrayInput }: HealthGoalsCardProps) => {
  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center mb-4 sm:mb-6">
        <Target className="w-5 h-5 text-fitness-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Health & Goals</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fitness_goal" className="text-sm font-medium">Fitness Goal</Label>
          <Select value={formData.fitness_goal || undefined} onValueChange={(value) => updateFormData("fitness_goal", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              <SelectItem value="maintenance">Weight Maintenance</SelectItem>
              <SelectItem value="endurance">Improve Endurance</SelectItem>
              <SelectItem value="weight_gain">Weight Gain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="activity_level" className="text-sm font-medium">Activity Level</Label>
          <Select value={formData.activity_level || undefined} onValueChange={(value) => updateFormData("activity_level", value)}>
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
        </div>
        <div>
          <Label htmlFor="health_conditions" className="text-sm font-medium">Health Conditions</Label>
          <Textarea
            id="health_conditions"
            value={Array.isArray(formData.health_conditions) ? formData.health_conditions.join(', ') : ''}
            onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
            placeholder="Any health conditions or medical considerations"
            rows={3}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="allergies" className="text-sm font-medium">Allergies</Label>
          <Textarea
            id="allergies"
            value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : ''}
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
            placeholder="Any food allergies or dietary restrictions"
            rows={2}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="preferred_foods" className="text-sm font-medium">Preferred Foods</Label>
          <Textarea
            id="preferred_foods"
            value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods.join(', ') : ''}
            onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
            placeholder="Foods you enjoy eating"
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};

export default HealthGoalsCard;

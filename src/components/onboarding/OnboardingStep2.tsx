
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface OnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
}

const OnboardingStep2 = ({ formData, updateFormData, handleArrayInput }: OnboardingStep2Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Goals & Activity</h2>
        <p className="text-gray-600">Help us understand your fitness goals</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fitness_goal">Primary Fitness Goal *</Label>
          <Select 
            value={formData.fitness_goal}
            onValueChange={(value) => updateFormData("fitness_goal", value)} 
            required
          >
            <SelectTrigger>
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
          <Label htmlFor="activity_level">Current Activity Level *</Label>
          <Select 
            value={formData.activity_level}
            onValueChange={(value) => updateFormData("activity_level", value)} 
            required
          >
            <SelectTrigger>
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

        <div>
          <Label htmlFor="health_conditions">Health Conditions (Optional)</Label>
          <Textarea
            id="health_conditions"
            value={formData.health_conditions.join(', ')}
            placeholder="Any health conditions, injuries, or medical considerations (comma-separated)"
            onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;

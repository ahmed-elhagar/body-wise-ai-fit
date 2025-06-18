
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Target, Save } from "lucide-react";

interface ProfileGoalsCardProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
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
  validationErrors 
}: ProfileGoalsCardProps) => {
  const handleSave = async () => {
    await saveGoalsAndActivity();
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Goals & Activity</h3>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-fitness-primary-500 hover:bg-fitness-primary-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
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
          <Label htmlFor="preferred_foods" className="text-sm font-medium">Preferred Foods</Label>
          <Textarea
            id="preferred_foods"
            value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods.join(', ') : ''}
            onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
            placeholder="Foods you enjoy eating (comma separated)"
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};

export default ProfileGoalsCard;

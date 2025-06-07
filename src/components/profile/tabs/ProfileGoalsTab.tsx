
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save, Activity } from "lucide-react";

interface ProfileGoalsTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileGoalsTab = ({
  formData,
  updateFormData,
  handleArrayInput,
  saveGoalsAndActivity,
  isUpdating,
  validationErrors
}: ProfileGoalsTabProps) => {
  
  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            Fitness Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
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
                className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>

          <Button 
            onClick={saveGoalsAndActivity} 
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 rounded-xl shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isUpdating ? 'Saving Goals & Activity...' : 'Save Goals & Activity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileGoalsTab;

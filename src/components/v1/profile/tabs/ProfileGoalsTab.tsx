import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const ProfileGoalsTab = () => {
  const { profile, updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [goalsData, setGoalsData] = useState({
    fitness_goal: profile?.fitness_goal || '',
    activity_level: profile?.activity_level || '',
    preferred_foods: profile?.preferred_foods || [],
    dietary_restrictions: profile?.dietary_restrictions || []
  });

  const updateField = (field: string, value: any) => {
    setGoalsData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    setGoalsData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(goalsData);
      toast.success("Goals and preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update goals and preferences");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Goals & Activity</h2>
        <p className="text-gray-600">Set your fitness goals and activity preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fitness Goals</CardTitle>
            <CardDescription>What do you want to achieve?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fitness_goal">Primary Goal</Label>
              <Select value={goalsData.fitness_goal} onValueChange={(value) => updateField('fitness_goal', value)}>
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
              <Label htmlFor="activity_level">Activity Level</Label>
              <Select value={goalsData.activity_level} onValueChange={(value) => updateField('activity_level', value)}>
                <SelectTrigger>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Preferences</CardTitle>
            <CardDescription>Your dietary preferences and restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preferred_foods">Preferred Foods</Label>
              <Textarea
                id="preferred_foods"
                value={goalsData.preferred_foods.join(', ')}
                onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
                placeholder="Foods you enjoy eating (comma separated)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={goalsData.dietary_restrictions.join(', ')}
                onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
                placeholder="Any dietary restrictions (comma separated)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileGoalsTab;

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const ProfileHealthTab = () => {
  const { profile, updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [healthData, setHealthData] = useState({
    health_conditions: profile?.health_conditions || [],
    allergies: profile?.allergies || [],
    dietary_restrictions: profile?.dietary_restrictions || [],
    preferred_foods: profile?.preferred_foods || []
  });

  const handleArrayInput = (field: keyof typeof healthData, value: string) => {
    const arrayValue = value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
    
    setHealthData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(healthData);
      toast.success("Health information updated successfully!");
    } catch (error) {
      toast.error("Failed to update health information");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Information</h2>
        <p className="text-gray-600">Manage your health conditions and dietary preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Conditions</CardTitle>
            <CardDescription>List any health conditions you have</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="health_conditions">Health Conditions</Label>
            <Input
              id="health_conditions"
              value={healthData.health_conditions.join(', ')}
              onChange={(e) => handleArrayInput('health_conditions', e.target.value)}
              placeholder="e.g., Diabetes, Hypertension"
            />
            <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
            <CardDescription>List your food allergies and intolerances</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              value={healthData.allergies.join(', ')}
              onChange={(e) => handleArrayInput('allergies', e.target.value)}
              placeholder="e.g., Nuts, Dairy, Shellfish"
            />
            <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dietary Restrictions</CardTitle>
            <CardDescription>Your dietary preferences and restrictions</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
            <Input
              id="dietary_restrictions"
              value={healthData.dietary_restrictions.join(', ')}
              onChange={(e) => handleArrayInput('dietary_restrictions', e.target.value)}
              placeholder="e.g., Vegetarian, Gluten-free, Keto"
            />
            <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Foods</CardTitle>
            <CardDescription>Foods you enjoy and prefer to eat</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="preferred_foods">Preferred Foods</Label>
            <Input
              id="preferred_foods"
              value={healthData.preferred_foods.join(', ')}
              onChange={(e) => handleArrayInput('preferred_foods', e.target.value)}
              placeholder="e.g., Chicken, Rice, Vegetables"
            />
            <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
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

export default ProfileHealthTab;

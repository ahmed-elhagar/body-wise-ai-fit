
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Save } from "lucide-react";
import { useProfileForm } from "@/hooks/useProfileForm";

const ProfileHealthTab = () => {
  const { formData, updateFormData, handleArrayInput, handleSave, isUpdating } = useProfileForm();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData('height', e.target.value)}
                placeholder="Enter your height in cm"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => updateFormData('weight', e.target.value)}
                placeholder="Enter your weight in kg"
              />
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
            <p className="text-sm text-gray-500 mt-1">
              List any medical conditions that might affect your fitness or nutrition plan
            </p>
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
            <p className="text-sm text-gray-500 mt-1">
              Include food allergies, environmental allergies, or medication allergies
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Saving...' : 'Save Health Information'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHealthTab;

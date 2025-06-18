
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, Save } from "lucide-react";

interface ProfileHealthCardProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveGoalsAndActivity: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileHealthCard = ({ 
  formData, 
  updateFormData, 
  handleArrayInput, 
  saveGoalsAndActivity, 
  isUpdating, 
  validationErrors 
}: ProfileHealthCardProps) => {
  const handleSave = async () => {
    await saveGoalsAndActivity();
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="w-5 h-5 text-fitness-primary mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Health Information</h3>
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
          <Label htmlFor="body_fat_percentage" className="text-sm font-medium">Body Fat Percentage (%)</Label>
          <Input
            id="body_fat_percentage"
            type="number"
            min="5"
            max="50"
            value={formData.body_fat_percentage || ''}
            onChange={(e) => updateFormData("body_fat_percentage", e.target.value)}
            placeholder="Optional"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="health_conditions" className="text-sm font-medium">Health Conditions</Label>
          <Textarea
            id="health_conditions"
            value={Array.isArray(formData.health_conditions) ? formData.health_conditions.join(', ') : ''}
            onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
            placeholder="Any health conditions or medical considerations (comma separated)"
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="allergies" className="text-sm font-medium">Allergies & Dietary Restrictions</Label>
          <Textarea
            id="allergies"
            value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : ''}
            onChange={(e) => handleArrayInput("allergies", e.target.value)}
            placeholder="Any food allergies or dietary restrictions (comma separated)"
            rows={2}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="dietary_restrictions" className="text-sm font-medium">Additional Dietary Preferences</Label>
          <Textarea
            id="dietary_restrictions"
            value={Array.isArray(formData.dietary_restrictions) ? formData.dietary_restrictions.join(', ') : ''}
            onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
            placeholder="Other dietary preferences or restrictions (comma separated)"
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};

export default ProfileHealthCard;

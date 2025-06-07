
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit, Save, X } from "lucide-react";

interface ProfileHealthCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
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
  validationErrors,
}: ProfileHealthCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const success = await saveGoalsAndActivity();
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white via-red-50/20 to-pink-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            Health Information
          </CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="hover:bg-red-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Health
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="health_conditions">Health Conditions</Label>
              <Textarea
                id="health_conditions"
                value={formData.health_conditions?.join(', ') || ''}
                onChange={(e) => handleArrayInput('health_conditions', e.target.value)}
                placeholder="e.g., Diabetes, Hypertension"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies & Intolerances</Label>
              <Textarea
                id="allergies"
                value={formData.allergies?.join(', ') || ''}
                onChange={(e) => handleArrayInput('allergies', e.target.value)}
                placeholder="e.g., Nuts, Dairy, Gluten"
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formData.health_conditions?.length > 0 ? (
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-medium">Health Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {formData.health_conditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-sm text-gray-500">No health conditions reported</p>
              </div>
            )}

            {formData.allergies?.length > 0 ? (
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-medium">Allergies & Intolerances</p>
                <div className="flex flex-wrap gap-1">
                  {formData.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-sm text-gray-500">No allergies reported</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHealthCard;

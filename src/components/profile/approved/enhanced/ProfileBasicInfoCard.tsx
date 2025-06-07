
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X } from "lucide-react";
import EnhancedNationalitySelector from "@/components/onboarding/EnhancedNationalitySelector";

interface ProfileBasicInfoCardProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  saveBasicInfo: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileBasicInfoCard = ({
  formData,
  updateFormData,
  saveBasicInfo,
  isUpdating,
  validationErrors,
}: ProfileBasicInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const success = await saveBasicInfo();
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            Basic Information
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
                className="bg-blue-600 hover:bg-blue-700"
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
              className="hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Info
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => updateFormData("first_name", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => updateFormData("last_name", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData("age", e.target.value)}
                placeholder="Enter your age"
                min="13"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || ''} onValueChange={(value) => updateFormData("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData("height", e.target.value)}
                placeholder="Enter your height"
                min="100"
                max="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => updateFormData("weight", e.target.value)}
                placeholder="Enter your weight"
                min="30"
                max="300"
              />
            </div>

            <div className="lg:col-span-2">
              <EnhancedNationalitySelector
                value={formData.nationality || ''}
                onChange={(value) => updateFormData("nationality", value)}
                label="Nationality"
                placeholder="Select your nationality..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_shape">Body Shape</Label>
              <Select value={formData.body_shape || ''} onValueChange={(value) => updateFormData("body_shape", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body shape" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="lean">Lean</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_fat_percentage">Body Fat Percentage (%)</Label>
              <Input
                id="body_fat_percentage"
                type="number"
                value={formData.body_fat_percentage || ''}
                onChange={(e) => updateFormData("body_fat_percentage", e.target.value)}
                placeholder="Enter body fat percentage"
                min="5"
                max="50"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-900">
                {formData.first_name && formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}`
                  : 'Not provided'
                }
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Age & Gender</p>
              <p className="font-medium text-gray-900">
                {formData.age && formData.gender 
                  ? `${formData.age} years, ${formData.gender}`
                  : 'Not provided'
                }
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Height & Weight</p>
              <p className="font-medium text-gray-900">
                {formData.height && formData.weight 
                  ? `${formData.height} cm, ${formData.weight} kg`
                  : 'Not provided'
                }
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Nationality</p>
              <p className="font-medium text-gray-900">
                {formData.nationality || 'Not provided'}
              </p>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Body Composition</p>
              <p className="font-medium text-gray-900">
                {formData.body_shape && formData.body_fat_percentage 
                  ? `${formData.body_shape}, ${formData.body_fat_percentage}% body fat`
                  : formData.body_shape || 'Not provided'
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;

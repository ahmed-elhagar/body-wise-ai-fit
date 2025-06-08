
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X } from "lucide-react";

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
              Edit Basic Info
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                placeholder="Enter your first name"
              />
              {validationErrors.first_name && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.first_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                placeholder="Enter your last name"
              />
              {validationErrors.last_name && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.last_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', e.target.value)}
                placeholder="Enter your age"
              />
              {validationErrors.age && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.age}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || undefined} onValueChange={(value) => updateFormData('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.gender && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.gender}</p>
              )}
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData('height', e.target.value)}
                placeholder="Enter your height"
              />
              {validationErrors.height && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.height}</p>
              )}
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => updateFormData('weight', e.target.value)}
                placeholder="Enter your weight"
              />
              {validationErrors.weight && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.weight}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => updateFormData('nationality', e.target.value)}
                placeholder="Enter your nationality"
              />
            </div>

            <div>
              <Label htmlFor="body_shape">Body Shape</Label>
              <Select value={formData.body_shape || undefined} onValueChange={(value) => updateFormData('body_shape', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ectomorph">Ectomorph</SelectItem>
                  <SelectItem value="mesomorph">Mesomorph</SelectItem>
                  <SelectItem value="endomorph">Endomorph</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-gray-900">
                  {formData.first_name || formData.last_name ? 
                    `${formData.first_name || ''} ${formData.last_name || ''}`.trim() : 
                    'Not specified'
                  }
                </p>
              </div>
              
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Age</p>
                <p className="font-medium text-gray-900">{formData.age || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Gender</p>
                <p className="font-medium text-gray-900 capitalize">{formData.gender || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Nationality</p>
                <p className="font-medium text-gray-900">{formData.nationality || 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Height</p>
                <p className="font-medium text-gray-900">
                  {formData.height ? `${formData.height} cm` : 'Not specified'}
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Weight</p>
                <p className="font-medium text-gray-900">
                  {formData.weight ? `${formData.weight} kg` : 'Not specified'}
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Body Shape</p>
                <p className="font-medium text-gray-900 capitalize">
                  {formData.body_shape || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;

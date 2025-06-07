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
    <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            Personal Information
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
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                className={validationErrors.first_name ? 'border-red-500' : ''}
              />
              {validationErrors.first_name && (
                <p className="text-sm text-red-500">{validationErrors.first_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                className={validationErrors.last_name ? 'border-red-500' : ''}
              />
              {validationErrors.last_name && (
                <p className="text-sm text-red-500">{validationErrors.last_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', e.target.value)}
                className={validationErrors.age ? 'border-red-500' : ''}
              />
              {validationErrors.age && (
                <p className="text-sm text-red-500">{validationErrors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
                <SelectTrigger className={validationErrors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.gender && (
                <p className="text-sm text-red-500">{validationErrors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData('height', e.target.value)}
                className={validationErrors.height ? 'border-red-500' : ''}
              />
              {validationErrors.height && (
                <p className="text-sm text-red-500">{validationErrors.height}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => updateFormData('weight', e.target.value)}
                className={validationErrors.weight ? 'border-red-500' : ''}
              />
              {validationErrors.weight && (
                <p className="text-sm text-red-500">{validationErrors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => updateFormData('nationality', e.target.value)}
                className={validationErrors.nationality ? 'border-red-500' : ''}
              />
              {validationErrors.nationality && (
                <p className="text-sm text-red-500">{validationErrors.nationality}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_shape">Body Shape</Label>
              <Select value={formData.body_shape || ''} onValueChange={(value) => updateFormData('body_shape', value)}>
                <SelectTrigger className={validationErrors.body_shape ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select body shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ectomorph">Ectomorph</SelectItem>
                  <SelectItem value="mesomorph">Mesomorph</SelectItem>
                  <SelectItem value="endomorph">Endomorph</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.body_shape && (
                <p className="text-sm text-red-500">{validationErrors.body_shape}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info Display */}
            <div className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {formData.first_name && formData.last_name 
                    ? `${formData.first_name} ${formData.last_name}` 
                    : "Complete your profile"}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <span className="text-sm">{formData.nationality || 'Add nationality'}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">
                      {formData.age ? `${formData.age} years old` : 'Age not set'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 capitalize">
                    {formData.gender || 'Gender not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formData.height ? `${formData.height}` : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Height (cm)</div>
              </div>
              <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formData.weight ? `${formData.weight}` : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Weight (kg)</div>
              </div>
              <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formData.height && formData.weight 
                    ? ((formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1))
                    : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">BMI</div>
              </div>
              <div className="bg-white/70 p-4 rounded-xl border border-gray-100 text-center">
                <div className="text-2xl font-bold text-orange-600 capitalize">
                  {formData.body_shape?.substring(0, 4) || '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Body Type</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X, MapPin, Calendar, Ruler, Weight, Activity } from "lucide-react";

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

  const getBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMIStatus = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { status: 'Underweight', color: 'text-blue-600 bg-blue-50' };
    if (bmiValue < 25) return { status: 'Normal', color: 'text-green-600 bg-green-50' };
    if (bmiValue < 30) return { status: 'Overweight', color: 'text-yellow-600 bg-yellow-50' };
    return { status: 'Obese', color: 'text-red-600 bg-red-50' };
  };

  const bmi = getBMI();
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
      <CardHeader className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Basic Information
              </span>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Your personal details and physical stats
              </p>
            </div>
          </CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="hover:bg-gray-50 border-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => updateFormData('first_name', e.target.value)}
                placeholder="Your first name"
                className={`transition-all ${validationErrors.first_name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {validationErrors.first_name && (
                <p className="text-sm text-red-500">{validationErrors.first_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => updateFormData('last_name', e.target.value)}
                placeholder="Your last name"
                className={`transition-all ${validationErrors.last_name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {validationErrors.last_name && (
                <p className="text-sm text-red-500">{validationErrors.last_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => updateFormData('age', e.target.value)}
                placeholder="Your age"
                className={`transition-all ${validationErrors.age ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {validationErrors.age && (
                <p className="text-sm text-red-500">{validationErrors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
                <SelectTrigger className={`transition-all ${validationErrors.gender ? 'border-red-500' : 'focus:border-blue-500'}`}>
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
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                Height (cm) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => updateFormData('height', e.target.value)}
                placeholder="Height in cm"
                className={`transition-all ${validationErrors.height ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {validationErrors.height && (
                <p className="text-sm text-red-500">{validationErrors.height}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Weight (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => updateFormData('weight', e.target.value)}
                placeholder="Weight in kg"
                className={`transition-all ${validationErrors.weight ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {validationErrors.weight && (
                <p className="text-sm text-red-500">{validationErrors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                Nationality
              </Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => updateFormData('nationality', e.target.value)}
                placeholder="Your nationality"
                className="transition-all focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_shape" className="text-sm font-medium text-gray-700">
                Body Shape
              </Label>
              <Select value={formData.body_shape || ''} onValueChange={(value) => updateFormData('body_shape', value)}>
                <SelectTrigger className="transition-all focus:border-blue-500">
                  <SelectValue placeholder="Select body shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ectomorph">Ectomorph (Lean)</SelectItem>
                  <SelectItem value="mesomorph">Mesomorph (Athletic)</SelectItem>
                  <SelectItem value="endomorph">Endomorph (Rounded)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-white/80 to-blue-50/80 rounded-2xl border border-gray-100/50 shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">
                  {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {formData.first_name && formData.last_name 
                    ? `${formData.first_name} ${formData.last_name}` 
                    : "Complete your profile"}
                </h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{formData.nationality || 'Add nationality'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formData.age ? `${formData.age} years old` : 'Age not set'}
                    </span>
                  </div>
                  <span className="text-sm capitalize">
                    {formData.gender || 'Gender not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Ruler className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Height</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.height ? `${formData.height} cm` : '—'}
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Weight className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Weight</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.weight ? `${formData.weight} kg` : '—'}
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">BMI</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {bmi || '—'}
                  </div>
                  {bmiStatus && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${bmiStatus.color}`}>
                      {bmiStatus.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Body Type</span>
                </div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {formData.body_shape || '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;

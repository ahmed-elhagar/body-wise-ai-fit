
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";

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
  return (
    <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name || ''}
              onChange={(e) => updateFormData("first_name", e.target.value)}
              placeholder="Enter your first name"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.first_name && (
              <p className="text-sm text-red-600">{validationErrors.first_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name || ''}
              onChange={(e) => updateFormData("last_name", e.target.value)}
              placeholder="Enter your last name"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.last_name && (
              <p className="text-sm text-red-600">{validationErrors.last_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ''}
              onChange={(e) => updateFormData("age", e.target.value)}
              placeholder="Enter your age"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.age && (
              <p className="text-sm text-red-600">{validationErrors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
            <Select value={formData.gender || undefined} onValueChange={(value) => updateFormData("gender", value)}>
              <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.gender && (
              <p className="text-sm text-red-600">{validationErrors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateFormData("height", e.target.value)}
              placeholder="Enter your height"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.height && (
              <p className="text-sm text-red-600">{validationErrors.height}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData("weight", e.target.value)}
              placeholder="Enter your weight"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.weight && (
              <p className="text-sm text-red-600">{validationErrors.weight}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">Nationality</Label>
            <Input
              id="nationality"
              value={formData.nationality || ''}
              onChange={(e) => updateFormData("nationality", e.target.value)}
              placeholder="Your nationality"
              className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {validationErrors.nationality && (
              <p className="text-sm text-red-600">{validationErrors.nationality}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body_shape" className="text-sm font-medium text-gray-700">Body Shape</Label>
            <Select value={formData.body_shape || undefined} onValueChange={(value) => updateFormData("body_shape", value)}>
              <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Select body shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ectomorph">Ectomorph</SelectItem>
                <SelectItem value="mesomorph">Mesomorph</SelectItem>
                <SelectItem value="endomorph">Endomorph</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.body_shape && (
              <p className="text-sm text-red-600">{validationErrors.body_shape}</p>
            )}
          </div>
        </div>

        <Button 
          onClick={saveBasicInfo} 
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Basic Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoCard;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";

interface ProfileBasicTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  saveBasicInfo: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const ProfileBasicTab = ({ 
  formData, 
  updateFormData, 
  saveBasicInfo, 
  isUpdating, 
  validationErrors 
}: ProfileBasicTabProps) => {
  
  return (
    <div className="space-y-6 p-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <Button 
            onClick={saveBasicInfo} 
            disabled={isUpdating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isUpdating ? 'Saving Basic Information...' : 'Save Basic Information'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBasicTab;

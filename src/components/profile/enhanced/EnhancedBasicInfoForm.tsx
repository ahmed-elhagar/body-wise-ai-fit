
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save } from "lucide-react";

interface EnhancedBasicInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onSave: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const EnhancedBasicInfoForm = ({
  formData,
  updateFormData,
  onSave,
  isUpdating,
  validationErrors
}: EnhancedBasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectItem value="other">Other</SelectItem>
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
              placeholder="Enter your height in cm"
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
              placeholder="Enter your weight in kg"
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
            {validationErrors.nationality && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.nationality}</p>
            )}
          </div>

          <div>
            <Label htmlFor="body_shape">Body Shape</Label>
            <Select value={formData.body_shape || undefined} onValueChange={(value) => updateFormData('body_shape', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select body shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ectomorph">Ectomorph (Lean/Thin)</SelectItem>
                <SelectItem value="mesomorph">Mesomorph (Athletic/Muscular)</SelectItem>
                <SelectItem value="endomorph">Endomorph (Rounded/Soft)</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.body_shape && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.body_shape}</p>
            )}
          </div>
        </div>

        <Button 
          onClick={onSave} 
          disabled={isUpdating}
          className="w-full md:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Basic Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedBasicInfoForm;

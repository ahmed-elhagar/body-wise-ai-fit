
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import BodyShapeSelector from "@/components/BodyShapeSelector";

interface EnhancedBasicInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  onSave: () => void;
  isUpdating: boolean;
}

const EnhancedBasicInfoForm = ({
  formData,
  updateFormData,
  onSave,
  isUpdating,
}: EnhancedBasicInfoFormProps) => {
  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Tell us about yourself to personalize your experience
        </p>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => updateFormData("first_name", e.target.value)}
              placeholder="Enter your first name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => updateFormData("last_name", e.target.value)}
              placeholder="Enter your last name"
              className="mt-1"
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => updateFormData("age", e.target.value)}
              placeholder="Enter your age"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => updateFormData("gender", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="nationality">Nationality *</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => updateFormData("nationality", e.target.value)}
              placeholder="Your nationality"
              className="mt-1"
            />
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => updateFormData("height", e.target.value)}
              placeholder="Enter your height"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => updateFormData("weight", e.target.value)}
              placeholder="Enter your weight"
              className="mt-1"
            />
          </div>
        </div>

        {/* Body Shape Selector */}
        <div className="mt-6">
          <BodyShapeSelector
            value={formData.body_shape}
            onChange={(value) => updateFormData("body_shape", value)}
            gender={formData.gender}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={onSave}
            disabled={isUpdating}
            className="bg-fitness-gradient hover:opacity-90 w-full md:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Basic Info'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedBasicInfoForm;

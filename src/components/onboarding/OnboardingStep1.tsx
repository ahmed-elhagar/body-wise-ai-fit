
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import BodyShapeSelector from "@/components/BodyShapeSelector";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

interface OnboardingStep1Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const OnboardingStep1 = ({ formData, updateFormData }: OnboardingStep1Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-fitness-gradient rounded-full mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about yourself to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Enter your age"
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select 
            value={formData.gender} 
            onValueChange={(value) => updateFormData("gender", value)} 
            required
          >
            <SelectTrigger>
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
            required
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="Enter your height"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="Enter your weight"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <BodyShapeSelector
          value={formData.body_shape}
          onChange={(value) => updateFormData("body_shape", value)}
          gender={formData.gender}
        />
      </div>
    </div>
  );
};

export default OnboardingStep1;

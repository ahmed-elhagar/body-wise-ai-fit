
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import GenderSelector from "@/components/onboarding/GenderSelector";
import NationalitySelector from "@/components/onboarding/NationalitySelector";
import { SignupFormData } from "../types";

interface PhysicalInfoStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const PhysicalInfoStep = ({ formData, updateField }: PhysicalInfoStepProps) => {
  const isValid = !!(
    formData.age && 
    formData.gender && 
    formData.height && 
    formData.weight &&
    parseInt(formData.age) >= 13 &&
    parseInt(formData.age) <= 100 &&
    parseFloat(formData.height) >= 100 &&
    parseFloat(formData.height) <= 250 &&
    parseFloat(formData.weight) >= 30 &&
    parseFloat(formData.weight) <= 300
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Physical Information</h2>
        <p className="text-gray-600">Help us understand your body metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age" className="text-sm font-medium text-gray-700 mb-2 block">
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="Enter your age"
            className="h-12"
            min="13"
            max="100"
          />
        </div>
        <div>
          <Label htmlFor="nationality" className="text-sm font-medium text-gray-700 mb-2 block">
            Nationality
          </Label>
          <NationalitySelector
            value={formData.nationality}
            onChange={(value) => updateField("nationality", value)}
          />
        </div>
      </div>

      <GenderSelector
        value={formData.gender}
        onChange={(value) => updateField("gender", value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 mb-2 block">
            Height (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateField("height", e.target.value)}
            placeholder="Enter your height"
            className="h-12"
            min="100"
            max="250"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-2 block">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            placeholder="Enter your weight"
            className="h-12"
            min="30"
            max="300"
          />
        </div>
      </div>

      {!isValid && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          Please fill in all required fields with valid values
        </div>
      )}
    </div>
  );
};

export default PhysicalInfoStep;

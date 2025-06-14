
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, AlertCircle } from "lucide-react";
import GenderSelector from "@/components/onboarding/GenderSelector";
import EnhancedNationalitySelector from "@/components/onboarding/EnhancedNationalitySelector";
import { SignupFormData } from "../types";

interface PhysicalInfoStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
}

const PhysicalInfoStep = ({ formData, updateField }: PhysicalInfoStepProps) => {
  const ageValue = parseFloat(formData.age);
  const heightValue = parseFloat(formData.height);
  const weightValue = parseFloat(formData.weight);

  const ageValid = formData.age && ageValue >= 13 && ageValue <= 100;
  const heightValid = formData.height && heightValue >= 100 && heightValue <= 250;
  const weightValid = formData.weight && weightValue >= 30 && weightValue <= 300;
  
  const isValid = !!(
    ageValid && 
    formData.gender && 
    heightValid && 
    weightValid
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
            className={`h-12 ${formData.age && !ageValid ? 'border-red-500' : ''}`}
            min="13"
            max="100"
          />
          {formData.age && !ageValid && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Age must be between 13-100 years
            </div>
          )}
        </div>
        <div>
          <EnhancedNationalitySelector
            value={formData.nationality}
            onChange={(value) => updateField("nationality", value)}
            label="Nationality (Optional)"
            placeholder="Select nationality..."
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
            placeholder="e.g., 170"
            className={`h-12 ${formData.height && !heightValid ? 'border-red-500' : ''}`}
            min="100"
            max="250"
          />
          {formData.height && !heightValid && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Height must be between 100-250 cm
            </div>
          )}
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
            placeholder="e.g., 70"
            className={`h-12 ${formData.weight && !weightValid ? 'border-red-500' : ''}`}
            min="30"
            max="300"
          />
          {formData.weight && !weightValid && (
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Weight must be between 30-300 kg
            </div>
          )}
        </div>
      </div>

      {!isValid && (Object.keys(formData).some(key => formData[key as keyof SignupFormData])) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Please complete all required fields:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {!ageValid && <li>Age must be between 13-100 years</li>}
                {!formData.gender && <li>Gender selection is required</li>}
                {!heightValid && <li>Height must be between 100-250 cm</li>}
                {!weightValid && <li>Weight must be between 30-300 kg</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalInfoStep;

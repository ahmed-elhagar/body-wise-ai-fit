
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface BasicInfoStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string) => void;
}

const BasicInfoStep = ({ formData, updateField }: BasicInfoStepProps) => {
  const genderOptions = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Help us understand your profile</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Gender</Label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.gender === option.id ? "default" : "outline"}
                className={`h-14 sm:h-16 flex flex-col items-center justify-center space-y-1 ${
                  formData.gender === option.id ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-500 to-purple-600' : ''
                }`}
                onClick={() => updateField("gender", option.id)}
              >
                <span className="text-xl sm:text-2xl">{option.emoji}</span>
                <span className="text-xs sm:text-sm font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="25"
            min="13"
            max="120"
            className="h-11"
          />
          <p className="text-xs text-gray-500">Must be between 13-120 years</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;

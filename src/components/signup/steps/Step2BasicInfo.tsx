
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

interface Step2BasicInfoProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string) => void;
}

const Step2BasicInfo = ({ formData, updateFormData }: Step2BasicInfoProps) => {
  const genderOptions = [
    { id: 'male', label: 'Male', emoji: '👨' },
    { id: 'female', label: 'Female', emoji: '👩' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <Info className="w-8 h-8 text-white" />
        </div>
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
                className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                  formData.gender === option.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => updateFormData("gender", option.id)}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-sm font-medium">{option.label}</span>
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
            onChange={(e) => updateFormData("age", e.target.value)}
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

export default Step2BasicInfo;


import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UnifiedFormData } from "@/hooks/useUnifiedForm";

interface UnifiedStep2Props {
  formData: UnifiedFormData;
  updateFormData: (field: string, value: string) => void;
}

const UnifiedStep2 = ({ formData, updateFormData }: UnifiedStep2Props) => {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-gray-600">Help us understand your physical profile</p>
      </div>

      <div className="space-y-6">
        {/* Gender Selection */}
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

        {/* Age and Physical Stats */}
        <div className="grid grid-cols-1 gap-4">
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => updateFormData("height", e.target.value)}
              placeholder="175"
              min="100"
              max="250"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => updateFormData("weight", e.target.value)}
              placeholder="70"
              min="30"
              max="300"
              className="h-11"
            />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Why we need this:</strong> This information helps us calculate your BMR and create personalized meal and exercise plans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStep2;


import { Info, Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface CombinedInfoStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string) => void;
}

const CombinedInfoStep = ({ formData, updateField }: CombinedInfoStepProps) => {
  const genderOptions = [
    { id: 'male', label: 'Male', emoji: '👨', color: 'from-blue-500 to-blue-600' },
    { id: 'female', label: 'Female', emoji: '👩', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Help us understand your profile and measurements</p>
      </div>

      <div className="space-y-8">
        {/* Gender Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-800">Gender</Label>
          <div className="grid grid-cols-2 gap-4">
            {genderOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                className={`h-16 sm:h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                  formData.gender === option.id 
                    ? `bg-gradient-to-r ${option.color} text-white border-0 shadow-lg transform scale-105` 
                    : 'hover:shadow-md hover:scale-102 border-2 border-gray-200'
                }`}
                onClick={() => updateField("gender", option.id)}
              >
                <span className="text-2xl sm:text-3xl">{option.emoji}</span>
                <span className="text-sm sm:text-base font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="space-y-3">
          <Label htmlFor="age" className="text-base font-semibold text-gray-800">
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
            className="h-12 text-lg"
          />
          <p className="text-xs text-gray-500">Must be between 13-120 years</p>
        </div>

        {/* Physical Measurements */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Ruler className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Physical Measurements</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="height" className="text-base font-medium text-gray-700">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => updateField("height", e.target.value)}
                placeholder="175"
                min="100"
                max="250"
                className="h-12 text-lg"
              />
              <p className="text-xs text-gray-500">100-250 cm</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="weight" className="text-base font-medium text-gray-700">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                placeholder="70"
                min="30"
                max="300"
                className="h-12 text-lg"
              />
              <p className="text-xs text-gray-500">30-300 kg</p>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-4">
            <p className="text-sm text-orange-700">
              <strong>Why we need this:</strong> Your measurements help us calculate your BMR and create personalized meal and exercise plans tailored specifically for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedInfoStep;

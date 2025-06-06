
import { Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface PhysicalStatsStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: string) => void;
}

const PhysicalStatsStep = ({ formData, updateField }: PhysicalStatsStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ruler className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Your current physical measurements</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
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
              className="h-11"
            />
            <p className="text-xs text-gray-500">100-250 cm</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
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
              className="h-11"
            />
            <p className="text-xs text-gray-500">30-300 kg</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700">
            <strong>Why we need this:</strong> Height and weight help us calculate your BMR and create personalized meal and exercise plans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysicalStatsStep;

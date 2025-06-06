
import { Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

interface Step3PhysicalStatsProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string) => void;
}

const Step3PhysicalStats = ({ formData, updateFormData }: Step3PhysicalStatsProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <Ruler className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-6">
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
              onChange={(e) => updateFormData("weight", e.target.value)}
              placeholder="70"
              min="30"
              max="300"
              className="h-11"
            />
            <p className="text-xs text-gray-500">30-300 kg</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Why we need this:</strong> Height and weight help us calculate your BMR and create personalized meal and exercise plans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3PhysicalStats;


import { Gauge } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SignupFormData } from "@/hooks/useSignupFlow";

interface BodyCompositionStepProps {
  formData: SignupFormData;
  updateField: (field: string, value: number) => void;
}

const BodyCompositionStep = ({ formData, updateField }: BodyCompositionStepProps) => {
  const handleSliderChange = (value: number[]) => {
    updateField("bodyFatPercentage", value[0]);
  };

  const getBodyType = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 15) return 'lean';
      if (percentage < 22) return 'average';
      return 'fuller';
    } else {
      if (percentage < 22) return 'lean';
      if (percentage < 30) return 'average';
      return 'fuller';
    }
  };

  const getBodyTypeImage = (percentage: number, gender: string) => {
    const bodyType = getBodyType(percentage, gender);
    if (gender === 'female') {
      switch (bodyType) {
        case 'lean': return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png';
        case 'average': return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png';
        case 'fuller': return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png';
        default: return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png';
      }
    } else {
      switch (bodyType) {
        case 'lean': return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png';
        case 'average': return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png';
        case 'fuller': return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png';
        default: return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png';
      }
    }
  };

  const getBodyTypeDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 10) return 'Essential fat only';
      if (percentage < 14) return 'Athletic';
      if (percentage < 18) return 'Fitness';
      if (percentage < 25) return 'Average';
      return 'Above average';
    } else {
      if (percentage < 16) return 'Essential fat only';
      if (percentage < 20) return 'Athletic';
      if (percentage < 25) return 'Fitness';
      if (percentage < 32) return 'Average';
      return 'Above average';
    }
  };

  const getBodyTypeName = (percentage: number, gender: string) => {
    const bodyType = getBodyType(percentage, gender);
    switch (bodyType) {
      case 'lean': return 'Lean/Athletic';
      case 'average': return 'Average/Normal';
      case 'fuller': return 'Fuller/Curvy';
      default: return 'Average/Normal';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gauge className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600">Help us understand your body composition</p>
      </div>

      <div className="space-y-8">
        {/* Visual representation */}
        <div className="flex justify-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
          <div className="relative">
            <div className="w-20 h-28 sm:w-24 sm:h-32 flex items-center justify-center">
              <img 
                src={getBodyTypeImage(formData.bodyFatPercentage, formData.gender)}
                alt={`Body visualization for ${formData.bodyFatPercentage}% body fat`}
                className="w-full h-full object-contain transition-all duration-500"
              />
              <div className="absolute -top-2 -right-2 bg-white/95 rounded-full px-2 py-1 text-xs font-semibold shadow-lg">
                {formData.bodyFatPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Body type and description */}
        <div className="text-center space-y-3">
          <div className="text-lg sm:text-xl font-bold text-gray-800">
            {getBodyTypeName(formData.bodyFatPercentage, formData.gender)}
          </div>
          <div className="text-base sm:text-lg font-semibold text-blue-600">
            {formData.bodyFatPercentage}% Body Fat
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {getBodyTypeDescription(formData.bodyFatPercentage, formData.gender)}
          </p>
        </div>

        {/* Slider */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-800 block">
            Fine-tune your body composition:
          </Label>
          <div className="space-y-3">
            <Slider
              value={[formData.bodyFatPercentage]}
              onValueChange={handleSliderChange}
              min={formData.gender === 'male' ? 8 : 15}
              max={formData.gender === 'male' ? 35 : 45}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Very Lean</span>
              <span>Average</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">
            <strong>Smart Integration:</strong> Your body type automatically adjusts as you move the slider to give you the most accurate representation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyCompositionStep;

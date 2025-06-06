
import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { NewSignupFormData } from "@/hooks/useNewSignupForm";

interface Step4BodyCompositionProps {
  formData: NewSignupFormData;
  updateFormData: (field: string, value: string | number) => void;
}

const Step4BodyComposition = ({ formData, updateFormData }: Step4BodyCompositionProps) => {
  const bodyTypes = [
    {
      id: 'lean',
      name: 'Lean/Athletic',
      description: 'Low body fat, defined muscles',
      maleImage: '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png',
      femaleImage: '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png',
      defaultBodyFat: { male: 12, female: 18 }
    },
    {
      id: 'average',
      name: 'Average/Normal',
      description: 'Balanced body composition',
      maleImage: '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png',
      femaleImage: '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png',
      defaultBodyFat: { male: 18, female: 25 }
    },
    {
      id: 'fuller',
      name: 'Fuller/Curvy',
      description: 'Higher body fat percentage',
      maleImage: '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png',
      femaleImage: '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png',
      defaultBodyFat: { male: 25, female: 32 }
    }
  ];

  const handleBodyTypeChange = (typeId: string) => {
    const selectedType = bodyTypes.find(t => t.id === typeId);
    if (selectedType) {
      updateFormData("body_shape", typeId);
      const defaultBF = formData.gender === 'male' 
        ? selectedType.defaultBodyFat.male 
        : selectedType.defaultBodyFat.female;
      updateFormData("body_fat_percentage", defaultBF);
    }
  };

  const handleSliderChange = (value: number[]) => {
    updateFormData("body_fat_percentage", value[0]);
  };

  const getBodyFatDescription = (percentage: number, gender: string) => {
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

  const getImageForBodyFat = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 22) return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png';
      if (percentage < 30) return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png';
      return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png';
    } else {
      if (percentage < 15) return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png';
      if (percentage < 22) return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png';
      return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Gauge className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Body Type Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-gray-800">Choose your body type:</Label>
          <div className="grid grid-cols-1 gap-3">
            {bodyTypes.map((type) => {
              const isSelected = formData.body_shape === type.id;
              const imageSrc = formData.gender === 'female' ? type.femaleImage : type.maleImage;
              
              return (
                <Card
                  key={type.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleBodyTypeChange(type.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={imageSrc}
                        alt={`${type.name} body type`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-800">{type.name}</h3>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Body Fat Slider */}
        <div className="border-t pt-6">
          <div className="space-y-6">
            <Label className="text-lg font-semibold text-gray-800 block">
              Fine-tune your body composition:
            </Label>
            
            {/* Visual representation */}
            <div className="flex justify-center py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
              <div className="relative">
                <div className="w-24 h-32 flex items-center justify-center">
                  <img 
                    src={getImageForBodyFat(formData.body_fat_percentage, formData.gender)}
                    alt={`Body visualization for ${formData.body_fat_percentage}% body fat`}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold">
                    {formData.body_fat_percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Body fat display */}
            <div className="text-center space-y-2">
              <div className="text-xl font-bold text-gray-800">{formData.body_fat_percentage}% Body Fat</div>
              <p className="text-base text-gray-600">
                {getBodyFatDescription(formData.body_fat_percentage, formData.gender)}
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <Slider
                value={[formData.body_fat_percentage]}
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
        </div>
      </div>
    </div>
  );
};

export default Step4BodyComposition;

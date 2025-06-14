
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface BodyFatSliderProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const BodyFatSlider = ({ value, onChange, gender }: BodyFatSliderProps) => {
  const [currentValue, setCurrentValue] = useState(value || (gender === 'male' ? 20 : 25));

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onChange(val);
  };

  // Define body shape images based on body fat percentage and gender
  const getBodyShapeImage = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 18) {
        return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'; // Athletic female
      } else if (percentage < 28) {
        return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'; // Average female
      } else {
        return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png'; // Higher body fat female
      }
    } else {
      if (percentage < 15) {
        return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png'; // Athletic male
      } else if (percentage < 22) {
        return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png'; // Average male
      } else {
        return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png'; // Higher body fat male
      }
    }
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

  const getBodyFatColor = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 14) return 'from-green-500 to-emerald-600';
      if (percentage < 18) return 'from-blue-500 to-indigo-600';
      if (percentage < 25) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-600';
    } else {
      if (percentage < 20) return 'from-green-500 to-emerald-600';
      if (percentage < 25) return 'from-blue-500 to-indigo-600';
      if (percentage < 32) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          Fine-tune your body composition
        </Label>
        <p className="text-sm text-gray-600">
          Adjust the slider to match your current body fat percentage
        </p>
      </div>
      
      {/* Body visualization with actual uploaded images */}
      <div className="flex justify-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
        <div className="relative">
          <div className="w-48 h-64 flex items-center justify-center mx-auto">
            <img 
              src={getBodyShapeImage(currentValue, gender)}
              alt={`Body shape visualization for ${currentValue}% body fat`}
              className="w-full h-full object-contain transition-all duration-500 ease-in-out"
              style={{ 
                filter: `brightness(${1 + (currentValue - 20) * 0.005})`,
              }}
            />
            
            {/* Overlay percentage indicator */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              <span className="text-sm font-semibold text-gray-700">{currentValue}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body fat percentage display */}
      <div className="text-center space-y-2">
        <div className={`inline-block bg-gradient-to-r ${getBodyFatColor(currentValue, gender)} text-white px-8 py-4 rounded-full shadow-lg`}>
          <span className="text-3xl font-bold">{currentValue}%</span>
        </div>
        <p className="text-base font-medium text-gray-700">
          {getBodyFatDescription(currentValue, gender)}
        </p>
      </div>

      {/* Slider */}
      <div className="px-4">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={gender === 'male' ? 35 : 45}
          min={gender === 'male' ? 8 : 15}
          step={1}
          className="w-full"
          data-testid="body-fat-slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{gender === 'male' ? '8%' : '15%'} (Very lean)</span>
          <span>{gender === 'male' ? '35%' : '45%'} (High)</span>
        </div>
      </div>

      {/* Body fat ranges guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-3">Body Fat Percentage Guide</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {gender === 'male' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>8-14% Athletic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>15-18% Fitness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>19-24% Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>25%+ Above Average</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>16-20% Athletic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>21-25% Fitness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>26-31% Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>32%+ Above Average</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyFatSlider;

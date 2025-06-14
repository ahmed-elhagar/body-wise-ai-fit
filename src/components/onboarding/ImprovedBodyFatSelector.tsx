
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ImprovedBodyFatSelectorProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const ImprovedBodyFatSelector = ({ value, onChange, gender }: ImprovedBodyFatSelectorProps) => {
  const [currentValue, setCurrentValue] = useState(value || (gender === 'male' ? 20 : 25));

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onChange(val);
  };

  // Define body shape images based on body fat percentage and gender
  const getBodyShapeImage = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 20) {
        return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'; // Lean female
      } else if (percentage < 30) {
        return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'; // Average female
      } else {
        return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png'; // Higher body fat female
      }
    } else {
      if (percentage < 15) {
        return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png'; // Lean male
      } else if (percentage < 25) {
        return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png'; // Average male
      } else {
        return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png'; // Higher body fat male
      }
    }
  };

  const getBodyShapeLabel = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 15) return 'Very Lean';
      else if (percentage < 25) return 'Athletic';
      else return 'Strong';
    } else {
      if (percentage < 20) return 'Very Lean';
      else if (percentage < 30) return 'Healthy';
      else return 'Curvy';
    }
  };

  const getBodyShapeDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 15) return 'Defined abs and muscle separation';
      else if (percentage < 25) return 'Some muscle definition visible';
      else return 'Solid build with minimal definition';
    } else {
      if (percentage < 20) return 'Athletic with visible muscle tone';
      else if (percentage < 30) return 'Healthy with gentle curves';
      else return 'Full figure with natural curves';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          Estimate your current body fat percentage
        </Label>
        <p className="text-sm text-gray-600">
          Use the slider to match your current physique
        </p>
      </div>
      
      {/* Enhanced body visualization with improved mobile design */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-4 md:p-8 border border-gray-200 shadow-lg">
        {/* Body visualization - responsive sizing */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <img 
              src={getBodyShapeImage(currentValue, gender)}
              alt={`Body shape visualization for ${currentValue}% body fat`}
              className="h-64 md:h-96 w-auto object-contain transition-all duration-500 ease-in-out drop-shadow-lg"
            />
          </div>

          {/* Enhanced percentage and description display */}
          <div className="text-center space-y-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
              {currentValue}%
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {getBodyShapeLabel(currentValue, gender)} Physique
              </h3>
              <p className="text-sm text-gray-600">
                {getBodyShapeDescription(currentValue, gender)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced slider controls with mobile-friendly design */}
      <div className="w-full space-y-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            type="button"
            onClick={() => {
              const newVal = Math.max(currentValue - 1, gender === 'male' ? 8 : 15);
              setCurrentValue(newVal);
              onChange(newVal);
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Minus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[currentValue]}
              onValueChange={handleValueChange}
              max={gender === 'male' ? 35 : 45}
              min={gender === 'male' ? 8 : 15}
              step={1}
              className="w-full"
              data-testid="body-fat-slider"
            />
          </div>
          
          <Button
            type="button"
            onClick={() => {
              const newVal = Math.min(currentValue + 1, gender === 'male' ? 35 : 45);
              setCurrentValue(newVal);
              onChange(newVal);
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
        
        <div className="flex justify-between text-xs md:text-sm text-gray-500 font-medium px-2">
          <span>Very Lean</span>
          <span className="hidden md:inline">Average</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedBodyFatSelector;

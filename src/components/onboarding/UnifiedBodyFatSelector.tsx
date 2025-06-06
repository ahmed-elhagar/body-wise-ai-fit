
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface UnifiedBodyFatSelectorProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const UnifiedBodyFatSelector = ({ value, onChange, gender }: UnifiedBodyFatSelectorProps) => {
  const [currentValue, setCurrentValue] = useState(value || (gender === 'male' ? 20 : 25));

  // Update local state when prop changes
  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value || (gender === 'male' ? 20 : 25));
    }
  }, [value]);

  // Update local state when gender changes
  useEffect(() => {
    const defaultValue = gender === 'male' ? 20 : 25;
    if (!value) {
      setCurrentValue(defaultValue);
      onChange(defaultValue);
    }
  }, [gender, onChange]);

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

  const getBodyFatDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 10) return 'Essential Fat';
      if (percentage < 15) return 'Athletic';
      if (percentage < 20) return 'Fitness';
      if (percentage < 25) return 'Average';
      return 'Above Average';
    } else {
      if (percentage < 16) return 'Essential Fat';
      if (percentage < 21) return 'Athletic';
      if (percentage < 25) return 'Fitness';
      if (percentage < 32) return 'Average';
      return 'Above Average';
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
      
      {/* Main body visualization */}
      <div className="relative rounded-2xl p-4 sm:p-8 min-h-[500px] sm:min-h-[600px] flex flex-col items-center justify-center border border-gray-200 bg-white shadow-lg">
        {/* Body visualization */}
        <div className="flex-1 flex items-center justify-center mb-4 sm:mb-6 relative">
          <div className="relative">
            <img 
              src={getBodyShapeImage(currentValue, gender)}
              alt={`Body shape visualization for ${currentValue}% body fat`}
              className="h-64 sm:h-80 md:h-96 w-auto object-contain transition-all duration-500 ease-in-out"
            />
            
            {/* Overlay percentage indicator */}
            <div className="absolute top-2 right-2 bg-gray-800 text-white rounded-full px-2 py-1 text-xs sm:text-sm font-semibold">
              {currentValue}%
            </div>
          </div>
        </div>

        {/* Percentage display and description */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="bg-gray-100 text-gray-800 px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-sm mb-3">
            <span className="text-2xl sm:text-3xl font-bold">{currentValue}%</span>
          </div>
          <p className="text-sm sm:text-lg font-medium text-gray-700">
            {getBodyFatDescription(currentValue, gender)}
          </p>
        </div>

        {/* Slider with + and - buttons */}
        <div className="w-full max-w-xs sm:max-w-md space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                const newVal = Math.max(currentValue - 1, gender === 'male' ? 8 : 15);
                setCurrentValue(newVal);
                onChange(newVal);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 text-lg sm:text-xl font-bold transition-all duration-300 border border-gray-300"
            >
              −
            </button>
            
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
            
            <button
              onClick={() => {
                const newVal = Math.min(currentValue + 1, gender === 'male' ? 35 : 45);
                setCurrentValue(newVal);
                onChange(newVal);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 text-lg sm:text-xl font-bold transition-all duration-300 border border-gray-300"
            >
              +
            </button>
          </div>
          
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-1">
            <span>Very Lean</span>
            <span>Average</span>
            <span>High</span>
          </div>
        </div>

        {/* Body fat ranges guide */}
        <div className="mt-4 sm:mt-6 bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 w-full max-w-xs sm:max-w-md">
          <h4 className="text-xs sm:text-sm font-medium text-gray-800 mb-2 sm:mb-3">Body Fat Percentage Guide</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {gender === 'male' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">8-14% Athletic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">15-18% Fitness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">19-24% Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">25%+ Above Average</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">16-20% Athletic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">21-25% Fitness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">26-31% Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">32%+ Above Average</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedBodyFatSelector;

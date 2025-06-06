
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface BodyFatSliderProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const BodyFatSlider = ({ value, onChange, gender }: BodyFatSliderProps) => {
  const [currentValue, setCurrentValue] = useState(value || 25);

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onChange(val);
  };

  const getBodyVisualization = (percentage: number, gender: string) => {
    // Create visual representation based on body fat percentage
    const getBodyWidth = (percentage: number) => {
      // Map percentage to visual width (40-80px range)
      const minWidth = 40;
      const maxWidth = 80;
      return minWidth + ((percentage - 10) / 40) * (maxWidth - minWidth);
    };

    const getBodyColor = (percentage: number) => {
      if (percentage < 15) return 'from-blue-300 to-blue-400'; // Very lean
      if (percentage < 20) return 'from-green-300 to-green-400'; // Athletic
      if (percentage < 25) return 'from-yellow-300 to-yellow-400'; // Average
      if (percentage < 30) return 'from-orange-300 to-orange-400'; // Above average
      return 'from-red-300 to-red-400'; // High
    };

    const bodyWidth = getBodyWidth(percentage);
    const colorClass = getBodyColor(percentage);
    const height = gender === 'female' ? 180 : 200;

    return (
      <div className="flex flex-col items-center">
        {/* Head */}
        <div 
          className={`w-8 h-8 bg-gradient-to-br ${colorClass} rounded-full mb-2 border-2 border-gray-300`}
        />
        
        {/* Body */}
        <div 
          className={`bg-gradient-to-br ${colorClass} rounded-2xl border-2 border-gray-300 transition-all duration-300`}
          style={{ 
            width: `${bodyWidth}px`, 
            height: `${height}px`
          }}
        />
        
        {/* Legs */}
        <div className="flex gap-1 mt-1">
          <div 
            className={`bg-gradient-to-br ${colorClass} rounded-full border-2 border-gray-300`}
            style={{ 
              width: `${bodyWidth * 0.3}px`, 
              height: `${height * 0.4}px`
            }}
          />
          <div 
            className={`bg-gradient-to-br ${colorClass} rounded-full border-2 border-gray-300`}
            style={{ 
              width: `${bodyWidth * 0.3}px`, 
              height: `${height * 0.4}px`
            }}
          />
        </div>
      </div>
    );
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

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          Estimate your current body fat percentage
        </Label>
        <p className="text-sm text-gray-600 mt-1">
          Adjust the slider to match your body composition
        </p>
      </div>
      
      {/* Body visualization */}
      <div className="flex justify-center py-8 bg-gray-50 rounded-xl">
        {getBodyVisualization(currentValue, gender)}
      </div>

      {/* Body fat percentage display */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-gray-700 text-white px-6 py-3 rounded-full">
          <span className="text-2xl font-bold">{currentValue}%</span>
        </div>
        <p className="text-sm font-medium text-gray-600">
          {getBodyFatDescription(currentValue, gender)}
        </p>
      </div>

      {/* Slider */}
      <div className="px-4">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={45}
          min={8}
          step={1}
          className="w-full"
          data-testid="body-fat-slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>8% (Very lean)</span>
          <span>45% (High)</span>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Body Fat Estimation Tip</h4>
            <p className="text-sm text-blue-700">This is an estimate to help personalize your fitness plan. You can always adjust this later in your profile settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFatSlider;

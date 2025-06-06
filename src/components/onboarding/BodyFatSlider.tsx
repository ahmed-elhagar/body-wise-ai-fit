
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

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          Estimate your current body fat percentage
        </Label>
      </div>
      
      {/* Body visualization placeholder */}
      <div className="flex justify-center py-8">
        <div className="w-48 h-64 bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
          <div className="text-6xl">
            {gender === 'female' ? '👩' : '👨'}
          </div>
        </div>
      </div>

      {/* Body fat percentage display */}
      <div className="text-center">
        <div className="inline-block bg-gray-700 text-white px-4 py-2 rounded-full">
          <span className="text-lg font-semibold">{currentValue}%</span>
        </div>
      </div>

      {/* Slider */}
      <div className="px-4">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={50}
          min={10}
          step={1}
          className="w-full"
          data-testid="body-fat-slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>10%</span>
          <span>50%</span>
        </div>
      </div>
    </div>
  );
};

export default BodyFatSlider;

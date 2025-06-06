
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
    const getBodySize = (percentage: number) => {
      // Map percentage to visual size adjustments
      const baseScale = 1;
      const scaleMultiplier = percentage / 25; // 25% as baseline
      return Math.max(0.7, Math.min(1.5, baseScale * scaleMultiplier));
    };

    const getBodyColor = (percentage: number) => {
      if (percentage < 15) return '#3B82F6'; // Blue - Very lean
      if (percentage < 20) return '#10B981'; // Green - Athletic
      if (percentage < 25) return '#F59E0B'; // Yellow - Average
      if (percentage < 30) return '#F97316'; // Orange - Above average
      return '#EF4444'; // Red - High
    };

    const scale = getBodySize(percentage);
    const color = getBodyColor(percentage);

    if (gender === 'female') {
      return (
        <svg viewBox="0 0 120 200" className="w-24 h-40 mx-auto">
          {/* Female body silhouette */}
          <g transform={`scale(${scale}) translate(${60 - 60 * scale}, ${100 - 100 * scale})`} fill={color}>
            {/* Head */}
            <ellipse cx="60" cy="25" rx="12" ry="15" />
            
            {/* Torso */}
            <ellipse cx="60" cy="55" rx={8 + percentage * 0.2} ry="20" />
            
            {/* Waist */}
            <ellipse cx="60" cy="80" rx={6 + percentage * 0.15} ry="10" />
            
            {/* Hips */}
            <ellipse cx="60" cy="105" rx={12 + percentage * 0.3} ry="18" />
            
            {/* Arms */}
            <ellipse cx="45" cy="60" rx={3 + percentage * 0.1} ry="25" />
            <ellipse cx="75" cy="60" rx={3 + percentage * 0.1} ry="25" />
            
            {/* Legs */}
            <ellipse cx="54" cy="145" rx={5 + percentage * 0.15} ry="35" />
            <ellipse cx="66" cy="145" rx={5 + percentage * 0.15} ry="35" />
          </g>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 120 200" className="w-24 h-40 mx-auto">
          {/* Male body silhouette */}
          <g transform={`scale(${scale}) translate(${60 - 60 * scale}, ${100 - 100 * scale})`} fill={color}>
            {/* Head */}
            <ellipse cx="60" cy="25" rx="12" ry="15" />
            
            {/* Shoulders */}
            <ellipse cx="60" cy="50" rx={15 + percentage * 0.2} ry="12" />
            
            {/* Torso */}
            <ellipse cx="60" cy="80" rx={10 + percentage * 0.25} ry="25" />
            
            {/* Waist */}
            <ellipse cx="60" cy="110" rx={8 + percentage * 0.2} ry="15" />
            
            {/* Arms */}
            <ellipse cx="42" cy="65" rx={4 + percentage * 0.1} ry="28" />
            <ellipse cx="78" cy="65" rx={4 + percentage * 0.1} ry="28" />
            
            {/* Legs */}
            <ellipse cx="54" cy="155" rx={6 + percentage * 0.15} ry="40" />
            <ellipse cx="66" cy="155" rx={6 + percentage * 0.15} ry="40" />
          </g>
        </svg>
      );
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

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xl font-bold text-gray-800">
          Fine-tune your body composition
        </Label>
        <p className="text-sm text-gray-600 mt-1">
          Adjust the slider to match your current body fat percentage
        </p>
      </div>
      
      {/* Body visualization */}
      <div className="flex justify-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
        {getBodyVisualization(currentValue, gender)}
      </div>

      {/* Body fat percentage display */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full shadow-lg">
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
            <h4 className="text-sm font-medium text-blue-800 mb-1">Body Composition Tip</h4>
            <p className="text-sm text-blue-700">This helps us create more accurate meal plans and exercise recommendations. You can always adjust this later in your profile settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFatSlider;

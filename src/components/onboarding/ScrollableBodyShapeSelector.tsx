
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ScrollableBodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  bodyFatValue: number;
  onBodyFatChange: (value: number) => void;
  gender: string;
}

const ScrollableBodyShapeSelector = ({ 
  value, 
  onChange, 
  bodyFatValue, 
  onBodyFatChange, 
  gender 
}: ScrollableBodyShapeSelectorProps) => {
  const [currentValue, setCurrentValue] = useState(bodyFatValue || 20);

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onBodyFatChange(val);
    
    // Auto-select body shape based on body fat percentage
    let bodyShape = 'average';
    if (gender === 'male') {
      if (val < 15) bodyShape = 'slender';
      else if (val > 25) bodyShape = 'heavy';
    } else {
      if (val < 20) bodyShape = 'slender';
      else if (val > 30) bodyShape = 'heavy';
    }
    onChange(bodyShape);
  };

  const getBodyVisualization = (percentage: number, gender: string) => {
    // Calculate scale and opacity based on body fat percentage
    const getScale = (percentage: number) => {
      return Math.max(0.7, Math.min(1.3, 0.8 + (percentage - 15) * 0.015));
    };

    const scale = getScale(percentage);
    const bodyColor = percentage < 15 ? '#3B82F6' : percentage < 25 ? '#10B981' : '#F59E0B';

    return (
      <div className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden">
        {/* Placeholder for real body shape images */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Background placeholder image */}
            <div className="w-32 h-72 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <img 
                src={gender === 'female' 
                  ? `https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&h=300&fit=crop&crop=center&auto=format`
                  : `https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=150&h=300&fit=crop&crop=center&auto=format`
                }
                alt={`${gender} body visualization`}
                className="w-full h-full object-cover opacity-30"
                style={{ 
                  transform: `scale(${scale})`,
                  filter: `brightness(${1.2 - percentage * 0.01}) contrast(${1.1 + percentage * 0.005})`
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Dynamic SVG overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 120 250" className="w-28 h-64 opacity-70">
                  <g fill={bodyColor} transform={`scale(${scale}) translate(${60 - 60 * scale}, ${125 - 125 * scale})`}>
                    {gender === 'female' ? (
                      <>
                        {/* Female silhouette */}
                        <ellipse cx="60" cy="30" rx="15" ry="18" />
                        <ellipse cx="60" cy="65" rx={10 + percentage * 0.2} ry="22" />
                        <ellipse cx="60" cy="95" rx={8 + percentage * 0.15} ry="12" />
                        <ellipse cx="60" cy="125" rx={14 + percentage * 0.3} ry="20" />
                        <ellipse cx="42" cy="75" rx={4 + percentage * 0.1} ry="28" />
                        <ellipse cx="78" cy="75" rx={4 + percentage * 0.1} ry="28" />
                        <ellipse cx="52" cy="180" rx={6 + percentage * 0.15} ry="40" />
                        <ellipse cx="68" cy="180" rx={6 + percentage * 0.15} ry="40" />
                      </>
                    ) : (
                      <>
                        {/* Male silhouette */}
                        <ellipse cx="60" cy="30" rx="15" ry="18" />
                        <ellipse cx="60" cy="60" rx={18 + percentage * 0.2} ry="15" />
                        <ellipse cx="60" cy="95" rx={12 + percentage * 0.25} ry="28" />
                        <ellipse cx="60" cy="130" rx={10 + percentage * 0.2} ry="18" />
                        <ellipse cx="40" cy="80" rx={5 + percentage * 0.1} ry="32" />
                        <ellipse cx="80" cy="80" rx={5 + percentage * 0.1} ry="32" />
                        <ellipse cx="52" cy="190" rx={7 + percentage * 0.15} ry="45" />
                        <ellipse cx="68" cy="190" rx={7 + percentage * 0.15} ry="45" />
                      </>
                    )}
                  </g>
                </svg>
              </div>
            </div>
            
            {/* Body fat percentage indicator */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-lg font-bold">{currentValue}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Replace with your licensed body shape images */}
        <div className="absolute top-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-2">
          <p className="text-xs text-blue-700 font-medium">
            Replace with licensed {gender} body images
          </p>
        </div>
      </div>
    );
  };

  const getBodyDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 10) return 'Essential fat - Athletic';
      if (percentage < 15) return 'Athletic - Very lean';
      if (percentage < 20) return 'Fitness - Lean';
      if (percentage < 25) return 'Average - Healthy';
      return 'Above average';
    } else {
      if (percentage < 16) return 'Essential fat - Athletic';
      if (percentage < 21) return 'Athletic - Very lean';
      if (percentage < 25) return 'Fitness - Lean';
      if (percentage < 32) return 'Average - Healthy';
      return 'Above average';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Label className="text-2xl font-bold text-gray-800 mb-2 block">
          Choose your body composition
        </Label>
        <p className="text-gray-600">
          Scroll to adjust your current body fat percentage
        </p>
      </div>
      
      {/* Body visualization */}
      <div className="flex justify-center">
        {getBodyVisualization(currentValue, gender)}
      </div>

      {/* Body description */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">
          {getBodyDescription(currentValue, gender)}
        </p>
      </div>

      {/* Slider */}
      <div className="px-6">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={gender === 'male' ? 35 : 40}
          min={gender === 'male' ? 8 : 12}
          step={1}
          className="w-full"
          data-testid="body-composition-slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{gender === 'male' ? '8%' : '12%'} (Very lean)</span>
          <span>{gender === 'male' ? '35%' : '40%'} (High)</span>
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
            <p className="text-sm text-blue-700">
              This helps us create more accurate meal plans and exercise recommendations. 
              The visualization updates as you adjust the slider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableBodyShapeSelector;

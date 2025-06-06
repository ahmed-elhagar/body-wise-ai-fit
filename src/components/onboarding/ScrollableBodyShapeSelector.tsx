
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
    // Calculate scale based on body fat percentage
    const getScale = (percentage: number) => {
      return Math.max(0.8, Math.min(1.2, 0.9 + (percentage - 20) * 0.01));
    };

    const scale = getScale(percentage);
    
    // Determine image path based on gender and body fat percentage
    const getImagePath = (percentage: number, gender: string) => {
      let category = 'average';
      if (gender === 'male') {
        if (percentage < 15) category = 'lean';
        else if (percentage > 25) category = 'heavy';
      } else {
        if (percentage < 20) category = 'lean';
        else if (percentage > 30) category = 'heavy';
      }
      
      // Return the path where you should place your licensed images
      return `/images/body-shapes/${gender}-${category}.jpg`;
    };

    const imagePath = getImagePath(percentage, gender);

    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main body image container */}
            <div className="w-40 h-80 bg-white rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
              <img 
                src={imagePath}
                alt={`${gender} body visualization at ${percentage}% body fat`}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ 
                  transform: `scale(${scale})`,
                  filter: `brightness(${1.1 - percentage * 0.005}) contrast(${1.05 + percentage * 0.002})`
                }}
                onError={(e) => {
                  // Fallback to placeholder when image not found
                  e.currentTarget.src = `https://images.unsplash.com/photo-${gender === 'female' ? '1594381898411-846e7d193883' : '1583468982228-19f19164aee2'}?w=200&h=400&fit=crop&crop=center&auto=format`;
                }}
              />
              
              {/* Overlay indicator for image replacement */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Replace with licensed image
              </div>
            </div>
            
            {/* Body fat percentage indicator */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-xl font-bold">{currentValue}%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Instructions for image placement */}
        <div className="absolute top-4 right-4 bg-amber-100 border border-amber-300 rounded-lg p-3 max-w-48">
          <p className="text-xs text-amber-800 font-medium">
            📁 Place your licensed {gender} body images in:
            <br />
            <code className="text-xs bg-amber-200 px-1 rounded">
              /public/images/body-shapes/
            </code>
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
    <div className="space-y-6 px-2 sm:px-0">
      <div className="text-center">
        <Label className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 block">
          Choose your body composition
        </Label>
        <p className="text-sm sm:text-base text-gray-600">
          Scroll to adjust your current body fat percentage
        </p>
      </div>
      
      {/* Body visualization */}
      <div className="flex justify-center px-4">
        {getBodyVisualization(currentValue, gender)}
      </div>

      {/* Body description */}
      <div className="text-center space-y-2">
        <p className="text-base sm:text-lg font-medium text-gray-700">
          {getBodyDescription(currentValue, gender)}
        </p>
      </div>

      {/* Slider */}
      <div className="px-4 sm:px-6">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          max={gender === 'male' ? 35 : 40}
          min={gender === 'male' ? 8 : 12}
          step={1}
          className="w-full"
          data-testid="body-composition-slider"
        />
        <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
          <span>{gender === 'male' ? '8%' : '12%'} (Very lean)</span>
          <span>{gender === 'male' ? '35%' : '40%'} (High)</span>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mx-2 sm:mx-0">
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

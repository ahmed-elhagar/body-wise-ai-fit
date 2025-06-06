
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface UnifiedBodyShapeSelectorProps {
  bodyShape: string;
  bodyFatPercentage: number;
  gender: string;
  onBodyShapeChange: (value: string) => void;
  onBodyFatChange: (value: number) => void;
}

const UnifiedBodyShapeSelector = ({ 
  bodyShape, 
  bodyFatPercentage, 
  gender,
  onBodyShapeChange, 
  onBodyFatChange 
}: UnifiedBodyShapeSelectorProps) => {
  
  const [currentBodyFat, setCurrentBodyFat] = useState(bodyFatPercentage);

  useEffect(() => {
    setCurrentBodyFat(bodyFatPercentage);
  }, [bodyFatPercentage]);

  const bodyShapes = [
    {
      id: 'lean',
      name: 'Lean/Athletic',
      description: 'Low body fat, defined muscles',
      maleImage: '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png',
      femaleImage: '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png',
      characteristics: ['Visible muscle definition', 'Low body fat', 'Athletic appearance']
    },
    {
      id: 'average',
      name: 'Average/Normal', 
      description: 'Balanced body composition',
      maleImage: '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png',
      femaleImage: '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png',
      characteristics: ['Moderate body fat', 'Normal proportions', 'Healthy appearance']
    },
    {
      id: 'heavy',
      name: 'Curvy/Fuller',
      description: 'Higher body fat percentage',
      maleImage: '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png',
      femaleImage: '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png',
      characteristics: ['Higher body fat', 'Fuller figure', 'Softer appearance']
    }
  ];

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setCurrentBodyFat(newValue);
    onBodyFatChange(newValue);
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

  const getImageForBodyFat = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 20) return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png';
      if (percentage < 30) return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png';
      return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png';
    } else {
      if (percentage < 15) return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png';
      if (percentage < 22) return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png';
      return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png';
    }
  };

  return (
    <div className="space-y-8">
      {/* Body Shape Selection */}
      <div className="space-y-6">
        <Label className="text-lg font-semibold text-gray-800">Choose your body type:</Label>
        
        <div className="grid grid-cols-1 gap-4">
          {bodyShapes.map((shape) => {
            const isSelected = bodyShape === shape.id;
            const imageSrc = gender === 'female' ? shape.femaleImage : shape.maleImage;
            
            return (
              <Card
                key={shape.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => onBodyShapeChange(shape.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Body shape image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-20 rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                      <img 
                        src={imageSrc}
                        alt={`${shape.name} body type`}
                        className="w-full h-full object-contain"
                      />
                      
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{shape.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{shape.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <ul className="space-y-1">
                        {shape.characteristics.map((char, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Body Fat Slider */}
      <div className="border-t pt-8">
        <div className="space-y-6">
          <div className="text-center">
            <Label className="text-lg font-semibold text-gray-800 mb-2 block">
              Fine-tune your body composition
            </Label>
            <p className="text-sm text-gray-600">
              Adjust the slider to match your current body fat percentage
            </p>
          </div>
          
          {/* Visual representation */}
          <div className="flex justify-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <div className="relative">
              <div className="w-32 h-40 flex items-center justify-center mx-auto">
                <img 
                  src={getImageForBodyFat(currentBodyFat, gender)}
                  alt={`Body visualization for ${currentBodyFat}% body fat`}
                  className="w-full h-full object-contain transition-all duration-500 ease-in-out"
                />
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
                  <span className="text-xs font-semibold text-gray-700">{currentBodyFat}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body fat percentage display */}
          <div className="text-center space-y-3">
            <div className={`inline-block bg-gradient-to-r ${getBodyFatColor(currentBodyFat, gender)} text-white px-6 py-3 rounded-full shadow-lg`}>
              <span className="text-2xl font-bold">{currentBodyFat}%</span>
            </div>
            <p className="text-base font-medium text-gray-700">
              {getBodyFatDescription(currentBodyFat, gender)}
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <Slider
              value={[currentBodyFat]}
              onValueChange={handleSliderChange}
              min={gender === 'male' ? 8 : 15}
              max={gender === 'male' ? 35 : 45}
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
  );
};

export default UnifiedBodyShapeSelector;

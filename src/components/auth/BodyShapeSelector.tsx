
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import BodyFatSlider from "@/components/onboarding/BodyFatSlider";
import { mapBodyFatToBodyShape } from "@/utils/signupValidation";

interface BodyShapeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

const BodyShapeSelector = ({ value, onChange, gender }: BodyShapeSelectorProps) => {
  // Initialize with a default value based on gender
  const defaultBodyFat = gender === 'male' ? 20 : 25;
  const [bodyFatPercentage, setBodyFatPercentage] = useState(
    value ? parseFloat(value) : defaultBodyFat
  );

  const handleBodyFatChange = (newBodyFat: number) => {
    console.log('Body fat changed:', newBodyFat);
    setBodyFatPercentage(newBodyFat);
    
    // Map body fat percentage to body shape and update parent
    const bodyShape = mapBodyFatToBodyShape(newBodyFat, gender);
    console.log('Mapped body shape:', bodyShape);
    
    // Pass the body fat percentage as string to match the expected format
    onChange(newBodyFat.toString());
  };

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

  // Determine current body shape based on body fat percentage
  const currentBodyShape = mapBodyFatToBodyShape(bodyFatPercentage, gender);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="text-center">
          <Label className="text-2xl font-bold text-gray-800 mb-2 block">
            Choose your current body type
          </Label>
          <p className="text-gray-600">
            Use the slider below to set your estimated body fat percentage
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {bodyShapes.map((shape) => {
            const isSelected = currentBodyShape === shape.id;
            const imageSrc = gender === 'female' ? shape.femaleImage : shape.maleImage;
            
            return (
              <Card
                key={shape.id}
                className={`p-6 transition-all duration-300 border-2 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                data-testid={`body-shape-${shape.id}`}
              >
                <div className="flex items-center gap-6">
                  {/* Body shape image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                      <img 
                        src={imageSrc}
                        alt={`${shape.name} body type`}
                        className="w-full h-full object-contain"
                        style={{
                          filter: isSelected ? 'brightness(1.1) saturate(1.1)' : 'brightness(0.9)'
                        }}
                      />
                      
                      {/* Selection overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">{shape.name}</h3>
                    <p className="text-gray-600 mb-3">{shape.description}</p>
                    
                    {/* Body type characteristics */}
                    <div className="text-sm text-gray-500">
                      <ul className="space-y-1">
                        {shape.characteristics.map((char, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
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

      <div className="border-t pt-8">
        <BodyFatSlider
          value={bodyFatPercentage}
          onChange={handleBodyFatChange}
          gender={gender}
        />
      </div>
    </div>
  );
};

export default BodyShapeSelector;

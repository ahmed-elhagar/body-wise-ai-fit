
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import BodyFatSlider from "./BodyFatSlider";

interface BodyShapeVisualSelectorProps {
  value: string;
  onChange: (value: string) => void;
  gender: string;
}

const BodyShapeVisualSelector = ({ value, onChange, gender }: BodyShapeVisualSelectorProps) => {
  const [bodyFatPercentage, setBodyFatPercentage] = useState(25);

  const bodyShapes = [
    {
      id: 'slender',
      name: 'Ectomorph',
      description: 'Naturally thin, fast metabolism',
      malePlaceholder: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&crop=center',
      femalePlaceholder: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop&crop=center'
    },
    {
      id: 'average',
      name: 'Mesomorph', 
      description: 'Athletic build, balanced metabolism',
      malePlaceholder: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=200&h=300&fit=crop&crop=center',
      femalePlaceholder: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=300&fit=crop&crop=center'
    },
    {
      id: 'heavy',
      name: 'Endomorph',
      description: 'Broader build, slower metabolism',
      malePlaceholder: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=300&fit=crop&crop=center',
      femalePlaceholder: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=300&fit=crop&crop=center'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="text-center">
          <Label className="text-2xl font-bold text-gray-800 mb-2 block">
            Choose your current body type
          </Label>
          <p className="text-gray-600">
            Select the body type that best matches your current physique
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {bodyShapes.map((shape) => {
            const isSelected = value === shape.id;
            const imageSrc = gender === 'female' ? shape.femalePlaceholder : shape.malePlaceholder;
            
            return (
              <Card
                key={shape.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => onChange(shape.id)}
                data-testid={`body-shape-${shape.id}`}
              >
                <div className="flex items-center gap-6">
                  {/* Placeholder for real body shape image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-32 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
                      <img 
                        src={imageSrc}
                        alt={`${shape.name} body type`}
                        className="w-full h-full object-cover opacity-50"
                        onError={(e) => {
                          // Fallback to a simple silhouette if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xs text-gray-500 text-center px-2">
                          <div className="font-medium">{shape.name}</div>
                          <div className="text-xs opacity-75">Image</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">{shape.name}</h3>
                    <p className="text-gray-600 mb-3">{shape.description}</p>
                    
                    {/* Body type characteristics */}
                    <div className="text-sm text-gray-500">
                      {shape.id === 'slender' && (
                        <ul className="space-y-1">
                          <li>• Narrow shoulders and hips</li>
                          <li>• Fast metabolism</li>
                          <li>• Difficulty gaining weight</li>
                        </ul>
                      )}
                      {shape.id === 'average' && (
                        <ul className="space-y-1">
                          <li>• Well-proportioned build</li>
                          <li>• Moderate metabolism</li>
                          <li>• Responds well to exercise</li>
                        </ul>
                      )}
                      {shape.id === 'heavy' && (
                        <ul className="space-y-1">
                          <li>• Wider bone structure</li>
                          <li>• Slower metabolism</li>
                          <li>• Gains weight easily</li>
                        </ul>
                      )}
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
          onChange={setBodyFatPercentage}
          gender={gender}
        />
      </div>
    </div>
  );
};

export default BodyShapeVisualSelector;

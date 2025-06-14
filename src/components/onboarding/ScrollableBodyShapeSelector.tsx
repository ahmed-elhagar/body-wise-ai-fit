
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  
  const bodyShapes = [
    { 
      id: 'lean', 
      label: 'Lean', 
      description: 'Low body fat, defined muscles',
      maleImage: '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png',
      femaleImage: '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'
    },
    { 
      id: 'athletic', 
      label: 'Athletic', 
      description: 'Moderate muscle definition',
      maleImage: '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png',
      femaleImage: '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'
    },
    { 
      id: 'average', 
      label: 'Average', 
      description: 'Normal body composition',
      maleImage: '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png',
      femaleImage: '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'
    },
    { 
      id: 'curvy', 
      label: 'Curvy', 
      description: 'Fuller figure with curves',
      maleImage: '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png',
      femaleImage: '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'
    },
    { 
      id: 'heavy', 
      label: 'Heavy', 
      description: 'Higher body fat percentage',
      maleImage: '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png',
      femaleImage: '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png'
    },
  ];

  return (
    <div className="space-y-6">
      <Label className="text-sm font-medium text-gray-700">
        Body Shape (Optional)
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {bodyShapes.map((shape) => {
          const imageSrc = gender === 'female' ? shape.femaleImage : shape.maleImage;
          
          return (
            <Button
              key={shape.id}
              type="button"
              variant={value === shape.id ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-3 ${
                value === shape.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onChange(shape.id)}
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img 
                  src={imageSrc}
                  alt={`${shape.label} body shape`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{shape.label}</div>
                <div className="text-xs text-gray-500 mt-1">{shape.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="mt-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Body Fat Percentage: {bodyFatValue}%
        </Label>
        <input
          type="range"
          min={gender === 'male' ? 8 : 15}
          max={gender === 'male' ? 35 : 45}
          value={bodyFatValue}
          onChange={(e) => onBodyFatChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((bodyFatValue - (gender === 'male' ? 8 : 15)) / ((gender === 'male' ? 35 : 45) - (gender === 'male' ? 8 : 15))) * 100}%, #e5e7eb ${((bodyFatValue - (gender === 'male' ? 8 : 15)) / ((gender === 'male' ? 35 : 45) - (gender === 'male' ? 8 : 15))) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Very Lean</span>
          <span>Average</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollableBodyShapeSelector;

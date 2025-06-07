
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface BodyShapeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const BodyShapeSelector = ({ value, onChange, gender }: BodyShapeSelectorProps) => {
  const [currentValue, setCurrentValue] = useState(value || (gender === 'male' ? 20 : 25));

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onChange(val);
  };

  const getBodyShapeImage = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 20) {
        return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'; // Lean female
      } else if (percentage < 30) {
        return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'; // Average female
      } else {
        return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png'; // Fuller female
      }
    } else {
      if (percentage < 15) {
        return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png'; // Lean male
      } else if (percentage < 25) {
        return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png'; // Average male
      } else {
        return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png'; // Fuller male
      }
    }
  };

  const getBodyShapeLabel = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 15) return 'Athletic';
      else if (percentage < 25) return 'Average';
      else return 'Strong';
    } else {
      if (percentage < 20) return 'Athletic';
      else if (percentage < 30) return 'Average';
      else return 'Curvy';
    }
  };

  const getBodyShapeDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 15) return 'Defined muscles and low body fat';
      else if (percentage < 25) return 'Healthy with some muscle definition';
      else return 'Strong build with solid mass';
    } else {
      if (percentage < 20) return 'Athletic with visible muscle tone';
      else if (percentage < 30) return 'Healthy with natural curves';
      else return 'Beautiful curves and feminine figure';
    }
  };

  return (
    <div className="space-y-8">
      {/* Body visualization */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border border-gray-200 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <img 
              src={getBodyShapeImage(currentValue, gender)}
              alt={`Body shape visualization for ${currentValue}% body fat`}
              className="h-80 w-auto object-contain transition-all duration-500 ease-in-out drop-shadow-xl"
            />
          </div>

          <div className="text-center space-y-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full text-2xl font-bold shadow-lg">
              {currentValue}%
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 space-y-1 max-w-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                {getBodyShapeLabel(currentValue, gender)} Physique
              </h3>
              <p className="text-sm text-gray-600">
                {getBodyShapeDescription(currentValue, gender)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced slider controls */}
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => {
              const newVal = Math.max(currentValue - 1, gender === 'male' ? 8 : 15);
              setCurrentValue(newVal);
              onChange(newVal);
            }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Minus className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[currentValue]}
              onValueChange={handleValueChange}
              max={gender === 'male' ? 35 : 45}
              min={gender === 'male' ? 8 : 15}
              step={1}
              className="w-full"
            />
          </div>
          
          <Button
            type="button"
            onClick={() => {
              const newVal = Math.min(currentValue + 1, gender === 'male' ? 35 : 45);
              setCurrentValue(newVal);
              onChange(newVal);
            }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 font-medium px-2">
          <span>Very Lean</span>
          <span className="hidden md:inline">Average</span>
          <span>Higher</span>
        </div>
      </div>

      {/* Body fat guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-3">Body Fat Percentage Guide</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {gender === 'male' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>8-14% Athletic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>15-24% Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>25-35% Higher</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>15-20% Athletic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>21-30% Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>31-45% Higher</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyShapeSelector;

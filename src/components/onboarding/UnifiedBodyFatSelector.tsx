
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface UnifiedBodyFatSelectorProps {
  value: number;
  onChange: (value: number) => void;
  gender: string;
}

const UnifiedBodyFatSelector = ({ value, onChange, gender }: UnifiedBodyFatSelectorProps) => {
  const [currentValue, setCurrentValue] = useState(value || (gender === 'male' ? 20 : 25));

  // Update local state when prop changes
  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value || (gender === 'male' ? 20 : 25));
    }
  }, [value]);

  // Update local state when gender changes
  useEffect(() => {
    const defaultValue = gender === 'male' ? 20 : 25;
    if (!value) {
      setCurrentValue(defaultValue);
      onChange(defaultValue);
    }
  }, [gender, onChange]);

  const handleValueChange = (newValue: number[]) => {
    const val = newValue[0];
    setCurrentValue(val);
    onChange(val);
  };

  // Define body shape images based on body fat percentage and gender
  const getBodyShapeImage = (percentage: number, gender: string) => {
    if (gender === 'female') {
      if (percentage < 20) {
        return '/lovable-uploads/18f030f2-25e9-489f-870f-7d210f07c56c.png'; // Lean female
      } else if (percentage < 30) {
        return '/lovable-uploads/977077ac-e5b9-46f0-94ff-dc5ec3e8afb6.png'; // Average female
      } else {
        return '/lovable-uploads/274c1566-79f5-45bb-9ef9-0dd9bb44f476.png'; // Higher body fat female
      }
    } else {
      if (percentage < 15) {
        return '/lovable-uploads/08f61d04-b775-4704-9437-05a994afa09a.png'; // Lean male
      } else if (percentage < 25) {
        return '/lovable-uploads/3b2668b9-5ab6-4bb4-80a0-f994b13e9e92.png'; // Average male
      } else {
        return '/lovable-uploads/2a1df9fc-703a-4f55-a427-e5dc54d63b2a.png'; // Higher body fat male
      }
    }
  };

  const getBodyFatDescription = (percentage: number, gender: string) => {
    if (gender === 'male') {
      if (percentage < 10) return 'Essential Fat';
      if (percentage < 15) return 'Athletic';
      if (percentage < 20) return 'Fitness';
      if (percentage < 25) return 'Average';
      return 'Above Average';
    } else {
      if (percentage < 16) return 'Essential Fat';
      if (percentage < 21) return 'Athletic';
      if (percentage < 25) return 'Fitness';
      if (percentage < 32) return 'Average';
      return 'Above Average';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Label className="text-xl font-bold text-gray-800 mb-2 block">
          Estimate your current body fat percentage
        </Label>
        <p className="text-sm text-gray-600">
          Use the slider to match your current physique
        </p>
      </div>
      
      {/* Main body visualization - using app's gradient colors */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 rounded-2xl p-8 min-h-[600px] flex flex-col items-center justify-center">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10 rounded-2xl">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Body visualization */}
        <div className="flex-1 flex items-center justify-center mb-6 relative z-10">
          <div className="relative">
            <img 
              src={getBodyShapeImage(currentValue, gender)}
              alt={`Body shape visualization for ${currentValue}% body fat`}
              className="h-96 w-auto object-contain transition-all duration-500 ease-in-out drop-shadow-2xl"
            />
            
            {/* Overlay percentage indicator */}
            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              <span className="text-sm font-semibold text-white">{currentValue}%</span>
            </div>
          </div>
        </div>

        {/* Percentage display and description */}
        <div className="mb-6 text-center relative z-10">
          <div className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full shadow-lg border border-white/30 mb-3">
            <span className="text-3xl font-bold">{currentValue}%</span>
          </div>
          <p className="text-lg font-medium text-white/90">
            {getBodyFatDescription(currentValue, gender)}
          </p>
        </div>

        {/* Slider with + and - buttons */}
        <div className="w-full max-w-md space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const newVal = Math.max(currentValue - 1, gender === 'male' ? 8 : 15);
                setCurrentValue(newVal);
                onChange(newVal);
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-xl font-bold transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              −
            </button>
            
            <div className="flex-1">
              <Slider
                value={[currentValue]}
                onValueChange={handleValueChange}
                max={gender === 'male' ? 35 : 45}
                min={gender === 'male' ? 8 : 15}
                step={1}
                className="w-full"
                data-testid="body-fat-slider"
              />
            </div>
            
            <button
              onClick={() => {
                const newVal = Math.min(currentValue + 1, gender === 'male' ? 35 : 45);
                setCurrentValue(newVal);
                onChange(newVal);
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center text-white text-xl font-bold transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              +
            </button>
          </div>
          
          <div className="flex justify-between text-xs text-white/70">
            <span>Very Lean</span>
            <span>Average</span>
            <span>High</span>
          </div>
        </div>

        {/* Body fat ranges guide */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 w-full max-w-md relative z-10">
          <h4 className="text-sm font-medium text-white mb-3">Body Fat Percentage Guide</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {gender === 'male' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/80">8-14% Athletic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80">15-18% Fitness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/80">19-24% Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-white/80">25%+ Above Average</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/80">16-20% Athletic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white/80">21-25% Fitness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/80">26-31% Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-white/80">32%+ Above Average</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedBodyFatSelector;

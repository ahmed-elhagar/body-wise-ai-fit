
import { useMemo } from "react";

interface EnhancedMacroWheelProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goalCalories?: number;
}

const EnhancedMacroWheel = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  goalCalories = 2000 
}: EnhancedMacroWheelProps) => {
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  const calorieProgress = Math.min((calories / goalCalories) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (calorieProgress / 100) * circumference;
  
  // Calculate macro percentages
  const totalMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);
  const macroPercentages = useMemo(() => {
    if (totalMacroCalories === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((protein * 4 / totalMacroCalories) * 100),
      carbs: Math.round((carbs * 4 / totalMacroCalories) * 100),
      fat: Math.round((fat * 9 / totalMacroCalories) * 100)
    };
  }, [protein, carbs, fat, totalMacroCalories]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Progress Circle */}
      <div className="relative">
        <svg width="140" height="140" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">{Math.round(calories)}</div>
          <div className="text-xs text-gray-500">of {goalCalories}</div>
          <div className="text-xs text-gray-400">calories</div>
        </div>
      </div>

      {/* Macro breakdown */}
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-blue-700">{Math.round(protein)}g</div>
            <div className="text-xs text-blue-600">Protein</div>
            <div className="text-xs text-blue-500">{macroPercentages.protein}%</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-orange-700">{Math.round(carbs)}g</div>
            <div className="text-xs text-orange-600">Carbs</div>
            <div className="text-xs text-orange-500">{macroPercentages.carbs}%</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-purple-700">{Math.round(fat)}g</div>
            <div className="text-xs text-purple-600">Fat</div>
            <div className="text-xs text-purple-500">{macroPercentages.fat}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMacroWheel;

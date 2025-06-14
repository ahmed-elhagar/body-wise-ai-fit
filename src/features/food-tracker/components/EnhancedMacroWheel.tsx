
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedMacroWheelProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goalCalories: number;
}

const EnhancedMacroWheel = (props: EnhancedMacroWheelProps) => {
  const { calories, protein, carbs, fat, goalCalories } = props;
  const progress = goalCalories > 0 ? (calories / goalCalories) * 100 : 0;

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4 text-center">
        <h4 className="font-semibold">Macro Wheel (Placeholder)</h4>
        <div className="my-2">
          <div 
            className="radial-progress" 
            style={{ "--value": progress, "--size": "8rem" } as React.CSSProperties}
          >
            {Math.round(calories)} cal
          </div>
        </div>
        <div className="text-sm grid grid-cols-3 gap-1">
          <span>P: {Math.round(protein)}g</span>
          <span>C: {Math.round(carbs)}g</span>
          <span>F: {Math.round(fat)}g</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMacroWheel;

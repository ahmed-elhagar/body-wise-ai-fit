
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";

interface FoodAnalysisResultsProps {
  result: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence?: number;
  };
  onAddToLog?: (food: any) => void;
  className?: string;
}

const FoodAnalysisResults = ({ result, onAddToLog, className }: FoodAnalysisResultsProps) => {
  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{result.name}</h3>
            {result.confidence && (
              <Badge className={confidenceColor(result.confidence)}>
                <CheckCircle className="w-3 h-3 mr-1" />
                {Math.round(result.confidence * 100)}% confident
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calories:</span>
                <span className="font-medium">{result.calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Protein:</span>
                <span className="font-medium">{result.protein}g</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Carbs:</span>
                <span className="font-medium">{result.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fat:</span>
                <span className="font-medium">{result.fat}g</span>
              </div>
            </div>
          </div>

          {onAddToLog && (
            <Button 
              onClick={() => onAddToLog(result)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Food Log
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodAnalysisResults;

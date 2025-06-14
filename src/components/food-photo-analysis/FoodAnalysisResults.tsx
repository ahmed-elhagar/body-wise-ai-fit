
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils } from "lucide-react";

interface FoodAnalysisResultsProps {
  result: any;
  onAddToLog: (food: any) => void;
  className?: string;
}

const FoodAnalysisResults = ({ result, onAddToLog, className = "" }: FoodAnalysisResultsProps) => {
  if (!result) return null;

  return (
    <Card className={`${className} bg-white/90 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{result.name}</h3>
            <p className="text-gray-600">{result.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Calories</span>
              <p className="font-bold">{result.calories}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Protein</span>
              <p className="font-bold">{result.protein}g</p>
            </div>
          </div>

          <Button 
            onClick={() => onAddToLog(result)}
            className="w-full bg-fitness-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Food Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodAnalysisResults;


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FoodAnalysisResultsProps {
  result: any;
  onAddToLog: (food: any) => void;
  className?: string;
}

const FoodAnalysisResults = ({
  result,
  onAddToLog,
  className
}: FoodAnalysisResultsProps) => {
  const { t } = useLanguage();

  if (!result) return null;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Utensils className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          {t('Analysis Results')}
        </h3>
      </div>
      
      <div className="space-y-4">
        {result.foods?.map((food: any, index: number) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{food.name}</h4>
              <Badge variant="secondary">
                {food.calories} cal
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{food.description}</p>
            <Button
              onClick={() => onAddToLog(food)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Add to Log')}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FoodAnalysisResults;

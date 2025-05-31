
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Clock, Zap } from "lucide-react";

interface SnackCardProps {
  snack: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prep_time?: number;
  };
}

const SnackCard = ({ snack }: SnackCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {snack.name.replace('🍎 ', '')}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/60 border-green-300 text-green-700">
                <Zap className="w-3 h-3 mr-1" />
                Quick Snack
              </Badge>
              {snack.prep_time && (
                <Badge variant="outline" className="bg-white/60 border-green-300 text-green-700">
                  <Clock className="w-3 h-3 mr-1" />
                  {snack.prep_time} min
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-white/70 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">{snack.calories}</div>
            <div className="text-xs text-green-600 font-medium">Calories</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">{snack.protein}g</div>
            <div className="text-xs text-green-600 font-medium">Protein</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">{snack.carbs}g</div>
            <div className="text-xs text-green-600 font-medium">Carbs</div>
          </div>
          <div className="text-center p-3 bg-white/70 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">{snack.fat}g</div>
            <div className="text-xs text-green-600 font-medium">Fat</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackCard;

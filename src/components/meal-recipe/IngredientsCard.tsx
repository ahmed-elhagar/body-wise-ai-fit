
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";

interface IngredientsCardProps {
  ingredients: any[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-600/30 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
            <ShoppingBasket className="w-5 h-5 text-white" />
          </div>
          Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ingredients.map((ingredient: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-3 bg-green-500/10 rounded-xl border border-green-500/20 hover:bg-green-500/20 transition-colors backdrop-blur-sm">
            <span className="font-medium text-gray-200">{ingredient.name}</span>
            <span className="text-green-300 font-semibold bg-gray-700/50 px-2 py-1 rounded-lg text-sm backdrop-blur-sm">
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IngredientsCard;

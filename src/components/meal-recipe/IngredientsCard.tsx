
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";

interface IngredientsCardProps {
  ingredients: any[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {
  return (
    <Card className="bg-white border-2 border-green-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <ShoppingBasket className="w-5 h-5 text-white" />
          </div>
          Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ingredients.map((ingredient: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
            <span className="font-medium text-gray-800">{ingredient.name}</span>
            <span className="text-green-700 font-semibold bg-white px-2 py-1 rounded-lg text-sm border border-green-200">
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IngredientsCard;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";

interface IngredientsCardProps {
  ingredients: any[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {
  return (
    <Card className="bg-white border-2 border-fitness-primary-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-fitness-primary-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
            <ShoppingBasket className="w-5 h-5 text-white" />
          </div>
          Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ingredients.map((ingredient: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-3 bg-fitness-primary-50 rounded-xl border border-fitness-primary-200 hover:bg-fitness-primary-100 transition-colors">
            <span className="font-medium text-fitness-primary-700">{ingredient.name}</span>
            <span className="text-fitness-primary-600 font-semibold bg-white px-2 py-1 rounded-lg text-sm border border-fitness-primary-200">
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IngredientsCard;

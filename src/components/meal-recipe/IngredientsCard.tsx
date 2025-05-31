
import { Card, CardContent } from "@/components/ui/card";

interface IngredientsCardProps {
  ingredients: any[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {
  return (
    <Card className="bg-white border-fitness-primary-200 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-fitness-primary-700">
          <span className="text-2xl mr-3">🥘</span>
          Ingredients
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ingredients.map((ingredient: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-fitness-primary-50 rounded-lg border border-fitness-primary-100">
              <span className="font-medium text-fitness-primary-700">{ingredient.name}</span>
              <span className="text-fitness-accent-600 font-semibold">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientsCard;

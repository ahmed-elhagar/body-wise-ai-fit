
import { Card } from "@/components/ui/card";

interface IngredientsCardProps {
  ingredients: any[];
}

const IngredientsCard = ({ ingredients }: IngredientsCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-2xl mr-2">🥘</span>
        Ingredients
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ingredients.map((ingredient: any, index: number) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{ingredient.name}</span>
            <span className="text-fitness-primary font-semibold">
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default IngredientsCard;

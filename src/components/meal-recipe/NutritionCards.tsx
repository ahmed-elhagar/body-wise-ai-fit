
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  const nutritionItems = [
    {
      label: "Calories",
      value: meal.calories,
      unit: "",
      icon: Flame,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      label: "Protein",
      value: meal.protein,
      unit: "g",
      icon: Beef,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      label: "Carbs",
      value: meal.carbs,
      unit: "g",
      icon: Wheat,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      label: "Fat",
      value: meal.fat,
      unit: "g",
      icon: Droplets,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nutritionItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card key={item.label} className={`${item.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow`}>
            <CardContent className="p-4 text-center space-y-2">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}{item.unit}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {item.label}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NutritionCards;

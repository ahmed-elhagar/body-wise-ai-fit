import { Card, CardContent } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  const isSnack = meal.name.includes('🍎') || (meal.meal_type || meal.type) === 'snack';
  
  const nutritionItems = [
    {
      label: "Calories",
      value: meal.calories,
      unit: "",
      icon: Flame,
      color: isSnack ? "from-fitness-accent-400 to-fitness-accent-500" : "from-fitness-orange-400 to-fitness-orange-500",
      bgColor: isSnack ? "bg-fitness-accent-50" : "bg-fitness-orange-50",
      textColor: isSnack ? "text-fitness-accent-700" : "text-fitness-orange-700",
      borderColor: isSnack ? "border-fitness-accent-200" : "border-fitness-orange-200"
    },
    {
      label: "Protein",
      value: meal.protein,
      unit: "g",
      icon: Beef,
      color: isSnack ? "from-fitness-primary-400 to-fitness-primary-500" : "from-fitness-primary-400 to-fitness-primary-500",
      bgColor: isSnack ? "bg-fitness-primary-50" : "bg-fitness-primary-50",
      textColor: isSnack ? "text-fitness-primary-700" : "text-fitness-primary-700",
      borderColor: isSnack ? "border-fitness-primary-200" : "border-fitness-primary-200"
    },
    {
      label: "Carbs",
      value: meal.carbs,
      unit: "g",
      icon: Wheat,
      color: isSnack ? "from-green-400 to-green-500" : "from-green-400 to-green-500",
      bgColor: isSnack ? "bg-green-50" : "bg-green-50",
      textColor: isSnack ? "text-green-700" : "text-green-700",
      borderColor: isSnack ? "border-green-200" : "border-green-200"
    },
    {
      label: "Fat",
      value: meal.fat,
      unit: "g",
      icon: Droplets,
      color: isSnack ? "from-yellow-400 to-yellow-500" : "from-purple-400 to-purple-500",
      bgColor: isSnack ? "bg-yellow-50" : "bg-purple-50",
      textColor: isSnack ? "text-yellow-700" : "text-purple-700",
      borderColor: isSnack ? "border-yellow-200" : "border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nutritionItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card key={item.label} className={`${item.bgColor} ${item.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <CardContent className="p-4 text-center space-y-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto shadow-md`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}{item.unit}
              </div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">
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

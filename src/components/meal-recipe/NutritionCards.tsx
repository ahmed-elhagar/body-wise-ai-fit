
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import type { Meal } from "@/types/meal";

interface NutritionCardsProps {
  meal: Meal;
}

const NutritionCards = ({ meal }: NutritionCardsProps) => {
  const isSnack = meal.name.includes('🍎') || meal.meal_type === 'snack';
  
  const nutritionItems = [
    {
      label: "Calories",
      value: meal.calories,
      unit: "",
      icon: Flame,
      color: isSnack ? "from-emerald-400 to-green-500" : "from-orange-400 to-red-500",
      bgColor: isSnack ? "bg-emerald-50" : "bg-orange-50",
      textColor: isSnack ? "text-emerald-700" : "text-orange-700",
      borderColor: isSnack ? "border-emerald-200" : "border-orange-200"
    },
    {
      label: "Protein",
      value: meal.protein,
      unit: "g",
      icon: Beef,
      color: isSnack ? "from-teal-400 to-cyan-500" : "from-blue-400 to-indigo-500",
      bgColor: isSnack ? "bg-teal-50" : "bg-blue-50",
      textColor: isSnack ? "text-teal-700" : "text-blue-700",
      borderColor: isSnack ? "border-teal-200" : "border-blue-200"
    },
    {
      label: "Carbs",
      value: meal.carbs,
      unit: "g",
      icon: Wheat,
      color: isSnack ? "from-lime-400 to-green-500" : "from-green-400 to-emerald-500",
      bgColor: isSnack ? "bg-lime-50" : "bg-green-50",
      textColor: isSnack ? "text-lime-700" : "text-green-700",
      borderColor: isSnack ? "border-lime-200" : "border-green-200"
    },
    {
      label: "Fat",
      value: meal.fat,
      unit: "g",
      icon: Droplets,
      color: isSnack ? "from-yellow-400 to-amber-500" : "from-purple-400 to-pink-500",
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

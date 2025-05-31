
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
      color: isSnack ? "from-green-400 to-emerald-400" : "from-purple-400 to-pink-400",
      bgColor: isSnack ? "bg-green-500/10" : "bg-purple-500/10",
      textColor: isSnack ? "text-green-300" : "text-purple-300",
      borderColor: isSnack ? "border-green-500/20" : "border-purple-500/20"
    },
    {
      label: "Protein",
      value: meal.protein,
      unit: "g",
      icon: Beef,
      color: isSnack ? "from-emerald-400 to-teal-400" : "from-blue-400 to-indigo-400",
      bgColor: isSnack ? "bg-emerald-500/10" : "bg-blue-500/10",
      textColor: isSnack ? "text-emerald-300" : "text-blue-300",
      borderColor: isSnack ? "border-emerald-500/20" : "border-blue-500/20"
    },
    {
      label: "Carbs",
      value: meal.carbs,
      unit: "g",
      icon: Wheat,
      color: isSnack ? "from-teal-400 to-cyan-400" : "from-green-400 to-emerald-400",
      bgColor: isSnack ? "bg-teal-500/10" : "bg-green-500/10",
      textColor: isSnack ? "text-teal-300" : "text-green-300",
      borderColor: isSnack ? "border-teal-500/20" : "border-green-500/20"
    },
    {
      label: "Fat",
      value: meal.fat,
      unit: "g",
      icon: Droplets,
      color: isSnack ? "from-amber-400 to-orange-400" : "from-yellow-400 to-amber-400",
      bgColor: isSnack ? "bg-amber-500/10" : "bg-yellow-500/10",
      textColor: isSnack ? "text-amber-300" : "text-yellow-300",
      borderColor: isSnack ? "border-amber-500/20" : "border-yellow-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nutritionItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card key={item.label} className={`${item.bgColor} ${item.borderColor} border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <CardContent className="p-4 text-center space-y-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto shadow-md`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}{item.unit}
              </div>
              <div className="text-sm text-gray-300 font-medium uppercase tracking-wide">
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

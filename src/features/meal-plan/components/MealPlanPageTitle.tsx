
import { UtensilsCrossed } from "lucide-react";

const MealPlanPageTitle = () => {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-fitness-primary-800">
          Smart Meal Plan
        </h1>
      </div>
      <p className="text-lg text-fitness-primary-600">
        Smart nutrition planning for your healthy lifestyle
      </p>
    </div>
  );
};

export default MealPlanPageTitle;

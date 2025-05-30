
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedMealPlanPage from "@/components/meal-plan/EnhancedMealPlanPage";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <EnhancedMealPlanPage />
    </ProtectedRoute>
  );
};

export default MealPlan;

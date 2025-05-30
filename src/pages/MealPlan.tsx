
import ProtectedRoute from "@/components/ProtectedRoute";
import MealPlanPage from "@/components/meal-plan/MealPlanPage";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <MealPlanPage />
    </ProtectedRoute>
  );
};

export default MealPlan;


import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import MealPlanPageRefactored from "@/components/meal-plan/MealPlanPageRefactored";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <MealPlanPageRefactored />
      </Layout>
    </ProtectedRoute>
  );
};

export default MealPlan;

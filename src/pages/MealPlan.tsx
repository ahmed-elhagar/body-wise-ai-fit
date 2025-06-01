
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import MealPlanPage from "@/components/meal-plan/MealPlanPage";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <MealPlanPage />
      </Layout>
    </ProtectedRoute>
  );
};

export default MealPlan;

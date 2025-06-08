
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { MealPlanContainer } from "@/features/meal-plan";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <MealPlanContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default MealPlan;

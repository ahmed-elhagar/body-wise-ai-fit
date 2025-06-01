
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import MealPlanContainer from "./MealPlanContainer";

const MealPlanPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <MealPlanContainer />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default MealPlanPage;

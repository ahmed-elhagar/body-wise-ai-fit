
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import MealPlanPage from "@/components/meal-plan/MealPlanPage";

const MealPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ensure proper route handling for meal plan navigation
    console.log('🗺️ MealPlan route loaded:', location.pathname);
  }, [location.pathname]);

  return (
    <ProtectedRoute>
      <Layout>
        <MealPlanPage />
      </Layout>
    </ProtectedRoute>
  );
};

export default MealPlan;

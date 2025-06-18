
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Utensils } from "lucide-react";
import { FoodTrackerPage } from "@/features/food-tracker";

const FoodTracker = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20">
          <div className="container mx-auto px-4 py-6">
            <PageHeader
              title="Food Tracker"
              description="Track your daily nutrition and monitor your food intake"
              icon={<Utensils className="h-7 w-7 text-green-600" />}
            />
            
            <div className="mt-6">
              <FoodTrackerPage />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default FoodTracker;

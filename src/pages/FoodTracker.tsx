
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Utensils } from "lucide-react";
import { TodayTab } from "@/features/food-tracker";
import { useState } from "react";

const FoodTracker = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddFood = () => {
    console.log('Add food clicked');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <PageHeader
            title="Food Tracker"
            description="Track your daily nutrition and food intake"
            icon={<Utensils className="h-6 w-6 text-green-600" />}
          />
          
          <div className="px-6 pb-8">
            <TodayTab 
              key={refreshKey}
              onAddFood={handleAddFood}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default FoodTracker;

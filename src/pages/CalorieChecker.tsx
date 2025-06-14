
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { FoodPhotoAnalysisCard } from "@/components/food-photo-analysis/FoodPhotoAnalysisCard";
import { Calculator } from "lucide-react";

const CalorieChecker = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <PageHeader
            title="Calorie Checker"
            description="Analyze food photos and track your daily caloric intake"
            icon={<Calculator className="h-7 w-7 text-blue-600" />}
          />
          
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="grid gap-8">
              <FoodPhotoAnalysisCard />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CalorieChecker;

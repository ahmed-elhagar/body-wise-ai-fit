
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const ProgressAnalytics = () => {
  const { t } = useI18n();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Progress Analytics</h1>
                <p className="text-gray-600 mt-2">Track your fitness journey with detailed analytics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Weekly Progress</h3>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Improvement</h3>
                    <p className="text-2xl font-bold text-gray-900">+12%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Goals Met</h3>
                    <p className="text-2xl font-bold text-gray-900">7/10</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Streak</h3>
                    <p className="text-2xl font-bold text-gray-900">14 days</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Weight chart will be displayed here</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Exercise Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Exercise performance chart will be displayed here</p>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nutrition Analytics</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Nutrition analytics will be displayed here</p>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProgressAnalytics;


import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Search } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const CalorieChecker = () => {
  const { t } = useI18n();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Calorie Checker</h1>
              <p className="text-gray-600 mt-2">Analyze your food photos to track calories and nutrition</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
                <p className="text-gray-600 mb-4">Capture your meal with your camera</p>
                <Button className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
                <p className="text-gray-600 mb-4">Upload an existing photo from your device</p>
                <Button className="w-full" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Search Food</h3>
                <p className="text-gray-600 mb-4">Manually search for food items</p>
                <Button className="w-full" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search Foods
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium">Grilled Chicken Salad</p>
                      <p className="text-sm text-gray-600">320 calories • 2 hours ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium">Oatmeal with Berries</p>
                      <p className="text-sm text-gray-600">280 calories • 5 hours ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CalorieChecker;

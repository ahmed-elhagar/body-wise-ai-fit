
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MealPlan = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Meal Plan</h1>
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Your AI-generated meal plans will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MealPlan;

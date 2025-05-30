
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Calendar, Activity } from "lucide-react";
import WeightStatsCards from "@/components/weight/WeightStatsCards";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import { useWeightTracking } from "@/hooks/useWeightTracking";

const Progress = () => {
  const { weightEntries, isLoading } = useWeightTracking();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                Progress Tracking
              </h1>
              <p className="text-gray-600 mt-1">
                Track your fitness journey and achievements
              </p>
            </div>
          </div>

          <Tabs defaultValue="weight" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-96">
              <TabsTrigger value="weight" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Weight</span>
              </TabsTrigger>
              <TabsTrigger value="body" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Body</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="fitness" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Fitness</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="space-y-6">
              {/* Weight Stats Cards */}
              <WeightStatsCards weightEntries={weightEntries} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weight Progress Chart */}
                <div className="lg:col-span-2">
                  <WeightProgressChart weightEntries={weightEntries} />
                </div>

                {/* Weight Entry Form */}
                <div className="lg:col-span-1">
                  <WeightEntryForm />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="body" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Body Composition Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Body Composition Tracking</h3>
                    <p className="text-gray-500 mb-4">
                      Upload InBody scan results to track muscle mass, body fat percentage, and more.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Regular body composition analysis provides more accurate progress tracking than weight alone.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Nutrition Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nutrition Tracking</h3>
                    <p className="text-gray-500 mb-4">
                      Monitor your daily calorie intake, macronutrient balance, and meal plan adherence.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-700">2,150</div>
                        <div className="text-sm text-green-600">Avg Daily Calories</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-700">85%</div>
                        <div className="text-sm text-blue-600">Meal Plan Adherence</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-700">120g</div>
                        <div className="text-sm text-purple-600">Avg Daily Protein</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fitness" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Fitness Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Workout Progress</h3>
                    <p className="text-gray-500 mb-4">
                      Track your exercise performance, strength gains, and workout consistency.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-700">24</div>
                        <div className="text-sm text-orange-600">Workouts This Month</div>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-700">1,250</div>
                        <div className="text-sm text-red-600">Calories Burned</div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-indigo-700">92%</div>
                        <div className="text-sm text-indigo-600">Program Completion</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Progress;


import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Activity, Scale } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WeightStatsCards from "@/components/weight/WeightStatsCards";
import WeightProgressChart from "@/components/weight/WeightProgressChart";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import ProgressBadges from "@/components/goals/ProgressBadges";
import GoalHistoryTimeline from "@/components/goals/GoalHistoryTimeline";
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useGoals } from "@/hooks/useGoals";
import { useProfile } from "@/hooks/useProfile";

const Progress = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { weightEntries, isLoading: weightLoading } = useWeightTracking();
  const { getMacroGoals } = useGoals();
  const { profile } = useProfile();

  const activeTab = tab || 'overview';

  useEffect(() => {
    if (!tab) {
      navigate('/progress/overview', { replace: true });
    }
  }, [tab, navigate]);

  const macroGoals = getMacroGoals();
  const latestWeight = weightEntries[0];

  // Calculate BMI
  const bmi = latestWeight && profile?.height 
    ? latestWeight.weight / Math.pow(profile.height / 100, 2)
    : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-700' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-700' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Obese', color: 'bg-red-100 text-red-700' };
  };

  const MacroRing = ({ goal, color }: { goal: any, color: string }) => {
    const progress = goal ? Math.min((goal.current_value / goal.target_value) * 100, 100) : 0;
    const isGoldRing = progress >= 90; // Turn gold when target met
    
    return (
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={isGoldRing ? "#fbbf24" : color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={176}
            strokeDashoffset={176 - (progress / 100) * 176}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {progress.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  if (weightLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
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
                  Monitor your fitness journey and achievements
                </p>
              </div>
              <ProgressBadges />
            </div>

            <Tabs value={activeTab} onValueChange={(value) => navigate(`/progress/${value}`)}>
              <TabsList className="grid w-full grid-cols-3 lg:w-96">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="weight" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  <span className="hidden sm:inline">Weight</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* BMI Card */}
                  {bmi && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          BMI Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800 mb-2">
                            {bmi.toFixed(1)}
                          </div>
                          <Badge className={getBMICategory(bmi).color}>
                            {getBMICategory(bmi).label}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-2">
                            Current BMI calculation
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Macro Goals Ring */}
                  {macroGoals.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          Daily Macros
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {macroGoals.map(goal => (
                            <div key={goal.id} className="text-center">
                              <MacroRing 
                                goal={goal} 
                                color={
                                  goal.goal_type === 'calories' ? '#f59e0b' :
                                  goal.goal_type === 'protein' ? '#ef4444' :
                                  goal.goal_type === 'carbs' ? '#3b82f6' : '#10b981'
                                } 
                              />
                              <p className="text-xs font-medium mt-1 capitalize">
                                {goal.goal_type}
                              </p>
                            </div>
                          ))}
                        </div>
                        {macroGoals.every(g => (g.current_value / g.target_value) >= 0.9) && (
                          <Badge className="w-full mt-4 bg-yellow-100 text-yellow-800 border-yellow-300 justify-center">
                            🏆 All Targets Met!
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Weekly Progress */}
                  {weightEntries.length > 1 && (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          Weekly Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800 mb-2">
                            {(() => {
                              const current = weightEntries[0]?.weight || 0;
                              const weekAgo = weightEntries.find(entry => {
                                const entryDate = new Date(entry.recorded_at);
                                const weekAgoDate = new Date();
                                weekAgoDate.setDate(weekAgoDate.getDate() - 7);
                                return entryDate <= weekAgoDate;
                              })?.weight || current;
                              const change = current - weekAgo;
                              return `${change > 0 ? '+' : ''}${change.toFixed(1)} kg`;
                            })()}
                          </div>
                          <p className="text-sm text-gray-600">
                            Last 7 days
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Quick Stats */}
                {weightEntries.length > 0 && <WeightStatsCards weightEntries={weightEntries} />}
              </TabsContent>

              <TabsContent value="weight" className="space-y-6">
                <WeightStatsCards weightEntries={weightEntries} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <WeightProgressChart weightEntries={weightEntries} />
                  </div>
                  <div className="lg:col-span-1">
                    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <h3 className="text-lg font-semibold mb-4">Add Weight Entry</h3>
                      <WeightEntryForm />
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <GoalHistoryTimeline />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Progress;

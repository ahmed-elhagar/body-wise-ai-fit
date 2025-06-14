
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Scale, 
  Calendar,
  Award,
  ChevronRight,
  BarChart3,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { ProgressOverview } from "./ProgressOverview";
import { WeightProgressSection } from "./WeightProgressSection";
import { FitnessProgressSection } from "./FitnessProgressSection";
import { NutritionProgressSection } from "./NutritionProgressSection";
import { GoalsProgressSection } from "./GoalsProgressSection";
import { AchievementsSection } from "./AchievementsSection";

const ProgressDashboard = () => {
  const navigate = useNavigate();
  const { tFrom, isRTL } = useI18n();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 shadow-xl rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
            
            <div className="relative p-6 md:p-8">
              <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        Progress Dashboard
                      </h1>
                      <p className="text-white/80 text-lg">
                        Track your fitness journey and achievements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Real-time Analytics
                    </div>
                    <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Achievement Tracking
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/goals')}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 px-6 py-3 rounded-xl"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Manage Goals
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/achievements')}
                    className="bg-white text-purple-600 hover:bg-white/90 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Achievements
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview Cards */}
          <ProgressOverview />

          {/* Detailed Progress Tabs */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Activity className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-bold text-gray-800">Detailed Analytics</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="fitness" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-gray-200 rounded-none h-14">
                  <TabsTrigger 
                    value="fitness" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg mx-2 transition-all duration-300"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Fitness
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weight" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg mx-2 transition-all duration-300"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Weight
                  </TabsTrigger>
                  <TabsTrigger 
                    value="nutrition" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg mx-2 transition-all duration-300"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Nutrition
                  </TabsTrigger>
                  <TabsTrigger 
                    value="goals" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg mx-2 transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Goals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg mx-2 transition-all duration-300"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="fitness" className="mt-0">
                    <FitnessProgressSection />
                  </TabsContent>

                  <TabsContent value="weight" className="mt-0">
                    <WeightProgressSection />
                  </TabsContent>

                  <TabsContent value="nutrition" className="mt-0">
                    <NutritionProgressSection />
                  </TabsContent>

                  <TabsContent value="goals" className="mt-0">
                    <GoalsProgressSection />
                  </TabsContent>

                  <TabsContent value="achievements" className="mt-0">
                    <AchievementsSection />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;

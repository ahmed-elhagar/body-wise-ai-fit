
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Scale, 
  Award,
  BarChart3,
  Zap
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { ProgressOverview } from "./ProgressOverview";
import { WeightProgressSection } from "./WeightProgressSection";
import { FitnessProgressSection } from "./FitnessProgressSection";
import { NutritionProgressSection } from "./NutritionProgressSection";
import { GoalsProgressSection } from "./GoalsProgressSection";
import { AchievementsSection } from "./AchievementsSection";

const ProgressDashboard = () => {
  const { isRTL } = useI18n();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
            
            <CardContent className="relative p-8 md:p-12">
              <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className={`flex items-center gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Progress Dashboard
                      </h1>
                      <p className="text-white/90 text-xl">
                        Track your fitness journey and celebrate achievements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 text-white border-white/30 px-6 py-3 rounded-xl backdrop-blur-sm border flex items-center gap-3 hover:bg-white/25 transition-all duration-200">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium">Real-time Analytics</span>
                    </div>
                    <div className="bg-white/20 text-white border-white/30 px-6 py-3 rounded-xl backdrop-blur-sm border flex items-center gap-3 hover:bg-white/25 transition-all duration-200">
                      <Award className="w-5 h-5" />
                      <span className="font-medium">Achievement Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview Cards */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Overview</h2>
            <ProgressOverview />
          </div>

          {/* Detailed Progress Tabs */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
              <h2 className={`flex items-center gap-3 text-2xl font-bold text-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Activity className="w-7 h-7 text-indigo-600" />
                <span>Detailed Analytics</span>
              </h2>
              <p className="text-gray-600 mt-2">Dive deep into your progress across all areas</p>
            </div>
            
            <div className="p-0">
              <Tabs defaultValue="fitness" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-gray-200 rounded-none h-16 p-2">
                  <TabsTrigger 
                    value="fitness" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl mx-1 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <Activity className="w-4 h-4" />
                    <span className="hidden sm:inline">Fitness</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weight" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl mx-1 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <Scale className="w-4 h-4" />
                    <span className="hidden sm:inline">Weight</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="nutrition" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl mx-1 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Nutrition</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="goals" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl mx-1 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Goals</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl mx-1 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">Awards</span>
                  </TabsTrigger>
                </TabsList>

                <div className="p-8">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;

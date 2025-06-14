
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { BarChart3, TrendingUp, Activity, Target, Calendar, Users, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Analytics = () => {
  const { t } = useLanguage();
  
  const statsCards = [
    {
      title: "Workouts Completed",
      value: "24",
      change: "+12%",
      changeType: "positive",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Weekly Streak",
      value: "3 weeks",
      change: "+1 week",
      changeType: "positive", 
      icon: Calendar,
      color: "green"
    },
    {
      title: "Average Session",
      value: "42 min",
      change: "-3 min",
      changeType: "neutral",
      icon: Target,
      color: "purple"
    },
    {
      title: "Goals Achieved",
      value: "8/10",
      change: "80%",
      changeType: "positive",
      icon: Award,
      color: "orange"
    }
  ];

  const analyticsFeatures = [
    {
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed progress charts and metrics",
      icon: TrendingUp,
      color: "blue",
      status: "Available"
    },
    {
      title: "Performance Insights",
      description: "Get AI-powered insights about your workout performance and areas for improvement",
      icon: Zap,
      color: "purple",
      status: "Coming Soon"
    },
    {
      title: "Nutrition Analytics",
      description: "Analyze your eating patterns and nutritional intake with detailed breakdowns",
      icon: BarChart3,
      color: "green",
      status: "Coming Soon"
    },
    {
      title: "Social Comparison",
      description: "Compare your progress with other users in your fitness level category",
      icon: Users,
      color: "orange",
      status: "Coming Soon"
    }
  ];
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your progress and get insights into your fitness journey</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs font-medium ${
                              stat.changeType === 'positive' ? 'text-green-600' : 
                              stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {stat.change}
                            </span>
                            <span className="text-xs text-gray-500">vs last month</span>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          stat.color === 'green' ? 'bg-green-100 text-green-600' :
                          stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Analytics Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            feature.color === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' :
                            feature.color === 'green' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                            feature.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                            'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                          } transition-colors`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {feature.title}
                          </CardTitle>
                        </div>
                        <Badge variant={feature.status === 'Available' ? 'default' : 'secondary'} className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                      {feature.status === 'Available' && (
                        <Button size="sm" className="mt-4" variant="outline">
                          View Details
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Coming Soon Banner */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  We're working on powerful analytics features including detailed progress tracking, 
                  performance insights, nutrition analysis, and social comparisons. Stay tuned for updates!
                </p>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Analytics;

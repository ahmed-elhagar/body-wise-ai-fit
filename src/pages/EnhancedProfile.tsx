
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Heart, Target, Settings, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import HealthAssessmentForm from "@/components/profile/enhanced/HealthAssessmentForm";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";

const EnhancedProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    body_shape: '',
    fitness_goal: '',
    activity_level: '',
    health_conditions: [],
    allergies: [],
    preferred_foods: [],
    dietary_restrictions: [],
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleStepClick = (step: string) => {
    switch (step) {
      case 'basic_info':
        setActiveTab('basic');
        break;
      case 'health_assessment':
        setActiveTab('health');
        break;
      case 'goals_setup':
        setActiveTab('goals');
        break;
      case 'preferences':
        setActiveTab('settings');
        break;
      case 'profile_review':
        setActiveTab('overview');
        break;
      default:
        setActiveTab('overview');
    }
  };

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            {/* Left Sidebar - Profile Completion */}
            <div className="hidden lg:block w-80 border-r border-gray-200 bg-white/60 backdrop-blur-sm">
              <div className="p-6">
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    className="mb-4 p-0 h-auto text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">Enhanced Profile</h1>
                    <p className="text-sm text-gray-600">Complete your profile for personalized recommendations</p>
                  </div>
                </div>
                <ProfileCompletionCard onStepClick={handleStepClick} />
              </div>
            </div>

            <SidebarInset className="flex-1">
              <div className="w-full max-w-4xl mx-auto px-4 py-6">
                {/* Mobile Header */}
                <div className="lg:hidden mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    className="mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Enhanced Profile</h1>
                    <p className="text-gray-600">Complete your profile for personalized recommendations</p>
                  </div>
                  
                  {/* Mobile Profile Completion Card */}
                  <div className="mb-6">
                    <ProfileCompletionCard onStepClick={handleStepClick} />
                  </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Profile Setup</h1>
                  <p className="text-gray-600">Complete each section to get the most out of your fitness journey</p>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="overview" className="flex items-center text-xs lg:text-sm">
                      <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="basic" className="flex items-center text-xs lg:text-sm">
                      <User className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="health" className="flex items-center text-xs lg:text-sm">
                      <Heart className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Health</span>
                    </TabsTrigger>
                    <TabsTrigger value="goals" className="flex items-center text-xs lg:text-sm">
                      <Target className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Goals</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center text-xs lg:text-sm">
                      <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Overview</h2>
                      <p className="text-gray-600 mb-4">
                        Your comprehensive health and fitness profile overview will appear here.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">Health Score</h3>
                          <p className="text-2xl font-bold text-blue-600">85/100</p>
                          <p className="text-sm text-blue-600">Good overall health</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-green-800 mb-2">Fitness Readiness</h3>
                          <p className="text-2xl font-bold text-green-600">78/100</p>
                          <p className="text-sm text-green-600">Ready for moderate exercise</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="basic" className="mt-6">
                    <BasicInfoCard formData={formData} updateFormData={updateFormData} />
                  </TabsContent>

                  <TabsContent value="health" className="mt-6">
                    <HealthAssessmentForm />
                  </TabsContent>

                  <TabsContent value="goals" className="mt-6">
                    <HealthGoalsCard 
                      formData={formData} 
                      updateFormData={updateFormData}
                      handleArrayInput={handleArrayInput}
                    />
                  </TabsContent>

                  <TabsContent value="settings" className="mt-6">
                    <Card className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences & Settings</h2>
                      <p className="text-gray-600">
                        Configure your app preferences, notification settings, and privacy options.
                      </p>
                      {/* Preferences form will be implemented next */}
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedProfile;

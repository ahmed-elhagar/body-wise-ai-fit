
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Heart, Target, Settings, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Enhanced Profile</h1>
              <p className="text-gray-600">Complete your profile for personalized recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Completion */}
            <div className="lg:col-span-1">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="basic" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Basic
                  </TabsTrigger>
                  <TabsTrigger value="health" className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Health
                  </TabsTrigger>
                  <TabsTrigger value="goals" className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Goals
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedProfile;

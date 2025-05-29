
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Heart, Target, Settings, BarChart3, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import HealthAssessmentForm from "@/components/profile/enhanced/HealthAssessmentForm";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import { toast } from "sonner";

const EnhancedProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
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

  // Sync formData with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        nationality: profile.nationality || '',
        body_shape: profile.body_shape || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        health_conditions: profile.health_conditions || [],
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      });
    }
  }, [profile]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = async () => {
    try {
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      };
      
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
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

  const calculateHealthScore = () => {
    if (!profile || !assessment) return 0;
    
    let score = 0;
    
    // Basic info completeness (30 points)
    if (profile.first_name && profile.last_name) score += 5;
    if (profile.age) score += 5;
    if (profile.gender) score += 5;
    if (profile.height && profile.weight) score += 10;
    if (profile.fitness_goal) score += 5;
    
    // Health assessment completeness (40 points)
    if (assessment.stress_level) score += 10;
    if (assessment.sleep_quality) score += 10;
    if (assessment.energy_level) score += 10;
    if (assessment.exercise_history) score += 10;
    
    // Lifestyle factors (30 points)
    if (profile.activity_level) score += 10;
    if (assessment.nutrition_knowledge) score += 10;
    if (assessment.time_availability) score += 10;
    
    return Math.min(score, 100);
  };

  const calculateFitnessReadiness = () => {
    if (!profile || !assessment) return 0;
    
    let readiness = 85; // Base readiness
    
    // Reduce based on health conditions
    if (profile.health_conditions && profile.health_conditions.length > 0) {
      readiness -= profile.health_conditions.length * 5;
    }
    
    // Adjust based on activity level
    if (profile.activity_level === 'sedentary') readiness -= 10;
    if (profile.activity_level === 'very_active') readiness += 5;
    
    // Adjust based on stress and sleep
    if (assessment.stress_level && assessment.stress_level > 7) readiness -= 10;
    if (assessment.sleep_quality && assessment.sleep_quality < 6) readiness -= 10;
    
    return Math.max(Math.min(readiness, 100), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading enhanced profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 bg-white/60 backdrop-blur-sm border-b border-gray-200">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-800">Enhanced Profile</h1>
              <p className="text-sm text-gray-600">Complete your profile for personalized recommendations</p>
            </div>
            
            {/* Mobile Profile Completion Card */}
            <ProfileCompletionCard onStepClick={handleStepClick} />
          </div>

          {/* Desktop Left Sidebar - Profile Completion */}
          <div className="hidden lg:block w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200">
            <div className="p-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="mb-4 p-0 h-auto text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Enhanced Profile</h1>
                <p className="text-sm text-gray-600">Complete your profile for personalized recommendations</p>
              </div>
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="w-full max-w-4xl mx-auto px-4 py-6">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Profile Setup</h1>
                <p className="text-gray-600">Complete each section to get the most out of your fitness journey</p>
              </div>

              {/* Main Content Tabs */}
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
                    <p className="text-gray-600 mb-6">
                      Your comprehensive health and fitness profile overview with AI-powered insights.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Health Score</h3>
                        <p className="text-2xl font-bold text-blue-600">{calculateHealthScore()}/100</p>
                        <p className="text-sm text-blue-600">
                          {calculateHealthScore() >= 80 ? 'Excellent health profile' : 
                           calculateHealthScore() >= 60 ? 'Good health profile' : 
                           'Complete more sections to improve'}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Fitness Readiness</h3>
                        <p className="text-2xl font-bold text-green-600">{calculateFitnessReadiness()}/100</p>
                        <p className="text-sm text-green-600">
                          {calculateFitnessReadiness() >= 80 ? 'Ready for intense exercise' : 
                           calculateFitnessReadiness() >= 60 ? 'Ready for moderate exercise' : 
                           'Start with light activities'}
                        </p>
                      </div>
                    </div>
                    
                    {/* AI Integration Data Summary */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">AI Integration Status</h3>
                      <p className="text-sm text-purple-600 mb-2">
                        Your profile data is being used to personalize AI recommendations for:
                      </p>
                      <ul className="text-sm text-purple-600 list-disc list-inside space-y-1">
                        <li>Meal plans based on your preferences and restrictions</li>
                        <li>Exercise programs tailored to your fitness level</li>
                        <li>Health insights considering your conditions and goals</li>
                        <li>Progress tracking aligned with your objectives</li>
                      </ul>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="basic" className="mt-6">
                  <BasicInfoCard formData={formData} updateFormData={updateFormData} />
                  <div className="mt-6 flex gap-3 justify-end">
                    <Button 
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-fitness-gradient"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
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
                  <div className="mt-6 flex gap-3 justify-end">
                    <Button 
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-fitness-gradient"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences & Settings</h2>
                    <p className="text-gray-600">
                      Configure your app preferences, notification settings, and privacy options.
                    </p>
                    {/* Preferences form will be implemented later */}
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

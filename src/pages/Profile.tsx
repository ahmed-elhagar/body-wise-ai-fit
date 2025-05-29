
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Settings, Eye, Shield, LogOut, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import EnhancedBasicInfoForm from "@/components/profile/enhanced/EnhancedBasicInfoForm";
import EnhancedGoalsForm from "@/components/profile/enhanced/EnhancedGoalsForm";
import HealthAssessmentForm from "@/components/profile/enhanced/HealthAssessmentForm";
import CompactSettingsForm from "@/components/profile/enhanced/CompactSettingsForm";
import EnhancedProfileOverview from "@/components/profile/enhanced/EnhancedProfileOverview";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { profile, isLoading, error } = useProfile();
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
    progress,
    assessment,
  } = useEnhancedProfile();

  // Track unsaved changes
  useEffect(() => {
    if (profile) {
      const hasChanges = 
        formData.first_name !== (profile.first_name || '') ||
        formData.last_name !== (profile.last_name || '') ||
        formData.age !== (profile.age?.toString() || '') ||
        formData.gender !== (profile.gender || '') ||
        formData.height !== (profile.height?.toString() || '') ||
        formData.weight !== (profile.weight?.toString() || '') ||
        formData.nationality !== (profile.nationality || '') ||
        formData.body_shape !== (profile.body_shape || '') ||
        formData.fitness_goal !== (profile.fitness_goal || '') ||
        formData.activity_level !== (profile.activity_level || '');
      
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, profile]);

  const handleStepClick = (step: string) => {
    if (hasUnsavedChanges) {
      toast.error('Please save your current changes before switching sections');
      return;
    }

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

  const handleSignOut = async () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to sign out?')) {
        return;
      }
    }
    
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      toast.error('Please save your current changes before switching tabs');
      return;
    }
    setActiveTab(newTab);
  };

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (error) {
    return (
      <ProtectedRoute requireProfile={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile data. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-4xl mx-auto p-3 lg:p-4">
            {/* Compact Header Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                  {t('profile')}
                </h1>
                {completionPercentage >= 100 && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges && (
                <Alert className="mb-3 border-yellow-200 bg-yellow-50 p-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    You have unsaved changes. Save before switching sections.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Compact User Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {formData.first_name && formData.last_name 
                          ? `${formData.first_name} ${formData.last_name}` 
                          : "Welcome"}
                      </h2>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/admin')}
                        className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 text-xs"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-red-600 hover:bg-red-50 border-red-200 text-xs"
                    >
                      <LogOut className="w-3 h-3 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                </div>
                
                {/* Compact Stats */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-gray-600 text-xs">{t('height')}</p>
                    <p className="font-semibold text-sm">{formData.height || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-gray-600 text-xs">{t('weight')}</p>
                    <p className="font-semibold text-sm">{formData.weight || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-gray-600 text-xs">{t('goal')}</p>
                    <p className="font-semibold text-xs capitalize">{formData.fitness_goal?.replace('_', ' ') || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-gray-600 text-xs">Progress</p>
                    <p className="font-semibold text-sm text-blue-600">{completionPercentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="mb-4">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            {/* Main Content with Compact Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4 h-auto p-1">
                <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-2 text-xs">
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="basic" className="flex flex-col items-center gap-1 p-2 text-xs">
                  <User className="w-4 h-4" />
                  <span>Basic</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex flex-col items-center gap-1 p-2 text-xs">
                  <Heart className="w-4 h-4" />
                  <span>Health</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex flex-col items-center gap-1 p-2 text-xs">
                  <Target className="w-4 h-4" />
                  <span>Goals</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 p-2 text-xs">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
                <TabsContent value="overview" className="p-4 m-0">
                  <EnhancedProfileOverview />
                </TabsContent>

                <TabsContent value="basic" className="p-4 m-0">
                  <EnhancedBasicInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onSave={saveBasicInfo}
                    isUpdating={isUpdating}
                    validationErrors={validationErrors}
                  />
                </TabsContent>

                <TabsContent value="health" className="p-4 m-0">
                  <HealthAssessmentForm />
                </TabsContent>

                <TabsContent value="goals" className="p-4 m-0">
                  <EnhancedGoalsForm
                    formData={formData}
                    updateFormData={updateFormData}
                    handleArrayInput={handleArrayInput}
                    onSave={saveGoalsAndActivity}
                    isUpdating={isUpdating}
                    validationErrors={validationErrors}
                  />
                </TabsContent>

                <TabsContent value="settings" className="p-4 m-0">
                  <CompactSettingsForm />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

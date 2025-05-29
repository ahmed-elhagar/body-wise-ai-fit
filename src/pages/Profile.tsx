
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
import EnhancedSettingsForm from "@/components/profile/enhanced/EnhancedSettingsForm";
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
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {t('profile')}
                </h1>
                {completionPercentage >= 100 && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <p className="text-sm lg:text-base text-gray-600">
                Manage your personal information and preferences
              </p>
              
              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    You have unsaved changes. Make sure to save before switching sections.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* User Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-200 my-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-fitness-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl lg:text-2xl">
                        {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        {formData.first_name && formData.last_name 
                          ? `${formData.first_name} ${formData.last_name}` 
                          : "Welcome"}
                      </h2>
                      <p className="text-gray-600">{user?.email}</p>
                      {formData.age && (
                        <p className="text-sm text-gray-500">{formData.age} years old • {formData.nationality}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/admin')}
                        className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {t('adminPanel')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </Button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-gray-600 text-xs">{t('height')}</p>
                    <p className="font-semibold">{formData.height || "—"} cm</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-gray-600 text-xs">{t('weight')}</p>
                    <p className="font-semibold">{formData.weight || "—"} kg</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-gray-600 text-xs">{t('goal')}</p>
                    <p className="font-semibold capitalize text-sm">{formData.fitness_goal?.replace('_', ' ') || "—"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-gray-600 text-xs">{t('completion')}</p>
                    <p className="font-semibold text-blue-600">{completionPercentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="mb-6">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            {/* Main Content with Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('overview')}</span>
                </TabsTrigger>
                <TabsTrigger value="basic" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('basic')}</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('health')}</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('goals')}</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('settings')}</span>
                </TabsTrigger>
              </TabsList>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 min-h-[600px]">
                <TabsContent value="overview" className="p-6 m-0">
                  <EnhancedProfileOverview />
                </TabsContent>

                <TabsContent value="basic" className="p-6 m-0">
                  <EnhancedBasicInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onSave={saveBasicInfo}
                    isUpdating={isUpdating}
                    validationErrors={validationErrors}
                  />
                </TabsContent>

                <TabsContent value="health" className="p-6 m-0">
                  <HealthAssessmentForm />
                </TabsContent>

                <TabsContent value="goals" className="p-6 m-0">
                  <EnhancedGoalsForm
                    formData={formData}
                    updateFormData={updateFormData}
                    handleArrayInput={handleArrayInput}
                    onSave={saveGoalsAndActivity}
                    isUpdating={isUpdating}
                    validationErrors={validationErrors}
                  />
                </TabsContent>

                <TabsContent value="settings" className="p-6 m-0">
                  <EnhancedSettingsForm />
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

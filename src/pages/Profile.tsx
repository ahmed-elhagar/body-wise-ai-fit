
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Settings, Eye, Shield, LogOut, Heart, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import EnhancedBasicInfoForm from "@/components/profile/enhanced/EnhancedBasicInfoForm";
import EnhancedGoalsForm from "@/components/profile/enhanced/EnhancedGoalsForm";
import CompactHealthAssessmentForm from "@/components/profile/enhanced/CompactHealthAssessmentForm";
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

  const getCompletionIcon = () => {
    if (completionPercentage >= 100) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (completionPercentage >= 50) return <Sparkles className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <ProtectedRoute requireProfile={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-6xl mx-auto p-3 lg:p-4">
            {/* Enhanced Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {t('profile')}
                  </h1>
                  {getCompletionIcon()}
                </div>
                
                <div className="flex gap-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 text-xs h-8"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-red-600 hover:bg-red-50 border-red-200 text-xs h-8"
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </div>
              
              {hasUnsavedChanges && (
                <Alert className="mb-3 border-amber-200 bg-amber-50 p-3">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    You have unsaved changes. Save before switching sections.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Enhanced User Info Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {formData.first_name && formData.last_name 
                          ? `${formData.first_name} ${formData.last_name}` 
                          : "Welcome to FitGenius"}
                      </h2>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">{completionPercentage}% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center">
                      <p className="text-blue-600 text-xs font-medium">Height</p>
                      <p className="font-bold text-sm text-gray-800">{formData.height ? `${formData.height}cm` : "—"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center">
                      <p className="text-green-600 text-xs font-medium">Weight</p>
                      <p className="font-bold text-sm text-gray-800">{formData.weight ? `${formData.weight}kg` : "—"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center">
                      <p className="text-purple-600 text-xs font-medium">Goal</p>
                      <p className="font-bold text-xs text-gray-800 capitalize">{formData.fitness_goal?.replace('_', ' ') || "—"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg text-center">
                      <p className="text-orange-600 text-xs font-medium">Activity</p>
                      <p className="font-bold text-xs text-gray-800 capitalize">{formData.activity_level?.replace('_', ' ') || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Completion Card */}
            <div className="mb-4">
              <ProfileCompletionCard onStepClick={handleStepClick} />
            </div>

            {/* Main Content with Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4 h-auto p-1 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-3 text-xs">
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="basic" className="flex flex-col items-center gap-1 p-3 text-xs">
                  <User className="w-4 h-4" />
                  <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex flex-col items-center gap-1 p-3 text-xs">
                  <Heart className="w-4 h-4" />
                  <span>Health</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex flex-col items-center gap-1 p-3 text-xs">
                  <Target className="w-4 h-4" />
                  <span>Goals</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 p-3 text-xs">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
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
                  <CompactHealthAssessmentForm />
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

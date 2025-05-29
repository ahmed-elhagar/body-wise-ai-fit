
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedBasicInfoForm from "@/components/profile/enhanced/EnhancedBasicInfoForm";
import EnhancedGoalsForm from "@/components/profile/enhanced/EnhancedGoalsForm";
import HealthAssessmentForm from "@/components/profile/enhanced/HealthAssessmentForm";
import EnhancedProfileOverview from "@/components/profile/enhanced/EnhancedProfileOverview";
import ProfileCompletionCard from "@/components/profile/enhanced/ProfileCompletionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Heart, Target, Settings, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { isLoading } = useProfile();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    saveHealthAssessment,
    isUpdating,
  } = useEnhancedProfile();

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EnhancedProfileOverview />;
      
      case 'basic':
        return (
          <EnhancedBasicInfoForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={saveBasicInfo}
            isUpdating={isUpdating}
          />
        );
      
      case 'health':
        return <HealthAssessmentForm />;
      
      case 'goals':
        return (
          <EnhancedGoalsForm
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            onSave={saveGoalsAndActivity}
            isUpdating={isUpdating}
          />
        );
      
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('settings')} {t('comingSoon')}</h3>
            <p className="text-gray-500">{t('configureAppPreferences')}</p>
          </div>
        );
      
      default:
        return <EnhancedProfileOverview />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Account for main navigation */}
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="mb-4 hover:text-blue-600"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('back')} {t('profile')}
              </Button>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-200 mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {t('enhancedProfile')}
                </h1>
                <p className="text-gray-600 mb-4">
                  {t('completeProfileForPersonalization')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Completion Card - Left side on desktop, top on mobile */}
              <div className="lg:col-span-1">
                <ProfileCompletionCard onStepClick={handleStepClick} />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                      />
                    </TabsContent>

                    <TabsContent value="settings" className="p-6 m-0">
                      <div className="text-center py-12">
                        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('settings')} {t('comingSoon')}</h3>
                        <p className="text-gray-500">{t('configureAppPreferences')}</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EnhancedProfile;

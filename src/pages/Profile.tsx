
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePromotionCard from "@/components/profile/ProfilePromotionCard";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Target, Settings, Eye, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { profile, isLoading } = useProfile();
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    formData,
    updateFormData,
    handleArrayInput,
    handleSave,
    isUpdating,
  } = useProfileForm();

  const handleEditProfile = () => {
    setIsEditMode(true);
    setActiveTab("profile");
  };

  const handleEditGoals = () => {
    setIsEditMode(true);
    setActiveTab("goals");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const profileCompleteness = profile?.profile_completion_score || 0;

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Account for main navigation */}
        <div className={`${isRTL ? 'mr-16 lg:mr-64' : 'ml-16 lg:ml-64'} min-h-screen`}>
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Header Section */}
            <div className="mb-6">
              <ProfileHeader isEditMode={isEditMode} />
              
              {/* User Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-200 mb-4">
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
                    <p className="font-semibold">{profileCompleteness}%</p>
                  </div>
                </div>
              </div>
              
              <ProfilePromotionCard 
                profileCompleteness={profileCompleteness} 
              />
            </div>

            {/* Main Content with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('overview')}</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('basicInfo')}</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('goals')}</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('account')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ProfileContent
                  activeTab="overview"
                  isEditMode={false}
                  formData={formData}
                  user={user}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  handleSave={handleSave}
                  setIsEditMode={setIsEditMode}
                  setActiveTab={setActiveTab}
                  handleEditProfile={handleEditProfile}
                  handleEditGoals={handleEditGoals}
                  isUpdating={isUpdating}
                />
              </TabsContent>

              <TabsContent value="profile">
                <ProfileContent
                  activeTab="profile"
                  isEditMode={isEditMode}
                  formData={formData}
                  user={user}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  handleSave={handleSave}
                  setIsEditMode={setIsEditMode}
                  setActiveTab={setActiveTab}
                  handleEditProfile={handleEditProfile}
                  handleEditGoals={handleEditGoals}
                  isUpdating={isUpdating}
                />
              </TabsContent>

              <TabsContent value="goals">
                <ProfileContent
                  activeTab="goals"
                  isEditMode={isEditMode}
                  formData={formData}
                  user={user}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  handleSave={handleSave}
                  setIsEditMode={setIsEditMode}
                  setActiveTab={setActiveTab}
                  handleEditProfile={handleEditProfile}
                  handleEditGoals={handleEditGoals}
                  isUpdating={isUpdating}
                />
              </TabsContent>

              <TabsContent value="account">
                <ProfileContent
                  activeTab="account"
                  isEditMode={isEditMode}
                  formData={formData}
                  user={user}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  handleSave={handleSave}
                  setIsEditMode={setIsEditMode}
                  setActiveTab={setActiveTab}
                  handleEditProfile={handleEditProfile}
                  handleEditGoals={handleEditGoals}
                  isUpdating={isUpdating}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

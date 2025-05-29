
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfileAppSidebar } from "@/components/profile/ProfileAppSidebar";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import AccountSettingsCard from "@/components/profile/AccountSettingsCard";
import ProfileOverviewCard from "@/components/profile/ProfileOverviewCard";
import ProfileGoalsCard from "@/components/profile/ProfileGoalsCard";
import { Sparkles, ArrowRight, Loader2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Update form data when profile loads
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
      
      updateProfile(profileData);
      setIsEditMode(false);
      setActiveTab("overview");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setActiveTab("profile");
  };

  const handleEditGoals = () => {
    setIsEditMode(true);
    setActiveTab("goals");
  };

  const profileCompleteness = profile?.profile_completion_score || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <ProfileAppSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formData={formData}
              user={user}
              isAdmin={isAdmin}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
            />
            <SidebarInset className="flex-1">
              <div className="w-full max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    {isEditMode ? 'Edit Profile' : 'Your Profile'}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600">
                    {isEditMode ? 'Update your personal information and preferences' : 'View your personal information and preferences'}
                  </p>
                </div>

                {/* Enhanced Profile Promotion Card */}
                {profileCompleteness < 100 && !isEditMode && (
                  <Card className="mb-6 p-4 lg:p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:justify-between">
                      <div className="flex items-start gap-3 lg:gap-4 flex-1">
                        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 mt-1 lg:mt-0 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-semibold mb-1">Complete Your Enhanced Profile</h3>
                          <p className="text-blue-100 text-sm lg:text-base">
                            Unlock personalized AI recommendations with our comprehensive health assessment
                          </p>
                          <p className="text-xs lg:text-sm text-blue-200 mt-1">
                            Profile completion: {profileCompleteness}%
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate('/enhanced-profile')}
                        variant="secondary"
                        className="bg-white text-blue-600 hover:bg-blue-50 w-full lg:w-auto flex-shrink-0"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Main Content */}
                <div className="space-y-6">
                  {activeTab === "overview" && !isEditMode && (
                    <>
                      <ProfileOverviewCard formData={formData} onEdit={handleEditProfile} />
                      <ProfileGoalsCard formData={formData} onEdit={handleEditGoals} />
                    </>
                  )}

                  {(activeTab === "profile" || (isEditMode && activeTab === "profile")) && (
                    <>
                      <BasicInfoCard formData={formData} updateFormData={updateFormData} />
                      {isEditMode && (
                        <div className="flex gap-3 justify-end">
                          <Button 
                            onClick={() => {
                              setIsEditMode(false);
                              setActiveTab("overview");
                            }}
                            variant="outline"
                            className="w-full lg:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="bg-fitness-gradient w-full lg:w-auto"
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
                      )}
                    </>
                  )}

                  {(activeTab === "goals" || (isEditMode && activeTab === "goals")) && (
                    <>
                      <HealthGoalsCard 
                        formData={formData} 
                        updateFormData={updateFormData}
                        handleArrayInput={handleArrayInput}
                      />
                      {isEditMode && (
                        <div className="flex gap-3 justify-end">
                          <Button 
                            onClick={() => {
                              setIsEditMode(false);
                              setActiveTab("overview");
                            }}
                            variant="outline"
                            className="w-full lg:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="bg-fitness-gradient w-full lg:w-auto"
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
                      )}
                    </>
                  )}

                  {activeTab === "account" && !isEditMode && (
                    <AccountSettingsCard user={user} />
                  )}
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

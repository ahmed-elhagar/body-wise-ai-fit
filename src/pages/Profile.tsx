import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import AccountSettingsCard from "@/components/profile/AccountSettingsCard";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile, updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    age: profile?.age?.toString() || '',
    gender: profile?.gender || '',
    height: profile?.height?.toString() || '',
    weight: profile?.weight?.toString() || '',
    nationality: profile?.nationality || '',
    body_shape: profile?.body_shape || '',
    fitness_goal: profile?.fitness_goal || '',
    activity_level: profile?.activity_level || '',
    health_conditions: profile?.health_conditions || [],
    allergies: profile?.allergies || [],
    preferred_foods: profile?.preferred_foods || [],
    dietary_restrictions: profile?.dietary_restrictions || [],
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
    };
    updateProfile(profileData);
  };

  const profileCompleteness = profile?.profile_completion_score || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          {/* Enhanced Profile Promotion Card */}
          {profileCompleteness < 100 && (
            <Card className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-8 h-8 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Complete Your Enhanced Profile</h3>
                    <p className="text-blue-100">
                      Unlock personalized AI recommendations with our comprehensive health assessment
                    </p>
                    <p className="text-sm text-blue-200 mt-1">
                      Profile completion: {profileCompleteness}%
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/enhanced-profile')}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
                user={user}
                isAdmin={isAdmin}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "profile" && (
                <>
                  <BasicInfoCard formData={formData} updateFormData={updateFormData} />
                  <HealthGoalsCard 
                    formData={formData} 
                    updateFormData={updateFormData}
                    handleArrayInput={handleArrayInput}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-fitness-gradient"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "account" && (
                <AccountSettingsCard />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

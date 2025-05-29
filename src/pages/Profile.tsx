
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import AccountSettingsCard from "@/components/profile/AccountSettingsCard";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

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
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
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
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your personal information and preferences</p>
          </div>

          {/* Enhanced Profile Promotion Card */}
          {profileCompleteness < 100 && (
            <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mt-1 sm:mt-0 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold mb-1">Complete Your Enhanced Profile</h3>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Unlock personalized AI recommendations with our comprehensive health assessment
                    </p>
                    <p className="text-xs sm:text-sm text-blue-200 mt-1">
                      Profile completion: {profileCompleteness}%
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/enhanced-profile')}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto flex-shrink-0"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* Mobile Tab Navigation */}
          <div className="block lg:hidden mb-6">
            <div className="flex bg-white rounded-lg p-1 shadow-lg">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                size="sm"
                className={`flex-1 text-xs ${activeTab === "profile" ? "bg-fitness-gradient text-white" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </Button>
              <Button
                variant={activeTab === "account" ? "default" : "ghost"}
                size="sm"
                className={`flex-1 text-xs ${activeTab === "account" ? "bg-fitness-gradient text-white" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account
              </Button>
            </div>
          </div>

          {/* Main Layout - Fixed Grid System */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Desktop Sidebar - Fixed Width */}
            <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-4">
                <ProfileSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formData={formData}
                  user={user}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            {/* Main Content Area - Flexible Width */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
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
                      className="bg-fitness-gradient w-full sm:w-auto"
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
                </>
              )}

              {activeTab === "account" && (
                <AccountSettingsCard user={user} />
              )}
            </div>
          </div>

          {/* Mobile Profile Summary */}
          <div className="block lg:hidden mt-6">
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">
                    {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {formData.first_name && formData.last_name 
                    ? `${formData.first_name} ${formData.last_name}` 
                    : "Complete your profile"}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-600">Height</p>
                    <p className="font-semibold">{formData.height || "—"} cm</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-600">Weight</p>
                    <p className="font-semibold">{formData.weight || "—"} kg</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

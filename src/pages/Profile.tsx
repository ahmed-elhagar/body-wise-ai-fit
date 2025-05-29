
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import AccountSettingsCard from "@/components/profile/AccountSettingsCard";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading, isUpdating } = useProfile();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    nationality: "",
    body_shape: "",
    health_conditions: [] as string[],
    fitness_goal: "",
    activity_level: "",
    allergies: [] as string[],
    preferred_foods: [] as string[],
    dietary_restrictions: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        nationality: profile.nationality || "",
        body_shape: profile.body_shape || "",
        health_conditions: profile.health_conditions || [],
        fitness_goal: profile.fitness_goal || "",
        activity_level: profile.activity_level || "",
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || []
      });
    }
  }, [profile]);

  const handleSave = () => {
    const profileData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender as any,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      nationality: formData.nationality,
      body_shape: formData.body_shape as any,
      health_conditions: formData.health_conditions,
      fitness_goal: formData.fitness_goal as any,
      activity_level: formData.activity_level as any,
      allergies: formData.allergies,
      preferred_foods: formData.preferred_foods,
      dietary_restrictions: formData.dietary_restrictions
    };

    updateProfile(profileData);
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateFormData(field, items);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and account settings</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <ProfileSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            user={user}
            isAdmin={isAdmin}
          />

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <>
                <BasicInfoCard 
                  formData={formData}
                  updateFormData={updateFormData}
                />
                
                <HealthGoalsCard 
                  formData={formData}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                />

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-fitness-gradient hover:opacity-90 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "account" && (
              <AccountSettingsCard user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedProfileLayout from "@/components/profile/enhanced/EnhancedProfileLayout";
import EnhancedProfileHeader from "@/components/profile/enhanced/EnhancedProfileHeader";
import EnhancedProfileTabs from "@/components/profile/enhanced/EnhancedProfileTabs";
import { toast } from "sonner";

const EnhancedProfile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
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
      <EnhancedProfileLayout onStepClick={handleStepClick}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <EnhancedProfileHeader className="hidden lg:block mb-6" />

          <EnhancedProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            handleSave={handleSave}
            isUpdating={isUpdating}
          />
        </div>
      </EnhancedProfileLayout>
    </ProtectedRoute>
  );
};

export default EnhancedProfile;

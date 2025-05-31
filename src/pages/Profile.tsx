
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { User, Sparkles } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import ProfileTabNavigation from "@/components/profile/ProfileTabNavigation";
import ProfileTabContent from "@/components/profile/ProfileTabContent";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const {
    formData,
    updateFormData,
    handleArrayInput,
    saveBasicInfo,
    saveGoalsAndActivity,
    isUpdating,
    validationErrors,
    completionPercentage,
  } = useEnhancedProfile();

  const getCompletionColor = () => {
    if (completionPercentage >= 80) return "text-green-600";
    if (completionPercentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionBadge = () => {
    if (completionPercentage >= 80) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (completionPercentage >= 50) return { label: "Good Progress", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Needs Attention", color: "bg-red-100 text-red-800" };
  };

  const badge = getCompletionBadge();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
            <div className="relative">
              <PageHeader
                title="Your Profile"
                description={`Build a complete profile to unlock personalized AI recommendations`}
                icon={<User className="h-7 w-7 text-blue-600" />}
                className="mb-0"
              >
                <div className="flex items-center gap-3">
                  <Badge className={`${badge.color} text-sm font-medium px-3 py-1`}>
                    {badge.label}
                  </Badge>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getCompletionColor()}`}>
                      {completionPercentage}%
                    </div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
              </PageHeader>

              {/* Progress Section */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl mx-6 mb-6 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Profile Completion</span>
                  </div>
                  <span className={`text-sm font-semibold ${getCompletionColor()}`}>
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-3 bg-gray-100" />
                <p className="text-sm text-gray-600 mt-2">
                  {completionPercentage < 50 
                    ? "Complete your profile to unlock AI-powered meal plans and workouts"
                    : completionPercentage < 80 
                    ? "Great progress! Add more details for better personalization"
                    : "Outstanding! Your profile is comprehensive for AI recommendations"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-8">
            <Tabs defaultValue="overview" className="w-full max-w-7xl mx-auto">
              <ProfileTabNavigation 
                activeTab="overview"
                onTabChange={() => {}}
              />

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                <ProfileTabContent
                  formData={formData}
                  updateFormData={updateFormData}
                  handleArrayInput={handleArrayInput}
                  saveBasicInfo={saveBasicInfo}
                  saveGoalsAndActivity={saveGoalsAndActivity}
                  isUpdating={isUpdating}
                  validationErrors={validationErrors}
                />
              </div>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;

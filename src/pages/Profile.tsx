
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "lucide-react";
import { useEnhancedProfile } from "@/hooks/useEnhancedProfile";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import RefactoredProfileView from "@/components/profile/RefactoredProfileView";

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
    if (completionPercentage >= 80) return { label: "Complete", color: "bg-green-100 text-green-800 border-green-200" };
    if (completionPercentage >= 50) return { label: "In Progress", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    return { label: "Incomplete", color: "bg-red-100 text-red-800 border-red-200" };
  };

  const badge = getCompletionBadge();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            <div className="relative">
              <PageHeader
                title="Profile Settings"
                description="Manage your personal information, health data, and fitness goals"
                icon={<User className="h-7 w-7 text-blue-600" />}
                className="mb-0"
              >
                <div className="flex items-center gap-4">
                  {/* Circular Progress Indicator */}
                  <div className="relative">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                          className={getCompletionColor()}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${getCompletionColor()}`}>
                          {completionPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${badge.color} border font-medium mb-1`}>
                      {badge.label}
                    </Badge>
                    <div className="text-xs text-gray-500">Profile Status</div>
                  </div>
                </div>
              </PageHeader>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-8">
            <div className="w-full max-w-7xl mx-auto">
              <RefactoredProfileView
                formData={formData}
                updateFormData={updateFormData}
                handleArrayInput={handleArrayInput}
                saveBasicInfo={saveBasicInfo}
                saveGoalsAndActivity={saveGoalsAndActivity}
                isUpdating={isUpdating}
                validationErrors={validationErrors}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;

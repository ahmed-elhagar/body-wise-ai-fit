
import { useProfile } from "@/hooks/useProfile";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile } = useProfile();
  const { isGeneratingContent, generationStatus, hasExistingContent } = useInitialAIGeneration();
  const { t, isRTL } = useLanguage();

  // Show loading screen only if AI content is being generated for first time users
  if (isGeneratingContent && hasExistingContent === false) {
    return (
      <div className={`min-h-screen bg-fitness-neutral-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navigation />
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center p-4`}>
          <div className="text-center max-w-md px-6 py-8 bg-white rounded-2xl shadow-sm border border-fitness-neutral-100">
            <div className="w-16 h-16 bg-fitness-primary rounded-xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-fitness-neutral-800 mb-3">
              {t('dashboard.generatingContent')}
            </h2>
            <p className="text-fitness-neutral-600 mb-6 text-sm leading-relaxed">
              {t('dashboard.generatingDescription')}
            </p>
            {generationStatus && (
              <div className="bg-fitness-soft-blue border border-blue-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  {generationStatus}
                </p>
              </div>
            )}
            <div className="mt-6 text-xs text-fitness-neutral-500 font-medium">
              {t('dashboard.pleaseWait')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-fitness-neutral-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} transition-all duration-300`}>
        <div className="container mx-auto px-3 py-4 max-w-7xl">
          {/* Header Section */}
          <div className="mb-4">
            <DashboardHeader />
          </div>

          {/* Stats Grid */}
          <div className="mb-4">
            <StatsGrid />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Quick Actions */}
            <div className="xl:col-span-4 order-1">
              <QuickActionsGrid />
            </div>

            {/* Activity Feed */}
            <div className="xl:col-span-8 order-2">
              <ActivityFeed />
            </div>

            {/* Progress Overview */}
            <div className="xl:col-span-12 order-3">
              <ProgressOverview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

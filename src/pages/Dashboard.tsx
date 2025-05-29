
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
      <div className={`min-h-screen bg-gradient-to-br from-fitness-soft-blue via-white to-fitness-soft-purple flex ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navigation />
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-72' : 'ml-0 md:ml-72'} flex items-center justify-center p-4`}>
          <div className="text-center max-w-md px-6 py-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            <div className="w-20 h-20 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse-glow">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-fitness-gradient bg-clip-text text-transparent mb-4">
              {t('dashboard.generatingContent')}
            </h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              {t('dashboard.generatingDescription')}
            </p>
            {generationStatus && (
              <div className="bg-fitness-soft-blue border border-blue-200 px-6 py-3 rounded-2xl">
                <p className="text-sm text-blue-700 font-medium">
                  {generationStatus}
                </p>
              </div>
            )}
            <div className="mt-8 text-xs text-gray-500 font-medium">
              {t('dashboard.pleaseWait')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-fitness-soft-blue via-white to-fitness-soft-purple flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-72' : 'ml-0 md:ml-72'} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Enhanced Header Section */}
          <div className="mb-8">
            <DashboardHeader />
          </div>

          {/* Enhanced Stats Grid */}
          <div className="mb-8">
            <StatsGrid />
          </div>

          {/* Enhanced Main Content Grid with better proportions */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Quick Actions - More prominent */}
            <div className="xl:col-span-4 order-1">
              <QuickActionsGrid />
            </div>

            {/* Activity Feed - Takes more space */}
            <div className="xl:col-span-8 order-2">
              <ActivityFeed />
            </div>

            {/* Progress Overview - Full width at bottom */}
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

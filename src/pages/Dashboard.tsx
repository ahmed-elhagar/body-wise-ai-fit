
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
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navigation />
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center p-4`}>
          <div className="text-center max-w-sm sm:max-w-md px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('dashboard.generatingContent')}</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              {t('dashboard.generatingDescription')}
            </p>
            {generationStatus && (
              <p className="text-sm text-fitness-primary font-medium bg-fitness-primary/10 px-4 py-2 rounded-full">
                {generationStatus}
              </p>
            )}
            <div className="mt-8 text-xs text-gray-500">
              {t('dashboard.pleaseWait')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
          {/* Header Section - Compact */}
          <div className="mb-6">
            <DashboardHeader />
          </div>

          {/* Stats Grid - Compact */}
          <div className="mb-6">
            <StatsGrid />
          </div>

          {/* Main Content Grid - Smart Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Column - Quick Actions (Mobile: Full width, Desktop: 5 cols) */}
            <div className="lg:col-span-5 order-1 lg:order-1">
              <QuickActionsGrid />
            </div>

            {/* Right Column - Activity Feed (Mobile: Full width, Desktop: 7 cols) */}
            <div className="lg:col-span-7 order-2 lg:order-2">
              <ActivityFeed />
            </div>

            {/* Bottom - Progress Overview (Mobile & Desktop: Full width) */}
            <div className="lg:col-span-12 order-3">
              <ProgressOverview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

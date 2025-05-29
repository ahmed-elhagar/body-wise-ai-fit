
import { useProfile } from "@/hooks/useProfile";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnhancedStatsGrid from "@/components/dashboard/EnhancedStatsGrid";
import InteractiveProgressChart from "@/components/dashboard/InteractiveProgressChart";
import EnhancedQuickActions from "@/components/dashboard/EnhancedQuickActions";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile } = useProfile();
  const { isGeneratingContent, generationStatus, hasExistingContent } = useInitialAIGeneration();
  const { t, isRTL } = useLanguage();
  const isMobile = useIsMobile();

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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation />
      <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} transition-all duration-300`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl h-full">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <DashboardHeader />
          </div>

          {/* Enhanced Stats Grid */}
          <div className="mb-4 sm:mb-6">
            <EnhancedStatsGrid />
          </div>

          {/* Main Content Layout */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'} mb-4 sm:mb-6`}>
            {/* Interactive Progress Chart - Takes 2 columns on large screens */}
            <div className={`${isMobile ? 'order-1' : 'lg:col-span-2'}`}>
              <InteractiveProgressChart />
            </div>

            {/* Enhanced Quick Actions - Takes 1 column */}
            <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'} ${isMobile ? 'h-auto' : 'h-full'}`}>
              <EnhancedQuickActions />
            </div>
          </div>

          {/* Activity Feed - Full width */}
          <div className="mb-4 sm:mb-6">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

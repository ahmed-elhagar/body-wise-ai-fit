
import { useProfile } from "@/hooks/useProfile";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import Navigation from "@/components/Navigation";
import EnhancedDashboardStats from "@/components/EnhancedDashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import LanguageToggle from "@/components/LanguageToggle";
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
        <div className={`flex-1 ${isRTL ? 'mr-0 md:mr-64' : 'ml-0 md:ml-64'} flex items-center justify-center`}>
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Generating Your Personalized Content</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Our AI is creating your customized meal plans and exercise programs based on your profile...
            </p>
            {generationStatus && (
              <p className="text-sm text-fitness-primary font-medium">
                {generationStatus}
              </p>
            )}
            <div className="mt-6 text-xs text-gray-500">
              This may take 30-60 seconds. Please don't refresh the page.
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
        {/* Language Toggle */}
        <div className={`p-4 ${isRTL ? 'text-left' : 'text-right'}`}>
          <LanguageToggle />
        </div>

        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Enhanced Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className={`inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-4 shadow-xl mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-fitness-gradient rounded-xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl">👋</span>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fitness-primary to-pink-600 bg-clip-text text-transparent">
                  {t('dashboard.welcome')}, {profile?.first_name || 'User'}!
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Track your fitness journey and achieve your goals with AI-powered insights.
                </p>
              </div>
            </div>
            {profile?.ai_generations_remaining !== undefined && (
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-fitness-primary/10 to-pink-100 rounded-full px-3 sm:px-4 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-2 h-2 bg-fitness-primary rounded-full animate-pulse"></span>
                <p className="text-xs sm:text-sm text-fitness-primary font-medium">
                  {t('dashboard.aiGenerationsRemaining')}: {profile.ai_generations_remaining}/5
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              <EnhancedDashboardStats />
              <RecentActivity />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

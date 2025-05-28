
import { useProfile } from "@/hooks/useProfile";
import { useInitialAIGeneration } from "@/hooks/useInitialAIGeneration";
import Navigation from "@/components/Navigation";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile } = useProfile();
  const { isGeneratingContent, generationStatus } = useInitialAIGeneration();

  // Show loading screen if AI content is being generated
  if (isGeneratingContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <Navigation />
        <div className="flex-1 ml-0 md:ml-64 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Personalized Content</h2>
            <p className="text-gray-600 mb-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Navigation />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {profile?.first_name || 'User'}! 👋
            </h1>
            <p className="text-gray-600">
              Track your fitness journey and achieve your goals with AI-powered insights.
            </p>
            {profile?.ai_generations_remaining !== undefined && (
              <p className="text-sm text-fitness-primary mt-2">
                AI Generations Remaining: {profile.ai_generations_remaining}/5
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DashboardStats />
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

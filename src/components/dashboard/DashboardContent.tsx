
import { useProfile } from "@/hooks/useProfile";
import { DashboardWelcomeHeader } from "./DashboardWelcomeHeader";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardStats from "../DashboardStats";
import ProfileCompletionBanner from "../profile/ProfileCompletionBanner";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import QuickActionsGrid from "./QuickActionsGrid";

const DashboardContent = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleViewMealPlan = () => navigate('/meal-plan');
  const handleViewExercise = () => navigate('/exercise');
  const handleViewWeight = () => navigate('/weight-tracking');
  const handleViewProgress = () => navigate('/progress');
  const handleViewGoals = () => navigate('/goals');
  const handleViewProfile = () => navigate('/profile');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Profile completion banner for existing users */}
        <ProfileCompletionBanner />
        
        {/* Enhanced Dashboard Header */}
        <DashboardHeader />
        
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardStats />
          </div>
          <div>
            <QuickActionsGrid />
          </div>
        </div>
        
        {/* Traditional Quick Actions for larger screens */}
        <div className="hidden md:block">
          <DashboardQuickActions 
            handleViewMealPlan={handleViewMealPlan}
            handleViewExercise={handleViewExercise}
            handleViewWeight={handleViewWeight}
            handleViewProgress={handleViewProgress}
            handleViewGoals={handleViewGoals}
            handleViewProfile={handleViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

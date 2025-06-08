
import { useProfile } from "@/hooks/useProfile";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardStats from "../DashboardStats";
import ProfileCompletionBanner from "../profile/ProfileCompletionBanner";
import { useNavigate } from "react-router-dom";

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
    <div className="space-y-6">
      {/* Profile completion banner for existing users */}
      <ProfileCompletionBanner />
      
      <DashboardWelcomeHeader 
        userName={profile?.first_name || 'User'}
        onViewMealPlan={handleViewMealPlan}
        onViewExercise={handleViewExercise}
      />
      
      <DashboardQuickActions 
        onViewMealPlan={handleViewMealPlan}
        onViewExercise={handleViewExercise}
        onViewWeight={handleViewWeight}
        onViewProgress={handleViewProgress}
        onViewGoals={handleViewGoals}
        onViewProfile={handleViewProfile}
      />
      
      <DashboardStats />
    </div>
  );
};

export default DashboardContent;

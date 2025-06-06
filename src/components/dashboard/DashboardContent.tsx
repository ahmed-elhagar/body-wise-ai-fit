
import { useProfile } from "@/hooks/useProfile";
import DashboardWelcomeHeader from "./DashboardWelcomeHeader";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardStats from "./DashboardStats";
import ProfileCompletionBanner from "../profile/ProfileCompletionBanner";

const DashboardContent = () => {
  const { profile } = useProfile();

  return (
    <div className="space-y-6">
      {/* Profile completion banner for existing users */}
      <ProfileCompletionBanner />
      
      <DashboardWelcomeHeader />
      <DashboardQuickActions />
      <DashboardStats />
    </div>
  );
};

export default DashboardContent;

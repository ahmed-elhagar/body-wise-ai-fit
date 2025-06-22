import { Dashboard as DashboardComponent } from "@/features/dashboard";
import ProtectedLayout from "@/components/ProtectedLayout";

const Dashboard = () => {
  return (
    <ProtectedLayout>
      <DashboardComponent />
    </ProtectedLayout>
  );
};

export default Dashboard;

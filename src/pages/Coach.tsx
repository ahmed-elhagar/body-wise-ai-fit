
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnhancedCoachDashboard from "@/features/coach/components/EnhancedCoachDashboard";

const Coach = () => {
  return (
    <ProtectedRoute requireRole="coach">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <EnhancedCoachDashboard />
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Coach;

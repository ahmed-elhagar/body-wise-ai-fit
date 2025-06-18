
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import TraineeCoachChat from "@/features/coach/components/TraineeCoachChat";

const Chat = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <TraineeCoachChat />
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Chat;

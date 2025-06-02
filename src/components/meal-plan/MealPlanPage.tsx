
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import MealPlanContainer from "./MealPlanContainer";

const MealPlanPage = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <MealPlanContainer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MealPlanPage;

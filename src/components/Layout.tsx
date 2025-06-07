
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DebugPanel from "@/components/DebugPanel";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const { isRTL } = useI18n();

  if (!user) {
    return (
      <div className={cn("min-h-screen w-full", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
        {children}
        {/* Show debug panel even for non-authenticated users */}
        {import.meta.env.DEV && <DebugPanel />}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen w-full", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-4 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      
      {/* Debug Panel available throughout the app */}
      {import.meta.env.DEV && <DebugPanel />}
    </div>
  );
};

export default Layout;


import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
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
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen w-full", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;

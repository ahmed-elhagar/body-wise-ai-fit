
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const { isRTL } = useI18n();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isRTL ? 'rtl' : 'ltr'}`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

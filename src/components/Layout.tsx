
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isRTL } = useI18n();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;

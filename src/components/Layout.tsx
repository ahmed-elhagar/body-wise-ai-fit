
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useI18n } from "@/hooks/useI18n";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
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

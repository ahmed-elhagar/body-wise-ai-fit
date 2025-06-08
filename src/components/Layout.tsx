
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";
import LanguageToggle from "@/components/LanguageToggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const { isRTL } = useI18n();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Language Toggle in appropriate corner */}
          <div className={`flex p-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <div className="w-48">
              <LanguageToggle />
            </div>
          </div>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

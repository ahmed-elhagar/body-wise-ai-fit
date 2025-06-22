
import { AppSidebar } from "@/shared/components/sidebar/AppSidebar";
import { useI18n } from "@/shared/hooks/useI18n";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isRTL } = useI18n();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="flex min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50">
      {/* Fixed Sidebar */}
      <div className={`fixed top-0 h-screen w-64 z-30 ${isRTL ? 'right-0' : 'left-0'}`}>
        <AppSidebar />
      </div>
      
      {/* Main Content with Proper Margin */}
      <main className={`flex-1 min-h-screen relative z-10 ${isRTL ? 'mr-64' : 'ml-64'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

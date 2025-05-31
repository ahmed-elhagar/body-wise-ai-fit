
import { ReactNode, memo } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import AppSidebar from "./AppSidebar";
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  const { isRTL, language } = useLanguage();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex w-full bg-gray-50 ${isRTL ? 'rtl' : 'ltr'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          {/* Mobile header with sidebar trigger */}
          <div className="flex h-14 items-center gap-3 border-b bg-white px-4 md:hidden">
            <SidebarTrigger className="h-8 w-8" />
            <h1 className="font-semibold text-gray-900">FitFatta</h1>
          </div>
          
          {/* Desktop header with sidebar trigger */}
          <div className="hidden md:flex h-14 items-center gap-3 border-b bg-white px-4">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          
          <main className="flex-1 overflow-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
});

Layout.displayName = 'Layout';

export default Layout;

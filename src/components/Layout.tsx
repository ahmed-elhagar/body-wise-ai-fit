
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
          <div className="flex h-14 items-center gap-2 border-b bg-white px-4 lg:hidden">
            <SidebarTrigger className="h-8 w-8" />
            <h1 className="font-semibold">Fitness Tracker</h1>
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

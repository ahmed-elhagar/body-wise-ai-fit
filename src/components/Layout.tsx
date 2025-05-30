import { ReactNode, memo } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-gray-50 ${isRTL ? 'rtl' : 'ltr'} ${language === 'ar' ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <main className="flex-1 overflow-auto p-6 w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
});

Layout.displayName = 'Layout';

export default Layout;


import { ReactNode, memo } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import AppSidebar from "./AppSidebar";
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  const { isRTL, t } = useI18n();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "sidebar-layout bg-gray-50 w-full min-h-screen",
        isRTL && 'font-arabic'
      )}>
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0" data-sidebar="inset">
          {/* Mobile header with sidebar trigger */}
          <div className={cn(
            "flex h-14 items-center gap-3 border-b bg-white px-4 md:hidden",
            isRTL && 'flex-row-reverse'
          )}>
            <SidebarTrigger className="h-8 w-8" data-sidebar="trigger" />
            <h1 className="font-semibold text-gray-900">{t('common:appName')}</h1>
          </div>
          
          {/* Desktop header with sidebar trigger */}
          <div className={cn(
            "hidden md:flex h-14 items-center gap-3 border-b bg-white px-4",
            isRTL && 'flex-row-reverse justify-end'
          )}>
            <SidebarTrigger className="h-8 w-8" data-sidebar="trigger" />
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

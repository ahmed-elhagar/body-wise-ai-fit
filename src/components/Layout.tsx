
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
        "min-h-screen flex w-full bg-gray-50",
        isRTL && 'font-arabic'
      )}>
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          {/* Mobile header with sidebar trigger */}
          <div className={cn(
            "flex h-16 items-center gap-4 border-b bg-white px-6 md:hidden shadow-sm",
            isRTL && 'flex-row-reverse'
          )}>
            <SidebarTrigger className="h-8 w-8 text-gray-600 hover:text-gray-900" />
            <h1 className="font-bold text-lg text-gray-900">{String(t('common:appName'))}</h1>
          </div>
          
          {/* Desktop header with sidebar trigger */}
          <div className={cn(
            "hidden md:flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm",
            isRTL && 'flex-row-reverse justify-end'
          )}>
            <SidebarTrigger className="h-8 w-8 text-gray-600 hover:text-gray-900" />
            <div className="flex-1" />
          </div>
          
          <main className="flex-1 overflow-auto w-full p-6">
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

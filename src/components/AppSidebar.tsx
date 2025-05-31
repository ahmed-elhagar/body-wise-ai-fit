
import { useRole } from "@/hooks/useRole";
import { useCoach } from "@/hooks/useCoach";
import { useI18n } from "@/hooks/useI18n";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarHeader as AppSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter as AppSidebarFooter } from "./sidebar/SidebarFooter";

export function AppSidebar() {
  const { isAdmin, isCoach } = useRole();
  const { trainees } = useCoach();
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <Sidebar 
      className={cn(
        "sidebar-rtl bg-white border-border transition-all duration-300",
        isRTL && "border-s border-e-0"
      )}
      collapsible="icon"
    >
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <ScrollArea className="flex-1">
          <SidebarNavigation />

          {(isAdmin || isCoach) && (
            <>
              <Separator className="my-4" />
              <SidebarMenu>
                {isCoach && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleNavigation('/coach')}
                      className={cn(
                        "nav-link-rtl w-full justify-start",
                        location.pathname === '/coach' && "bg-primary/10 text-primary"
                      )}
                    >
                      <Users className="w-5 h-5 icon-start" />
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <span>{t("Coach")}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-1 py-0">
                          Pro
                        </Badge>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleNavigation('/admin')}
                      className={cn(
                        "nav-link-rtl w-full justify-start",
                        location.pathname === '/admin' && "bg-primary/10 text-primary"
                      )}
                    >
                      <Shield className="w-5 h-5 icon-start" />
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                        <span>{t("Admin")}</span>
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          Sys
                        </Badge>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

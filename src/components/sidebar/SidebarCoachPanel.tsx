
import React from "react";
import { Users, Settings, Calendar, MessageSquare, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel 
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { useCoach } from "@/hooks/useCoach";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  description?: string;
}

const SidebarCoachPanel = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const { trainees, isCoach } = useCoach();

  const coachItems: NavigationItem[] = [
    { 
      href: "/coach/trainees", 
      icon: Users, 
      label: String(tNav("trainees")),
      description: `${trainees?.length || 0} ${String(tNav("activeClients"))}`
    },
    { 
      href: "/coach/schedule", 
      icon: Calendar, 
      label: "Schedule",
      description: "Manage appointments"
    },
    { 
      href: "/coach/messages", 
      icon: MessageSquare, 
      label: "Messages",
      description: "Client communications"
    },
    { 
      href: "/coach/analytics", 
      icon: BarChart3, 
      label: "Analytics",
      description: "Client progress tracking"
    },
    { 
      href: "/coach/settings", 
      icon: Settings, 
      label: String(tNav("coachSettings")),
      description: "Profile & preferences"
    },
  ];

  if (!isCoach) {
    return null;
  }

  return (
    <SidebarGroup className="px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 mx-2 rounded-lg border border-green-200">
      <SidebarGroupLabel className={cn(
        "text-xs font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2 px-2",
        isRTL && "flex-row-reverse text-right"
      )} data-sidebar="group-label">
        <Users className="w-4 h-4 text-green-600" />
        {String(tNav("coachPanel"))}
      </SidebarGroupLabel>
      
      <div className="text-xs text-green-600 mb-3 px-2 font-medium">
        {String(tNav("professionalCoach"))}
      </div>

      <SidebarMenu className="space-y-1">
        {coachItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  "w-full text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors rounded-lg",
                  isActive && "bg-green-100 text-green-800 border-r-2 border-green-600 shadow-sm",
                  isRTL && "text-right",
                  isRTL && isActive && "border-r-0 border-l-2 border-green-600"
                )}
                data-sidebar="menu-button"
              >
                <Link 
                  to={item.href} 
                  className={cn(
                    "flex flex-col gap-1 px-3 py-2 w-full",
                    isRTL && "text-right"
                  )} 
                  data-sidebar="menu-item"
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse"
                  )}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </div>
                  {item.description && (
                    <span className="text-xs text-green-600 ml-6 truncate">
                      {item.description}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarCoachPanel;

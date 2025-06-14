
import { useI18n } from "@/hooks/useI18n"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { useRole } from "@/hooks/useRole"
import { useState } from "react"
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  BarChart3, 
  Target,
  MessageSquare,
  Calendar,
  User,
  Settings,
  LogOut,
  Shield,
  Users,
  Sparkles
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const AppSidebar = () => {
  const { isRTL } = useI18n()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const { isAdmin, isCoach } = useRole()
  const location = useLocation()

  const mainItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/meal-plan", icon: Utensils, label: "Meal Plan" },
    { href: "/exercise", icon: Dumbbell, label: "Exercise" },
    { href: "/progress", icon: BarChart3, label: "Progress" },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/food-tracker", icon: Calendar, label: "Food Tracker" },
    { href: "/chat", icon: MessageSquare, label: "AI Chat" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
      navigate('/auth')
    }
  }

  return (
    <Sidebar 
      className={cn(
        "border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        isRTL ? 'border-l border-r-0' : '',
        isCollapsed && !isMobile ? 'w-16' : 'w-64',
        isMobile && 'w-80 shadow-lg z-50'
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-0 border-b border-gray-200">
        <div className={cn(
          "flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden",
          isRTL && "flex-row-reverse"
        )}>
          <div className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {state === "expanded" && (
            <div className={cn("flex flex-col relative", isRTL && "text-right")}>
              <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                FitFatta
              </h1>
              <p className="text-xs text-white/90 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Your AI Fitness Companion
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className={cn(
        "py-4 space-y-4 overflow-y-auto overflow-x-hidden",
        isCollapsed && !isMobile ? "px-1" : "px-2"
      )}>
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className={cn(
              "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
              isRTL && "text-right"
            )}>
              Menu
            </div>
          )}
          
          {mainItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg",
                  isActive && "bg-blue-50 text-blue-700 shadow-sm",
                  isActive && !isRTL && "border-r-2 border-blue-600",
                  isActive && isRTL && "border-l-2 border-blue-600",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                  isRTL && !isCollapsed && "flex-row-reverse text-right"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Management Panel for Admins/Coaches */}
        {(isAdmin || isCoach) && (
          <div className="space-y-1">
            {!isCollapsed && (
              <div className={cn(
                "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
                isRTL && "text-right"
              )}>
                {isAdmin ? "Administration" : "Coaching"}
              </div>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors rounded-lg",
                  location.pathname === '/admin' && "bg-purple-50 text-purple-700 border-r-2 border-purple-600 shadow-sm",
                  isRTL && location.pathname === '/admin' && "border-r-0 border-l-2 border-purple-600",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                  isRTL && !isCollapsed && "flex-row-reverse text-right"
                )}
              >
                <Shield className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">Admin Panel</span>}
              </Link>
            )}
            
            {isCoach && (
              <Link
                to="/coach"
                className={cn(
                  "flex items-center w-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors rounded-lg",
                  location.pathname === '/coach' && "bg-green-50 text-green-700 border-r-2 border-green-600 shadow-sm",
                  isRTL && location.pathname === '/coach' && "border-r-0 border-l-2 border-green-600",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
                  isRTL && !isCollapsed && "flex-row-reverse text-right"
                )}
              >
                <Users className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">Coach Dashboard</span>}
              </Link>
            )}
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className={cn(
        "border-t border-gray-200 bg-white p-0",
        isCollapsed && !isMobile ? "p-1" : ""
      )}>
        <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-gray-100">
          {/* User Info */}
          {state === "expanded" && user && (
            <div 
              className="mb-4 p-3 bg-white rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user.email?.split('@')[0] || 'User'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? "Admin" : isCoach ? "Coach" : "User"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {/* Settings */}
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-start text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors p-2"
            >
              <Settings className="w-4 h-4 mr-2" />
              {state === "expanded" && <span>Settings</span>}
            </button>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className={cn(
                "w-full flex items-center justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors",
                "border border-red-200 hover:border-red-300 font-medium p-2"
              )}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {state === "expanded" && <span>Logout</span>}
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

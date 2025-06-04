
import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export const SidebarBranding = () => {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 border-b border-gray-200",
      isCollapsed && "justify-center p-3"
    )}>
      <Link 
        to="/dashboard" 
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              BodyWise
            </h1>
            <p className="text-xs text-gray-500 leading-tight">
              AI Fitness
            </p>
          </div>
        )}
      </Link>
    </div>
  );
};


import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Shield,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '@/shared/hooks/useAdmin';
import { Link } from 'react-router-dom';

const SidebarAdminPanel = () => {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </Card>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-red-600" />
        <h3 className="font-semibold text-red-800">Admin Panel</h3>
        <Badge variant="destructive" className="text-xs">ADMIN</Badge>
      </div>
      
      <div className="space-y-2">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-700 hover:bg-red-100">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>
        </Link>
        
        <Link to="/admin?tab=analytics">
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-700 hover:bg-red-100">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </Link>
        
        <Link to="/admin?tab=system">
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-700 hover:bg-red-100">
            <Activity className="w-4 h-4 mr-2" />
            System Health
          </Button>
        </Link>
      </div>
      
      <div className="mt-3 pt-3 border-t border-red-200">
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Admin access detected
        </p>
      </div>
    </Card>
  );
};

export default SidebarAdminPanel;

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Shield, Crown, Calendar, Settings } from "lucide-react";
import { createOptimizedComponent } from '@/shared/utils/performanceOptimizer';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'normal' | 'coach' | 'admin';
  ai_generations_remaining: number;
  created_at: string;
  is_online?: boolean;
  last_seen?: string;
  subscription?: {
    id: string;
    status: string;
    plan_type: string;
    current_period_end: string;
  };
}

interface UserTableRowProps {
  user: User;
  actionLoading: string | null;
  onEditUser: (user: User) => void;
  onUpdateRole: (userId: string, role: 'normal' | 'coach' | 'admin') => void;
  onManageGenerations: (user: User) => void;
  onCreateSubscription: (userId: string) => void;
  onCancelSubscription: (userId: string) => void;
}

const UserTableRowComponent: React.FC<UserTableRowProps> = ({
  user,
  actionLoading,
  onEditUser,
  onUpdateRole,
  onManageGenerations,
  onCreateSubscription,
  onCancelSubscription
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'coach': return 'default';
      default: return 'secondary';
    }
  };

  const getSubscriptionBadge = (user: User) => {
    if (user.subscription && user.subscription.status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Crown className="h-3 w-3 mr-1" />
          Pro
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        Free
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDisplayName = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email.split('@')[0];
  };

  const getOnlineStatus = (user: User) => {
    if (user.is_online) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>;
    }
    return <Badge variant="secondary">Offline</Badge>;
  };

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{getDisplayName(user)}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          {getOnlineStatus(user)}
        </div>
      </TableCell>
      
      <TableCell>
        <Badge variant={getRoleBadgeColor(user.role)}>
          {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </TableCell>
      
      <TableCell>{getSubscriptionBadge(user)}</TableCell>
      
      <TableCell>
        <div className="text-center">
          <div className="font-medium">{user.ai_generations_remaining}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageGenerations(user)}
            disabled={actionLoading === `generation-${user.id}`}
            className="text-xs"
          >
            Manage
          </Button>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {formatDate(user.created_at)}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditUser(user)}
            disabled={actionLoading === `edit-${user.id}`}
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          {user.role !== 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateRole(user.id, user.role === 'coach' ? 'normal' : 'coach')}
              disabled={actionLoading === `role-${user.id}`}
            >
              {user.role === 'coach' ? 'Remove Coach' : 'Make Coach'}
            </Button>
          )}
          
          {user.subscription && user.subscription.status === 'active' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancelSubscription(user.id)}
              disabled={actionLoading === `cancel-sub-${user.id}`}
              className="text-red-600 hover:text-red-700"
            >
              Cancel Pro
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateSubscription(user.id)}
              disabled={actionLoading === `create-sub-${user.id}`}
              className="text-green-600 hover:text-green-700"
            >
              Make Pro
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export const UserTableRow = createOptimizedComponent(UserTableRowComponent, {
  displayName: 'UserTableRow',
  shouldUpdate: (prevProps, nextProps) => {
    // Only re-render if user data or loading state changes
    return (
      prevProps.user.id !== nextProps.user.id ||
      prevProps.user.role !== nextProps.user.role ||
      prevProps.user.ai_generations_remaining !== nextProps.user.ai_generations_remaining ||
      prevProps.user.is_online !== nextProps.user.is_online ||
      prevProps.actionLoading !== nextProps.actionLoading ||
      JSON.stringify(prevProps.user.subscription) !== JSON.stringify(nextProps.user.subscription)
    );
  }
});

export default UserTableRow; 
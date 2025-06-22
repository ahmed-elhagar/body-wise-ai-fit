import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, FilterX } from "lucide-react";
import { createOptimizedComponent } from '@/shared/utils/performanceOptimizer';

interface UserTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onSearchKeyPress: (e: React.KeyboardEvent) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  subscriptionFilter: string;
  onSubscriptionFilterChange: (value: string) => void;
  onlineFilter: string;
  onOnlineFilterChange: (value: string) => void;
  onClearFilters: () => void;
  totalUsers: number;
}

const UserTableHeaderComponent: React.FC<UserTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onSearchKeyPress,
  roleFilter,
  onRoleFilterChange,
  subscriptionFilter,
  onSubscriptionFilterChange,
  onlineFilter,
  onOnlineFilterChange,
  onClearFilters,
  totalUsers
}) => {
  const hasActiveFilters = roleFilter !== 'all' || subscriptionFilter !== 'all' || onlineFilter !== 'all' || searchTerm.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management ({totalUsers} users)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  placeholder="Search by email, first name, or last name..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={onSearchKeyPress}
                  className="flex-1"
                />
                <Button onClick={onSearch} variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="role-filter">Role</Label>
              <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subscription-filter">Subscription</Label>
              <Select value={subscriptionFilter} onValueChange={onSubscriptionFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subscriptions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="pro">Pro Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="online-filter">Online Status</Label>
              <Select value={onlineFilter} onValueChange={onOnlineFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={onClearFilters}
                variant="outline"
                disabled={!hasActiveFilters}
                className="w-full"
              >
                {hasActiveFilters ? <FilterX className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserTableHeader = createOptimizedComponent(UserTableHeaderComponent, {
  displayName: 'UserTableHeader',
  shouldUpdate: (prevProps, nextProps) => {
    // Only re-render if search term, filters, or total count changes
    return (
      prevProps.searchTerm !== nextProps.searchTerm ||
      prevProps.roleFilter !== nextProps.roleFilter ||
      prevProps.subscriptionFilter !== nextProps.subscriptionFilter ||
      prevProps.onlineFilter !== nextProps.onlineFilter ||
      prevProps.totalUsers !== nextProps.totalUsers
    );
  }
});

export default UserTableHeader; 
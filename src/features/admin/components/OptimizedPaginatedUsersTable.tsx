import React, { useState, Suspense } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, X } from "lucide-react";
import { createOptimizedComponent, createVirtualizedList } from '@/shared/utils/performanceOptimizer';
import { useOptimizedUserTable } from '../hooks/useOptimizedUserTable';

// Lazy load sub-components for better performance
const UserTableHeader = React.lazy(() => import('./users-table/UserTableHeader'));
const UserTableRow = React.lazy(() => import('./users-table/UserTableRow'));
const UserTablePagination = React.lazy(() => import('./users-table/UserTablePagination'));

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

const OptimizedPaginatedUsersTableComponent: React.FC = () => {
  const {
    users,
    totalUsers,
    currentPage,
    loading,
    actionLoading,
    searchTerm,
    filters,
    setCurrentPage,
    setSearchTerm,
    setRoleFilter,
    setSubscriptionFilter,
    setOnlineFilter,
    handleSearch,
    handleSearchKeyPress,
    clearFilters,
    updateUserRole,
    updateGenerationLimit,
    createSubscription,
    cancelSubscription
  } = useOptimizedUserTable();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  const [newGenerationLimit, setNewGenerationLimit] = useState("");

  // Virtualization for large user lists (optional optimization)
  const virtualization = createVirtualizedList(users, 60, 600); // 60px per row, 600px container

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleManageGenerations = (user: User) => {
    setSelectedUser(user);
    setNewGenerationLimit(user.ai_generations_remaining.toString());
    setIsGenerationDialogOpen(true);
  };

  const handleGenerationLimitSubmit = async () => {
    if (selectedUser && newGenerationLimit) {
      const newLimit = parseInt(newGenerationLimit);
      if (!isNaN(newLimit) && newLimit >= 0) {
        await updateGenerationLimit(selectedUser.id, newLimit);
        setIsGenerationDialogOpen(false);
        setSelectedUser(null);
        setNewGenerationLimit("");
      }
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Suspense fallback={<div className="h-48 bg-gray-100 rounded animate-pulse" />}>
        <UserTableHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          onSearchKeyPress={handleSearchKeyPress}
          roleFilter={filters.role}
          onRoleFilterChange={setRoleFilter}
          subscriptionFilter={filters.subscription}
          onSubscriptionFilterChange={setSubscriptionFilter}
          onlineFilter={filters.online}
          onOnlineFilterChange={setOnlineFilter}
          onClearFilters={clearFilters}
          totalUsers={totalUsers}
        />
      </Suspense>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <Alert>
                <AlertDescription>
                  No users found matching your criteria. Try adjusting your search or filters.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead className="text-center">AI Generations</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Suspense fallback={
                    <TableRow>
                      <td colSpan={6} className="p-4 text-center">
                        <div className="animate-pulse">Loading users...</div>
                      </td>
                    </TableRow>
                  }>
                    {users.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        actionLoading={actionLoading}
                        onEditUser={handleEditUser}
                        onUpdateRole={updateUserRole}
                        onManageGenerations={handleManageGenerations}
                        onCreateSubscription={createSubscription}
                        onCancelSubscription={cancelSubscription}
                      />
                    ))}
                  </Suspense>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalUsers > 10 && (
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded animate-pulse" />}>
          <UserTablePagination
            currentPage={currentPage}
            totalUsers={totalUsers}
            usersPerPage={10}
            onPageChange={setCurrentPage}
          />
        </Suspense>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={selectedUser.email} disabled />
              </div>
              <div>
                <Label>First Name</Label>
                <Input value={selectedUser.first_name || ''} disabled />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={selectedUser.last_name || ''} disabled />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={selectedUser.role} disabled />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generation Limit Dialog */}
      <Dialog open={isGenerationDialogOpen} onOpenChange={setIsGenerationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage AI Generations</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <Input 
                  value={`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.email} 
                  disabled 
                />
              </div>
              <div>
                <Label htmlFor="generation-limit">New Generation Limit</Label>
                <Input
                  id="generation-limit"
                  type="number"
                  min="0"
                  value={newGenerationLimit}
                  onChange={(e) => setNewGenerationLimit(e.target.value)}
                  placeholder="Enter new limit"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsGenerationDialogOpen(false);
                    setSelectedUser(null);
                    setNewGenerationLimit("");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerationLimitSubmit}
                  disabled={!newGenerationLimit || actionLoading === `generation-${selectedUser.id}`}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Update Limit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const OptimizedPaginatedUsersTable = createOptimizedComponent(
  OptimizedPaginatedUsersTableComponent,
  {
    displayName: 'OptimizedPaginatedUsersTable',
    trackPerformance: true,
    enableProfiling: true
  }
);

export default OptimizedPaginatedUsersTable; 
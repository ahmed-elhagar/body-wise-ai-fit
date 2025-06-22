import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  Crown,
  Calendar,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  FilterX,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const USERS_PER_PAGE = 10;

const PaginatedUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [onlineFilter, setOnlineFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  const [newGenerationLimit, setNewGenerationLimit] = useState("");
  const queryClient = useQueryClient();

  const fetchUsers = async (page: number = 1, search: string = "", filters: any = {}) => {
    setLoading(true);
    try {
      console.log(`Fetching users - Page: ${page}, Search: "${search}", Filters:`, filters);
      
      const offset = (page - 1) * USERS_PER_PAGE;
      
      // First, get all active subscriptions to identify Pro users
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('user_id, id, status, plan_type, current_period_end')
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString());

      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
      }

      const activeProUserIds = new Set(activeSubscriptions?.map(sub => sub.user_id) || []);
      console.log('Active Pro users found:', activeProUserIds.size);

      // Build query for profiles
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          ai_generations_remaining,
          created_at,
          is_online,
          last_seen
        `, { count: 'exact' });

      // Apply search filter
      if (search.trim()) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      }

      // Apply role filter
      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      // Apply online status filter
      if (filters.online && filters.online !== 'all') {
        if (filters.online === 'online') {
          query = query.eq('is_online', true);
        } else if (filters.online === 'offline') {
          query = query.eq('is_online', false);
        }
      }

      // For subscription filter, we need to handle it differently
      if (filters.subscription && filters.subscription !== 'all') {
        if (filters.subscription === 'pro') {
          // Only get users who have active subscriptions
          if (activeProUserIds.size > 0) {
            query = query.in('id', Array.from(activeProUserIds));
          } else {
            // No pro users, return empty result
            setUsers([]);
            setTotalUsers(0);
            setLoading(false);
            return;
          }
        } else if (filters.subscription === 'free') {
          // Only get users who don't have active subscriptions
          if (activeProUserIds.size > 0) {
            query = query.not('id', 'in', `(${Array.from(activeProUserIds).map(id => `'${id}'`).join(',')})`);
          }
          // If no pro users, all users are free, so no additional filter needed
        }
      }

      // Apply pagination and ordering
      const { data: profiles, error: profilesError, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + USERS_PER_PAGE - 1);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Merge subscription data with user data
      const usersWithSubscriptions = (profiles || []).map(user => {
        const userSubscription = activeSubscriptions?.find(sub => sub.user_id === user.id);
        return {
          ...user,
          role: user.role as 'normal' | 'coach' | 'admin',
          subscription: userSubscription || null
        };
      });

      setUsers(usersWithSubscriptions);
      setTotalUsers(count || 0);
      console.log(`Fetched ${usersWithSubscriptions.length} users, Total: ${count}`);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = {
      role: roleFilter,
      subscription: subscriptionFilter,
      online: onlineFilter
    };
    fetchUsers(currentPage, searchTerm, filters);
  }, [currentPage, roleFilter, subscriptionFilter, onlineFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    const filters = {
      role: roleFilter,
      subscription: subscriptionFilter,
      online: onlineFilter
    };
    fetchUsers(1, searchTerm, filters);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setSubscriptionFilter("all");
    setOnlineFilter("all");
    setCurrentPage(1);
    fetchUsers(1, "", { role: "all", subscription: "all", online: "all" });
  };

  const updateUserRole = async (userId: string, newRole: 'normal' | 'coach' | 'admin') => {
    setActionLoading(`role-${userId}`);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      const filters = { role: roleFilter, subscription: subscriptionFilter, online: onlineFilter };
      await fetchUsers(currentPage, searchTerm, filters);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const updateGenerationLimit = async (userId: string, newLimit: number) => {
    setActionLoading(`generation-${userId}`);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ai_generations_remaining: newLimit,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`AI generation limit updated to ${newLimit}`);
      const filters = { role: roleFilter, subscription: subscriptionFilter, online: onlineFilter };
      await fetchUsers(currentPage, searchTerm, filters);
      setIsGenerationDialogOpen(false);
      setSelectedUser(null);
      setNewGenerationLimit("");
    } catch (error) {
      console.error('Error updating generation limit:', error);
      toast.error('Failed to update generation limit');
    } finally {
      setActionLoading(null);
    }
  };

  const createSubscription = async (userId: string) => {
    setActionLoading(`sub-${userId}`);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingSub) {
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan_type: 'monthly',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: `admin_created_${userId}`,
            stripe_subscription_id: `admin_sub_${userId}_${Date.now()}`,
            status: 'active',
            plan_type: 'monthly',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            cancel_at_period_end: false,
            stripe_price_id: 'admin_created',
            interval: 'month'
          });

        if (error) throw error;
      }

      toast.success('1-month subscription created successfully');
      const filters = { role: roleFilter, subscription: subscriptionFilter, online: onlineFilter };
      await fetchUsers(currentPage, searchTerm, filters);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const cancelSubscription = async (userId: string) => {
    setActionLoading(`cancel-${userId}`);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          cancel_at_period_end: true 
        })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      toast.success('Subscription cancelled successfully');
      const filters = { role: roleFilter, subscription: subscriptionFilter, online: onlineFilter };
      await fetchUsers(currentPage, searchTerm, filters);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'coach': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSubscriptionBadge = (user: User) => {
    if (user.subscription && user.subscription.status === 'active') {
      const endDate = new Date(user.subscription.current_period_end);
      const isActive = endDate > new Date();
      
      if (isActive) {
        return (
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        );
      }
    }
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-300">
        Free
      </Badge>
    );
  };

  const handleGenerationLimitSubmit = () => {
    if (selectedUser && newGenerationLimit) {
      const limit = parseInt(newGenerationLimit);
      if (isNaN(limit) || limit < 0) {
        toast.error('Please enter a valid number (0 or greater)');
        return;
      }
      updateGenerationLimit(selectedUser.id, limit);
    }
  };

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const hasActiveFilters = searchTerm || roleFilter !== 'all' || subscriptionFilter !== 'all' || onlineFilter !== 'all';

  // Enhanced pagination with better page numbers display
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages > 0) {
      rangeWithDots.push(1);
    }

    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Add dots and range
    if (currentPage - delta > 2) {
      rangeWithDots.push('...');
    }

    rangeWithDots.push(...range);

    // Add dots and last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...');
    }

    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, arr) => 
      page !== arr[index - 1] // Remove duplicates
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">User Management</h2>
            <p className="text-gray-600">Manage user roles, subscriptions, and AI generations</p>
          </div>
        </div>
        
        <Button onClick={() => {
          const filters = { role: roleFilter, subscription: subscriptionFilter, online: onlineFilter };
          fetchUsers(currentPage, searchTerm, filters);
        }} variant="outline" disabled={loading}>
          <UserPlus className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>User Management:</strong> Update roles, manage subscriptions, and control AI generation limits.
          <br />
          <strong>Enhanced Filters:</strong> Search by name/email and filter by role, subscription type, and online status.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({totalUsers})
            </CardTitle>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <FilterX className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} variant="outline" size="sm">
                  Search
                </Button>
              </div>
            </div>
            
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="coach">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Coach
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by subscription" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      All Users
                    </div>
                  </SelectItem>
                  <SelectItem value="pro">
                    <div className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-yellow-500" />
                      Pro Members
                    </div>
                  </SelectItem>
                  <SelectItem value="free">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Free Users
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={onlineFilter} onValueChange={setOnlineFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${onlineFilter === 'online' ? 'bg-green-500' : onlineFilter === 'offline' ? 'bg-gray-400' : 'bg-blue-500'}`} />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Online Now
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      Offline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Users className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading users...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>AI Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex flex-col space-y-2">
                            <div className="flex flex-col">
                              <div className="font-medium text-gray-900">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}` 
                                  : user.email}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                              {getSubscriptionBadge(user)}
                            </div>
                            {user.subscription && (
                              <div className="text-xs text-gray-500">
                                Expires: {new Date(user.subscription.current_period_end).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-lg">{user.ai_generations_remaining}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setNewGenerationLimit(user.ai_generations_remaining.toString());
                                setIsGenerationDialogOpen(true);
                              }}
                              disabled={actionLoading === `generation-${user.id}`}
                              className="h-8 w-8 p-0"
                              title="Set custom limit"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm">{user.is_online ? 'Online' : 'Offline'}</span>
                          </div>
                          {user.last_seen && !user.is_online && (
                            <div className="text-xs text-gray-500">
                              Last seen: {new Date(user.last_seen).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                  disabled={actionLoading === `role-${user.id}`}
                                >
                                  Edit Role
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User Role</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Email</Label>
                                    <Input value={selectedUser?.email || ''} disabled />
                                  </div>
                                  <div>
                                    <Label>Role</Label>
                                    <Select
                                      value={selectedUser?.role || 'normal'}
                                      onValueChange={(value: 'normal' | 'coach' | 'admin') => {
                                        if (selectedUser) {
                                          updateUserRole(selectedUser.id, value);
                                        }
                                      }}
                                      disabled={actionLoading === `role-${selectedUser?.id}`}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="coach">Coach</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {user.subscription && user.subscription.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelSubscription(user.id)}
                                disabled={actionLoading === `cancel-${user.id}`}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel Sub
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => createSubscription(user.id)}
                                disabled={actionLoading === `sub-${user.id}`}
                                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Add 1M Sub
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Enhanced Pagination with better page numbers */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} to {Math.min(currentPage * USERS_PER_PAGE, totalUsers)} of {totalUsers} users
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1 || loading}
                      className="h-8 w-8 p-0"
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    
                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading}
                      className="h-8 w-8 p-0"
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 mx-2">
                      {getVisiblePages().map((page, index) => (
                        <div key={index}>
                          {page === '...' ? (
                            <span className="px-2 text-gray-400 text-sm">...</span>
                          ) : (
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page as number)}
                              disabled={loading}
                              className="h-8 w-8 p-0 text-sm"
                            >
                              {page}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                      className="h-8 w-8 p-0"
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || loading}
                      className="h-8 w-8 p-0"
                      title="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Generation Limit Dialog */}
      <Dialog open={isGenerationDialogOpen} onOpenChange={setIsGenerationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update AI Generation Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User</Label>
              <Input 
                value={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})` : ''} 
                disabled 
              />
            </div>
            <div>
              <Label>Current Limit</Label>
              <Input value={selectedUser?.ai_generations_remaining || 0} disabled />
            </div>
            <div>
              <Label>New Limit</Label>
              <Input
                type="number"
                min="0"
                value={newGenerationLimit}
                onChange={(e) => setNewGenerationLimit(e.target.value)}
                placeholder="Enter new generation limit"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerationLimitSubmit}
                disabled={actionLoading === `generation-${selectedUser?.id}` || !newGenerationLimit}
                className="flex-1"
              >
                {actionLoading === `generation-${selectedUser?.id}` ? 'Updating...' : 'Update Limit'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsGenerationDialogOpen(false);
                  setSelectedUser(null);
                  setNewGenerationLimit("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginatedUsersTable;

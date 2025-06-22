import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createOptimizedHook } from '@/shared/utils/performanceOptimizer';

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

interface UseUserTableFilters {
  role: string;
  subscription: string;
  online: string;
  search: string;
}

interface UseUserTableReturn {
  users: User[];
  totalUsers: number;
  currentPage: number;
  loading: boolean;
  actionLoading: string | null;
  searchTerm: string;
  filters: UseUserTableFilters;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;
  setSubscriptionFilter: (subscription: string) => void;
  setOnlineFilter: (online: string) => void;
  handleSearch: () => void;
  handleSearchKeyPress: (e: React.KeyboardEvent) => void;
  clearFilters: () => void;
  updateUserRole: (userId: string, newRole: 'normal' | 'coach' | 'admin') => Promise<void>;
  updateGenerationLimit: (userId: string, newLimit: number) => Promise<void>;
  createSubscription: (userId: string) => Promise<void>;
  cancelSubscription: (userId: string) => Promise<void>;
  refreshData: () => void;
}

const USERS_PER_PAGE = 10;

// Optimized data fetching function
const createOptimizedFetchUsers = createOptimizedHook(
  async (page: number, search: string, filters: UseUserTableFilters) => {
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
      query = query.eq('role', filters.role as 'normal' | 'coach' | 'admin');
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
          return { users: [], totalUsers: 0 };
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

    return {
      users: usersWithSubscriptions,
      totalUsers: count || 0
    };
  },
  []
);

export const useOptimizedUserTable = (): UseUserTableReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [onlineFilter, setOnlineFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // Memoized filters object to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    role: roleFilter,
    subscription: subscriptionFilter,
    online: onlineFilter,
    search: searchTerm
  }), [roleFilter, subscriptionFilter, onlineFilter, searchTerm]);

  // Optimized fetch function
  const fetchUsers = useCallback(async (page: number = 1, search: string = "", filterObj: UseUserTableFilters) => {
    setLoading(true);
    try {
      const result = await createOptimizedFetchUsers(page, search, filterObj);
      setUsers(result.users);
      setTotalUsers(result.totalUsers);
      console.log(`Fetched ${result.users.length} users, Total: ${result.totalUsers}`);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for fetching data when dependencies change
  useEffect(() => {
    fetchUsers(currentPage, searchTerm, filters);
  }, [currentPage, filters, fetchUsers]);

  // Optimized event handlers
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchUsers(1, searchTerm, filters);
  }, [searchTerm, filters, fetchUsers]);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter("all");
    setSubscriptionFilter("all");
    setOnlineFilter("all");
    setCurrentPage(1);
  }, []);

  const refreshData = useCallback(() => {
    fetchUsers(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, filters, fetchUsers]);

  // Optimized action handlers
  const updateUserRole = useCallback(async (userId: string, newRole: 'normal' | 'coach' | 'admin') => {
    setActionLoading(`role-${userId}`);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User role updated to ${newRole}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      refreshData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  }, [queryClient, refreshData]);

  const updateGenerationLimit = useCallback(async (userId: string, newLimit: number) => {
    setActionLoading(`generation-${userId}`);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: newLimit })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`AI generation limit updated to ${newLimit}`);
      refreshData();
    } catch (error) {
      console.error('Error updating generation limit:', error);
      toast.error('Failed to update generation limit');
    } finally {
      setActionLoading(null);
    }
  }, [refreshData]);

  const createSubscription = useCallback(async (userId: string) => {
    setActionLoading(`create-sub-${userId}`);
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan_type: 'pro_monthly',
          current_period_start: new Date().toISOString(),
          current_period_end: endDate.toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: 100 })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Pro subscription created successfully');
      refreshData();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription');
    } finally {
      setActionLoading(null);
    }
  }, [refreshData]);

  const cancelSubscription = useCallback(async (userId: string) => {
    setActionLoading(`cancel-sub-${userId}`);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      toast.success('Subscription canceled successfully');
      refreshData();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  }, [refreshData]);

  return {
    users,
    totalUsers,
    currentPage,
    loading,
    actionLoading,
    searchTerm,
    filters,
    setCurrentPage,
    setSearchTerm,
    setRoleFilter: setRoleFilter,
    setSubscriptionFilter: setSubscriptionFilter,
    setOnlineFilter: setOnlineFilter,
    handleSearch,
    handleSearchKeyPress,
    clearFilters,
    updateUserRole,
    updateGenerationLimit,
    createSubscription,
    cancelSubscription,
    refreshData
  };
}; 
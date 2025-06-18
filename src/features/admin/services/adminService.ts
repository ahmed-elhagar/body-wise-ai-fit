
import { supabase } from '@/integrations/supabase/client';
import type { AdminUser, AdminStats, SystemHealth, AIGenerationLog } from '../types';

export const adminService = {
  // User management
  async getAllUsers(limit = 100, offset = 0): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        role,
        created_at,
        last_seen,
        is_online
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    // Filter out 'pro' role and map to AdminUser type
    return (data || [])
      .filter((user: any) => user.role !== 'pro')
      .map((user: any) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role as 'admin' | 'coach' | 'normal',
        created_at: user.created_at,
        last_seen: user.last_seen,
        is_online: user.is_online,
      }));
  },

  async updateUserRole(userId: string, role: 'admin' | 'coach' | 'normal'): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  // AI Generation logs
  async getAIGenerationLogs(limit = 100, offset = 0): Promise<AIGenerationLog[]> {
    const { data, error } = await supabase
      .from('ai_generation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    // Map to proper type with status casting
    return (data || []).map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      generation_type: log.generation_type,
      status: log.status as 'success' | 'failed' | 'pending',
      credits_used: log.credits_used,
      created_at: log.created_at,
      error_message: log.error_message,
    }));
  },

  // System health monitoring
  async getSystemHealth(): Promise<SystemHealth> {
    // This would typically come from a system monitoring service
    // For now, return mock data
    return {
      status: 'healthy',
      uptime: 99.9,
      activeConnections: 150,
      memoryUsage: 65,
      cpuUsage: 45,
      lastHealthCheck: new Date().toISOString(),
    };
  },

  // Analytics
  async getAnalytics(period: 'day' | 'week' | 'month' = 'day') {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get user signups
    const { count: newUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Get AI generations
    const { count: aiGenerations } = await supabase
      .from('ai_generation_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return {
      newUsers: newUsers || 0,
      aiGenerations: aiGenerations || 0,
      activeSubscriptions: activeSubscriptions || 0,
      period,
    };
  },
};

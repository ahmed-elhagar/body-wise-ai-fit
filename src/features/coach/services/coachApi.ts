// Coach API Service Layer
// Centralized API calls for coach functionality

import { supabase } from '@/integrations/supabase/client';
import type { 
  CoachInfo, 
  TraineeInfo, 
  CoachMessage, 
  CoachTask,
  CoachAnalytics,
  CreateTaskForm,
  UpdateTaskForm,
  AssignTraineeForm,
  SendMessageForm,
  TraineeFilters,
  TaskFilters,
  CoachApiResponse
} from '../types/coach.types';

// Coach Management
export const coachApi = {
  // Trainee Management
  async getTrainees(coachId: string, filters?: TraineeFilters): Promise<CoachApiResponse<TraineeInfo[]>> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          coach_id,
          assigned_at,
          fitness_goals,
          current_weight,
          target_weight,
          activity_level,
          dietary_preferences,
          medical_conditions,
          progress_score,
          last_active,
          created_at,
          updated_at
        `)
        .eq('coach_id', coachId);

      if (filters?.search) {
        query = query.ilike('full_name', `%${filters.search}%`);
      }

      if (filters?.activity_level?.length) {
        query = query.in('activity_level', filters.activity_level);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: data || [],
        success: true
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  },

  async assignTrainee(coachId: string, form: AssignTraineeForm): Promise<CoachApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          coach_id: coachId,
          assigned_at: new Date().toISOString()
        })
        .eq('id', form.trainee_id);

      if (error) throw error;

      return {
        data: true,
        success: true
      };
    } catch (error: any) {
      return {
        data: false,
        success: false,
        error: error.message
      };
    }
  },

  // Task Management
  async getTasks(coachId: string, filters?: TaskFilters): Promise<CoachApiResponse<CoachTask[]>> {
    try {
      let query = supabase
        .from('coach_tasks')
        .select(`
          *,
          trainee:profiles!trainee_id(id, full_name, avatar_url)
        `)
        .eq('coach_id', coachId);

      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }

      if (filters?.trainee_id) {
        query = query.eq('trainee_id', filters.trainee_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: data || [],
        success: true
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  },

  async createTask(coachId: string, form: CreateTaskForm): Promise<CoachApiResponse<CoachTask>> {
    try {
      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          coach_id: coachId,
          ...form
        })
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        success: true
      };
    } catch (error: any) {
      return {
        data: {} as CoachTask,
        success: false,
        error: error.message
      };
    }
  },

  async updateTask(taskId: string, form: UpdateTaskForm): Promise<CoachApiResponse<CoachTask>> {
    try {
      const { data, error } = await supabase
        .from('coach_tasks')
        .update(form)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        success: true
      };
    } catch (error: any) {
      return {
        data: {} as CoachTask,
        success: false,
        error: error.message
      };
    }
  },

  // Messaging
  async getMessages(threadId: string): Promise<CoachApiResponse<CoachMessage[]>> {
    try {
      const { data, error } = await supabase
        .from('coach_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, avatar_url),
          receiver:profiles!receiver_id(id, full_name, avatar_url)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return {
        data: data || [],
        success: true
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  },

  async sendMessage(form: SendMessageForm): Promise<CoachApiResponse<CoachMessage>> {
    try {
      const { data, error } = await supabase
        .from('coach_messages')
        .insert(form)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        success: true
      };
    } catch (error: any) {
      return {
        data: {} as CoachMessage,
        success: false,
        error: error.message
      };
    }
  },

  // Analytics
  async getAnalytics(coachId: string): Promise<CoachApiResponse<CoachAnalytics>> {
    try {
      // This would typically call an edge function for complex analytics
      const { data, error } = await supabase.functions.invoke('coach-analytics', {
        body: { coach_id: coachId }
      });

      if (error) throw error;

      return {
        data: data || {},
        success: true
      };
    } catch (error: any) {
      return {
        data: {} as CoachAnalytics,
        success: false,
        error: error.message
      };
    }
  }
};

export default coachApi; 
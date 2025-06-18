
import { supabase } from '@/integrations/supabase/client';
import type { CoachTrainee, CoachTask, CoachMessage } from '../types';

export const coachService = {
  // Trainee management
  async getCoachTrainees(coachId: string): Promise<CoachTrainee[]> {
    const { data, error } = await supabase
      .from('coach_trainees')
      .select(`
        *,
        trainee:trainee_id(
          id,
          first_name,
          last_name,
          email,
          role,
          created_at,
          last_seen,
          is_online
        )
      `)
      .eq('coach_id', coachId)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    
    // Map to proper type structure
    return (data || []).map((item: any) => ({
      id: item.id,
      coach_id: item.coach_id,
      trainee_id: item.trainee_id,
      assigned_at: item.assigned_at,
      notes: item.notes,
      trainee: item.trainee ? {
        id: item.trainee.id,
        email: item.trainee.email,
        first_name: item.trainee.first_name,
        last_name: item.trainee.last_name,
        role: item.trainee.role as 'admin' | 'coach' | 'normal',
        created_at: item.trainee.created_at,
        last_seen: item.trainee.last_seen,
        is_online: item.trainee.is_online,
      } : undefined,
    }));
  },

  async assignTrainee(coachId: string, traineeId: string, notes?: string): Promise<CoachTrainee> {
    const { data, error } = await supabase
      .from('coach_trainees')
      .insert({
        coach_id: coachId,
        trainee_id: traineeId,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Task management
  async getCoachTasks(coachId: string): Promise<CoachTask[]> {
    const { data, error } = await supabase
      .from('coach_tasks')
      .select('*')
      .eq('coach_id', coachId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map to proper type with casting
    return (data || []).map((task: any) => ({
      id: task.id,
      coach_id: task.coach_id,
      trainee_id: task.trainee_id,
      title: task.title,
      description: task.description,
      type: task.type as 'review' | 'follow_up' | 'assessment' | 'other',
      priority: task.priority as 'low' | 'medium' | 'high',
      completed: task.completed,
      due_date: task.due_date,
      created_at: task.created_at,
      updated_at: task.updated_at,
    }));
  },

  async createTask(task: Omit<CoachTask, 'id' | 'created_at' | 'updated_at'>): Promise<CoachTask> {
    const { data, error } = await supabase
      .from('coach_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    
    // Map to proper type
    return {
      id: data.id,
      coach_id: data.coach_id,
      trainee_id: data.trainee_id,
      title: data.title,
      description: data.description,
      type: data.type as 'review' | 'follow_up' | 'assessment' | 'other',
      priority: data.priority as 'low' | 'medium' | 'high',
      completed: data.completed,
      due_date: data.due_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async updateTask(taskId: string, updates: Partial<CoachTask>): Promise<void> {
    const { error } = await supabase
      .from('coach_tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) throw error;
  },

  // Messaging
  async getMessages(coachId: string, traineeId: string): Promise<CoachMessage[]> {
    const { data, error } = await supabase
      .from('coach_trainee_messages')
      .select('*')
      .eq('coach_id', coachId)
      .eq('trainee_id', traineeId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Map to proper type with casting
    return (data || []).map((message: any) => ({
      id: message.id,
      coach_id: message.coach_id,
      trainee_id: message.trainee_id,
      sender_id: message.sender_id,
      sender_type: message.sender_type as 'coach' | 'trainee',
      message: message.message,
      message_type: message.message_type as 'text' | 'file' | 'system',
      is_read: message.is_read,
      created_at: message.created_at,
      updated_at: message.updated_at,
    }));
  },

  async sendMessage(
    coachId: string,
    traineeId: string,
    senderId: string,
    senderType: 'coach' | 'trainee',
    message: string
  ): Promise<CoachMessage> {
    const { data, error } = await supabase
      .from('coach_trainee_messages')
      .insert({
        coach_id: coachId,
        trainee_id: traineeId,
        sender_id: senderId,
        sender_type: senderType,
        message,
        message_type: 'text',
      })
      .select()
      .single();

    if (error) throw error;
    
    // Map to proper type
    return {
      id: data.id,
      coach_id: data.coach_id,
      trainee_id: data.trainee_id,
      sender_id: data.sender_id,
      sender_type: data.sender_type as 'coach' | 'trainee',
      message: data.message,
      message_type: data.message_type as 'text' | 'file' | 'system',
      is_read: data.is_read,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },
};

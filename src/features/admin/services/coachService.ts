
import { supabase } from '@/integrations/supabase/client';
import type { CoachTrainee, CoachTask, CoachMessage } from '../types';

export const coachService = {
  // Trainee management
  async getCoachTrainees(coachId: string): Promise<CoachTrainee[]> {
    const { data, error } = await supabase
      .from('coach_trainees')
      .select(`
        *,
        trainee:profiles!coach_trainees_trainee_id_fkey(
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
    return data || [];
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
    return data || [];
  },

  async createTask(task: Omit<CoachTask, 'id' | 'created_at' | 'updated_at'>): Promise<CoachTask> {
    const { data, error } = await supabase
      .from('coach_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
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
    return data;
  },
};

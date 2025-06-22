
// Simplified Coach API Service
import { supabase } from '@/integrations/supabase/client';

export const coachApi = {
  async getTrainees(coachId: string) {
    try {
      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          trainee_profile:profiles!trainee_id(*)
        `)
        .eq('coach_id', coachId);

      if (error) throw error;
      return { data: data || [], success: true };
    } catch (error: any) {
      return { data: [], success: false, error: error.message };
    }
  },

  async getTasks(coachId: string) {
    try {
      const { data, error } = await supabase
        .from('coach_tasks')
        .select('*')
        .eq('coach_id', coachId);

      if (error) throw error;
      return { data: data || [], success: true };
    } catch (error: any) {
      return { data: [], success: false, error: error.message };
    }
  },

  async createTask(coachId: string, taskData: any) {
    try {
      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({ coach_id: coachId, ...taskData })
        .select()
        .single();

      if (error) throw error;
      return { data, success: true };
    } catch (error: any) {
      return { data: null, success: false, error: error.message };
    }
  }
};

export default coachApi;

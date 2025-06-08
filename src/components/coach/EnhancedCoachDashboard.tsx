
import React, { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CoachTraineeChat } from './CoachTraineeChat';
import CoachTabs from './CoachTabs';

interface CoachTraineeRelationship {
  id: string;
  trainee_id: string;
  coach_id: string;
  assigned_at: string;
  notes: string;
  trainee_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const EnhancedCoachDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [trainees, setTrainees] = useState<CoachTraineeRelationship[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTrainees();
    }
  }, [user?.id]);

  const fetchTrainees = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          id,
          trainee_id,
          coach_id,
          assigned_at,
          notes
        `)
        .eq('coach_id', user?.id);

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map(item => ({
        ...item,
        trainee_profile: {
          first_name: 'User',
          last_name: '',
          email: 'user@example.com'
        }
      }));
      
      setTrainees(transformedData);
    } catch (error) {
      console.error('Error fetching trainees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTrainees = () => {
    setSelectedTraineeId(null);
  };

  if (selectedTraineeId) {
    const selectedTrainee = trainees.find(t => t.trainee_id === selectedTraineeId);
    return (
      <CoachTraineeChat
        traineeId={selectedTraineeId}
        traineeName={selectedTrainee?.trainee_profile?.first_name || 'Trainee'}
        onBack={handleBackToTrainees}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('coach:dashboard') || 'Coach Dashboard'}
        </h1>
        <p className="text-gray-600">
          {t('coach:manageTrainees') || 'Manage your trainees and track their progress'}
        </p>
      </div>

      <CoachTabs 
        trainees={trainees}
        setSelectedClient={setSelectedTraineeId}
      />
    </div>
  );
};

export default EnhancedCoachDashboard;

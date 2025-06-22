
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkoutSession = () => {
  const { user } = useAuth();
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  const onStartWorkout = () => {
    setIsTimerRunning(true);
    setSessionStartTime(new Date());
    toast.success('Workout session started!');
  };

  const onPauseWorkout = () => {
    setIsTimerRunning(false);
    toast.info('Workout session paused');
  };

  const onCompleteWorkout = async () => {
    if (!user?.id || !sessionStartTime) return;

    try {
      // Log workout completion
      const { error } = await supabase
        .from('weight_entries')
        .insert([
          {
            user_id: user.id,
            weight: 0, // This would be updated with actual weight tracking
            notes: `Workout completed in ${Math.floor(workoutTimer / 60)} minutes`,
            recorded_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setIsTimerRunning(false);
      setWorkoutTimer(0);
      setSessionStartTime(null);
      toast.success('Workout completed successfully!');
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to complete workout');
    }
  };

  return {
    workoutTimer,
    isTimerRunning,
    sessionStartTime,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout
  };
};

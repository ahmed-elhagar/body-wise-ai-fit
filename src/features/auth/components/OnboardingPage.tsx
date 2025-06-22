
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/ai/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OnboardingContainer from "./onboarding/OnboardingContainer";

const OnboardingPage = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Redirect if already completed onboarding
    if (profile?.onboarding_completed) {
      window.location.href = '/';
    }
  }, [profile?.onboarding_completed]);

  const handleComplete = async (data: any) => {
    if (!user?.id) return;
    
    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          profile_completion_score: 85,
          first_name: data.first_name,
          last_name: data.last_name,
          age: parseInt(data.age),
          gender: data.gender,
          height: parseFloat(data.height),
          weight: parseFloat(data.weight),
          fitness_goal: data.fitness_goal,
          activity_level: data.activity_level,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Onboarding completed! Welcome to FitFatta AI!");
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingContainer
      onComplete={handleComplete}
      isCompleting={isCompleting}
    />
  );
};

export default OnboardingPage;

import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { mapBodyFatToBodyShape } from '@/utils/signupValidation';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  gender?: 'male' | 'female' | 'other';
}

interface BodyStats {
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
}

interface BodyComposition extends BodyStats {
  bodyFatPercentage: number;
  goalBodyFat: number;
}

export const useSignupState = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [bodyStats, setBodyStats] = useState<BodyStats | null>(null);
  const [bodyComposition, setBodyComposition] = useState<BodyComposition | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
  };

  const handleBodyStatsSubmit = (data: BodyStats) => {
    setBodyStats(data);
  };

  const handleBodyCompositionSubmit = async (data: BodyComposition) => {
    try {
      setBodyComposition(data);
      
      // Calculate body shape from body fat percentage
      const bodyShape = mapBodyFatToBodyShape(
        data.bodyFatPercentage, 
        personalInfo?.gender as 'male' | 'female'
      );
      
      setIsLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: personalInfo?.email || '',
        password: personalInfo?.password || '',
        options: {
          data: {
            first_name: personalInfo?.firstName,
            last_name: personalInfo?.lastName,
            age: bodyStats?.age,
            height: bodyStats?.height,
            weight: bodyStats?.weight,
            activity_level: bodyStats?.activityLevel,
            body_fat_percentage: data.bodyFatPercentage,
            goal_body_fat: data.goalBodyFat,
            body_shape: bodyShape,
            gender: personalInfo?.gender
          }
        }
      });

      if (authError) {
        console.error('Signup error:', authError);
        toast.error(`Signup failed: ${authError.message}`);
        setIsLoading(false);
        return;
      }

      toast.success('Account created! Check your email to verify.');
      setIsLoading(false);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(`Signup failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  return {
    personalInfo,
    bodyStats,
    bodyComposition,
    isLoading,
    handlePersonalInfoSubmit,
    handleBodyStatsSubmit,
    handleBodyCompositionSubmit
  };
};


import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useSubscription = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isProMember, setIsProMember] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'pro' | 'premium'>('free');

  useEffect(() => {
    // For now, determine pro status based on user role or profile data
    // This would typically come from a subscription table
    const isPro = profile?.role === 'pro' || profile?.role === 'admin';
    setIsProMember(isPro);
    setSubscriptionStatus(isPro ? 'pro' : 'free');
  }, [profile]);

  return {
    isProMember,
    subscriptionStatus,
    credits: profile?.ai_generations_remaining || 0,
    maxCredits: isProMember ? 50 : 5
  };
};

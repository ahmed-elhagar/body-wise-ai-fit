
import { useState } from 'react';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return {
    subscription,
    isLoading,
    isPro: false
  };
};
